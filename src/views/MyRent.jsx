import React from "react";
import styled from "styled-components";
import { Container, Button } from "reactstrap";
import ViewLayout from "../components/ViewLayout";
import { MainHeadline } from "../components/Headlines/MainHeadline";
// import createBrowserHistory from 'history/createBrowserHistory';
import { withRouter } from "react-router-dom";
import UserManager from "../manager/UserManager";
import { ErrorHeadline } from "../components/Headlines/MainHeadline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faTimes } from "@fortawesome/free-solid-svg-icons";
import { SecondaryHeadline } from "../components/Headlines/SecondaryHeadline";
import NotificationManager from "../manager/NotificationManager";
import ApartmentDetails from "../components/Apartment/ApartmentDetails";
import ContractApi from "../api/ContractApi";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import HistoryItem from "../components/History/HistoryItem";

const PrimaryButton = styled(Button)`
  margin-top: 15px;
  margin-left: 10px;
  background-color: #1f3651;
  color: #ffffff;
  width: 275px;
  display: block;
`;

export class MyRentView extends React.Component {
  constructor(props) {
    super(props);

    var account = UserManager.getCurrentAccount();
    var balanceInEur = ContractApi.getBalanceInEur(account.address);
    var balanceInEth = ContractApi.getBalanceInEth(account.address);

    ContractApi.UserContract.PermissionGranted().watch((err, res) => this.handlePermissionGranted(err, res));
    ContractApi.UserContract.PermissionDenied().watch((err, res) => this.handlePermissionDenied(err, res));
    ContractApi.UserContract.MessageSent().watch((err, res) => this.handleMessageReceived(err, res));

    this.state = {
      username: account.username,
      account: account,
      balanceInEur: balanceInEur,
      balanceInEth: balanceInEth,
      apartment: '',
      showPayRent: false,
      isLoggedIn: UserManager.isLoggedIn(),
      apartmentTransactions: [],
      messageNotificationSent: false
    };

    var apartmentId = window.location.href.split("/")[4];
    ContractApi.getApartmentById(this.state.account.address, apartmentId)
    .then(apartment => {
      this.setState({
        apartment: apartment,
        apartmentTransactions: apartment.transactions
      });
    });

    this.payRent = this.payRent.bind(this);
    this.breakContract = this.breakContract.bind(this);
  }

  handlePermissionDenied = (_, res) => {
    if (res.args.to !== this.state.account.address) return;
    NotificationManager.createNotification(
      "error",
      "The owner of the apartment denied your request.",
      "Permission to break up contract"
    );
    this.setState({ showPayRent: false });
  };

  handlePermissionGranted = (_, res) => {
    if (res.args.to !== this.state.account.address) return;
    NotificationManager.createNotification(
      "success",
      "The owner of the apartment accepted your request. You can now pay.",
      "Permission to break up"
    );
    this.setState({ showPayRent: true });
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
    addResponseMessage(res.args.message);
  };

  handleNewUserMessage = message => {
    ContractApi.UserContract.sendMessage(this.state.apartment.owner, this.state.account.username, message, { from: this.state.account.address });
  };

  payRent = async () => {
    const transactionInfo = {
      apartmentId: this.state.apartment.id,
      deposit: this.state.apartment.deposit,
      username: this.state.account.username,
      rent: this.state.apartment.rent,
      from: this.state.account.address,
      to: this.state.apartment.owner
    };
    await ContractApi.payRent(transactionInfo);
    await ContractApi.getApartmentById(this.state.account.address, this.state.apartment.id)
      .then(apartment => {
        this.setState({
          apartment: apartment,
          apartmentTransactions: apartment.transactions,
          balanceInEur: ContractApi.getBalanceInEur(this.state.account.address),
          balanceInEth: ContractApi.getBalanceInEth(this.state.account.address),
        });
      });
  };

  breakContract() {

  }

  render() {
    return (
      <ViewLayout>
        <Container>
          {this.state.isLoggedIn ? (
            <React.Fragment>
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
                  <SecondaryHeadline>Apartment history</SecondaryHeadline>
                  {this.state.apartmentTransactions.map((transaction, i) => (
                    <HistoryItem {...transaction} key={i} />
                  ))}
                </React.Fragment>
              ) : null}
              <Widget
                title={this.state.apartment.username}
                subtitle=""
                handleNewUserMessage={this.handleNewUserMessage}
              />
              <React.Fragment>
                <PrimaryButton
                  secondary="true"
                  onClick={() => {
                    this.payRent();
                  }}
                >
                  PAY RENT<FontAwesomeIcon
                    className="margin-left-10"
                    icon={faCoins}
                  />
                </PrimaryButton>
              </React.Fragment>
              <React.Fragment>
                <PrimaryButton
                  secondary="true"
                  onClick={() => {
                    this.breakContract();
                  }}
                >
                  BREAK CONTRACT<FontAwesomeIcon
                    className="margin-left-10"
                    icon={faTimes}
                  />
                </PrimaryButton>
              </React.Fragment>
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

export default withRouter(MyRentView);