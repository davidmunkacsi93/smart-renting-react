import React from "react";
import { Container, Row, Col, Input, Button } from "reactstrap";
import ViewLayout from "../components/ViewLayout";
import { MainHeadline } from "../components/Headlines/MainHeadline";
import { withRouter } from "react-router-dom";
import UserManager from "../manager/UserManager";
import { ErrorHeadline } from "../components/Headlines/MainHeadline";
import { SecondaryHeadline } from "../components/Headlines/SecondaryHeadline";
import NotificationManager from "../manager/NotificationManager";
import ApartmentDetails from "../components/Apartment/ApartmentDetails";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import PermissionRequest from "../components/Request/PermissionRequest";
import ContractApi from "../api/ContractApi";
import HistoryItem from "../components/History/HistoryItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons";
import styled from 'styled-components';

const StyledInput = styled(Input)`
  margin-top: 10px;
  display: block;
`
const PrimaryButton = styled(Button)`
  margin-top: 20px;
  background-color: #1f3651;
  color: #ffffff;
  width: 300px;
`;

export class ApartmentDetailsLandlordView extends React.Component {
  constructor(props) {
    super(props);

    var account = UserManager.getCurrentAccount();

    var balanceInEur = ContractApi.getBalanceInEur(account.address);
    var balanceInEth = ContractApi.getBalanceInEth(account.address);

    ContractApi.UserContract.PermissionRequested().watch((err, res) => this.handleRequestPermission(err, res));
    ContractApi.UserContract.MessageSent().watch((err, res) => this.handleMessageReceived(err, res));
    ContractApi.ApartmentContract.PaymentReceived().watch((err, res) => this.handlePaymentReceived(err, res));
    ContractApi.ApartmentContract.IssueCreated().watch((err, res) => this.handleIssueCreated(err, res));
    ContractApi.ApartmentContract.ContractTerminated().watch((err, res) => this.handleContractTerminated(err, res));

    this.state = {
      account: account,
      tenantName: "",
      tenantAddress: "",
      apartment: "",
      balanceInEur: balanceInEur,
      balanceInEth: balanceInEth,
      isLoggedIn: UserManager.isLoggedIn(),
      subtitle: '',
      message: '',
      showPermissionRequest: false,
      permissionRequests: [],
      showApartmentTransactions: false,
      apartmentTransactions: [],
      messageNotificationSent: false
    };

    var apartmentId = window.location.href.split("/")[4];
    ContractApi.getApartmentById(this.state.account.address, apartmentId).then(
      apartment => {
        this.setState({
          apartment: apartment,
          apartmentTransactions: apartment.transactions
        });
      }
    );
    this.handleChange = this.handleChange.bind(this);
    this.createTransaction = this.createTransaction.bind(this);
  }

  refreshBalance = () => {
    this.setState({
      balanceInEur: ContractApi.getBalanceInEur(this.state.account.address),
      balanceInEth: ContractApi.getBalanceInEth(this.state.account.address)
    });
  }

  handleAccept = () => {
    var array = [...this.state.permissionRequests];
    array.splice(0, 1);
    this.setState({ permissionRequests: array });
    if (array.length === 0) {
      this.setState({ showPermissionRequest: false });
    }
    ContractApi.UserContract.grantPermission(this.state.tenantAddress, this.state.account.username, "The owner of the aparment accepted your request.", { from: this.state.account.address });
  };

  
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value});
  }

  handleDecline = () => {
    var array = [...this.state.permissionRequests];
    array.splice(0, 1);
    this.setState({ permissionRequests: array });
    if (array.length === 0) {
      this.setState({ showPermissionRequest: false });
    }
    ContractApi.UserContract.denyPermission(this.state.tenantAddress, this.state.account.username,  "The owner of the aparment denied your request.", { from: this.state.account.address });
  };

  handleRequestPermission = (_, res) => {
    if (res.args.to !== this.state.account.address) return;
    this.state.permissionRequests.push({ username: res.args.username, message: res.args.message });
    this.setState({ showPermissionRequest: true });
    this.setState({ tenantAddress: res.args.from });
    NotificationManager.createNotification(
      "info",
      res.args.username +
        " wants to rent your apartment. You can accept or decline his/her request."
    );
  };

  handleContractTerminated = async (_, res) => {
    if (res.args.to !== this.state.account.address) return;
    this.setState({ tenantAddress: res.args.from });
    const transactionInfo = {
      apartmentId: this.state.apartment.id,
      deposit: this.state.apartment.deposit,
      username: this.state.account.username,
      from: this.state.account.address,
      to: res.args.from,
      transferBack: true
    };
    await ContractApi.transferDeposit(transactionInfo);
    ContractApi.getApartmentById(this.state.account.address, this.state.apartment.id)
        .then(apartment => {
            this.setState({
              apartment: apartment,
              apartmentTransactions: apartment.transactions,
              balanceInEur: ContractApi.getBalanceInEur(this.state.account.address),
              balanceInEth: ContractApi.getBalanceInEth(this.state.account.address)
            });
            NotificationManager.createNotification(
              "info",
              res.args.username +
                " terminated the contract."
            );
      });

  };

  handlePaymentReceived = async (_, res) => {
    if (res.args.to !== this.state.account.address) return;
    NotificationManager.createNotification(
      "info",
      "[" + res.args.username + "] paid " + res.args.value + " €."
    );
    ContractApi.approveRent(this.state.apartment.id, res.args.from, this.state.account.address).then(() => {
      ContractApi.getApartmentById(this.state.account.address, this.state.apartment.id)
        .then(apartment => {
            this.setState({
              apartment: apartment,
              apartmentTransactions: apartment.transactions,
              balanceInEur: ContractApi.getBalanceInEur(this.state.account.address),
              balanceInEth: ContractApi.getBalanceInEth(this.state.account.address)
        });
      });
    });
  };

  handleIssueCreated = async (_, res) => {
    if (res.args.to !== this.state.account.address) return;
    NotificationManager.createNotification(
      "info",
      "[" + res.args.username + "] created an issue."
    );
    ContractApi.getApartmentById(this.state.account.address, this.state.apartment.id)
      .then(apartment => {
          this.setState({
            apartment: apartment,
            apartmentTransactions: apartment.transactions,
            balanceInEur: ContractApi.getBalanceInEur(this.state.account.address),
            balanceInEth: ContractApi.getBalanceInEth(this.state.account.address)
      });
    });
  };

  handleMessageReceived = (_, res) => {
    if (res.args.to !== this.state.account.address) return;
    if(!this.state.messageNotificationSent) {
      NotificationManager.createNotification(
        "info",
        res.args.username + " sent you a message."
      );
      this.setState({ messageNotificationSent: true });
    }
    this.setState({ 
      tenantAddress: res.args.from,
      tenantName: res.args.username
    })
    addResponseMessage(res.args.message);
  };

  handleNewUserMessage = message => {
    ContractApi.UserContract.sendMessage(this.state.tenantAddress, this.state.account.username, message, { from: this.state.account.address });
  };

  createTransaction = async () => {
    await ContractApi.createIssue(this.state.apartment.id, this.state.message, this.state.apartment.tenant, this.state.account.address, this.state.account.username);
    await ContractApi.getApartmentById(this.state.account.address, this.state.apartment.id)
    .then(apartment => {
      NotificationManager.createNotification('success', 'Issue post.', 'Create an issue');
      this.setState({
        apartment: apartment,
        apartmentTransactions: apartment.transactions,
      });
    });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
          {this.state.isLoggedIn ? (
            <React.Fragment>
              <Widget
                title={this.state.tenantName}
                subtitle=""
                handleNewUserMessage={this.handleNewUserMessage}
              />
              <MainHeadline>Apartment details</MainHeadline>
              <SecondaryHeadline>
                Your current balance is: {this.state.balanceInEur} EUR ({
                  this.state.balanceInEth
                }{" "}
                ETH)
              </SecondaryHeadline>
              <ApartmentDetails {...this.state.apartment} />
              {this.state.apartmentTransactions.length > 0 ? (
                <React.Fragment>
                  <SecondaryHeadline>
                    Apartment transaction history
                  </SecondaryHeadline>
                  {this.state.apartmentTransactions.map((transaction, i) => (
                    <HistoryItem {...transaction} key={i} />
                  ))}
                  <Row>
                      <Col sm="12" md="12">
                          <StyledInput type="textarea" placeholder="Message" name="message" value={this.state.message} onChange={this.handleChange} />
                      </Col>
                  </Row>
                  <PrimaryButton
                      secondary="true"
                      onClick={() => {
                        this.createTransaction();
                      }}
                    >
                      CREATE TRANSACTION<FontAwesomeIcon
                        className="margin-left-10"
                        icon={faTasks}
                      />
                    </PrimaryButton>
                </React.Fragment>
              ) : null}
              {this.state.showPermissionRequest ? (
                <React.Fragment>
                  <SecondaryHeadline>Permission requests</SecondaryHeadline>
                  {this.state.permissionRequests.map((request, i) => (
                    <PermissionRequest
                      {...request}
                      handleAccept={this.handleAccept}
                      handleDecline={this.handleDecline}
                      key={i}
                    />
                  ))}
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <ErrorHeadline>
                You are not logged in currently! Please go to the homepage to
                log in.
              </ErrorHeadline>
            </React.Fragment>
          )}
        </Container>
      </ViewLayout>
    );
  }
}

export default withRouter(ApartmentDetailsLandlordView);
