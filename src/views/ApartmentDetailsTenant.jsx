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
import { faCoins, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { SecondaryHeadline } from "../components/Headlines/SecondaryHeadline";
import NotificationManager from "../manager/NotificationManager";
import ApartmentDetails from "../components/Apartment/ApartmentDetails";
import ContractApi from "../api/ContractApi";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import openSocket from "socket.io-client";
import HistoryItem from "../components/History/HistoryItem";

const PrimaryButton = styled(Button)`
  margin-top: 15px;
  margin-left: 10px;
  background-color: #1f3651;
  color: #ffffff;
  width: 275px;
  display: block;
`;

const host = require("../../package.json").host;

// const history = createBrowserHistory();
export class ApartmentDetailsTenantView extends React.Component {
  constructor(props) {
    super(props);

    var account = UserManager.getCurrentAccount();

    const socket = openSocket(
      "http://" + host + ":8000?address=" + account.address
    );
    socket.on("receiveMessage", message => this.handleReceiveMessage(message));
    socket.on("permissionGranted", data => this.handlePermissionGranted(data));
    socket.on("permissionDenied", data => this.handlePermissionDenied(data));

    var balanceInEur = ContractApi.getBalanceInEur(account.address);
    var balanceInEth = ContractApi.getBalanceInEth(account.address);
    this.state = {
      username: "",
      account: account,
      balanceInEur: balanceInEur,
      balanceInEth: balanceInEth,
      apartment: "",
      socket: socket,
      showPayRent: false,
      isLoggedIn: UserManager.isLoggedIn(),
      apartmentTransactions: []
    };

    this.rentApartment = this.rentApartment.bind(this);
    this.requestPermission = this.requestPermission.bind(this);
  }

  handleReceiveMessage = message => {
    addResponseMessage(message);
  };

  handlePermissionDenied = _ => {
    NotificationManager.createNotification(
      "error",
      "The owner of the apartment denied your request.",
      "Permission to pay"
    );
    this.setState({ showPayRent: false });
  };

  handlePermissionGranted = _ => {
    NotificationManager.createNotification(
      "success",
      "The owner of the apartment accepted your request. You can now pay.",
      "Permission to pay"
    );
    this.setState({ showPayRent: true });
  };

  handleNewUserMessage = message => {
    this.state.socket.emit("sendMessage", {
      message: message,
      address: this.state.apartment.ownerAddress
    });
  };

  componentWillMount() {
    var apartmentId = window.location.href.split("/")[4];
    var fetchUrl = "/api/getAccountByApartmentId?apartmentId=" + apartmentId;
    fetch(fetchUrl)
      .then(response => {
        if (response.status !== 200)
          throw Error("Error during querying apartments.");
        return response.json();
      })
      .then(body => {
        let parsedAccount = JSON.parse(body.account);
        var apartment;
        parsedAccount.apartments.forEach(a => {
          if (a._id === apartmentId) {
          }
          a["ownerAddress"] = parsedAccount.address;
          a["username"] = parsedAccount.user.username;
          apartment = a;
        });
        this.setState({ apartment: apartment });
        var transactionUrl =
          "/api/getTransactionsByApartmentId?apartmentId=" + apartment._id;
        fetch(transactionUrl)
          .then(response => {
            if (response.status !== 200)
              throw Error("Error during querying transactions.");
            return response.json();
          })
          .then(body => {
            let parsedTransacitions = JSON.parse(body.transactions);
            var transactions = [];
            parsedTransacitions.forEach(t => {
              ContractApi.verifyTransaction(t, this.state.account.address);
              transactions.push(t);
            });
            this.setState({ apartmentTransactions: transactions });
            if (transactions.length > 0) {
              this.setState({ showApartmentTransactions: true });
            }
          })
          .catch(err => {
            NotificationManager.createNotification(
              "error",
              err.message,
              "Querying transactions"
            );
          });
        this.state.socket.emit("handshake", {
          from: this.state.account.address,
          to: this.state.apartment.ownerAddress,
          username: this.state.account.user.username
        });
      })
      .catch(err => {
        NotificationManager.createNotification(
          "error",
          err.message,
          "Querying apartment"
        );
      });
  }

  getTransactionsById = async apartmentId => {
    var transactionUrl =
      "/api/getTransactionsByApartmentId?apartmentId=" + apartmentId;
    fetch(transactionUrl)
      .then(response => {
        if (response.status !== 200)
          throw Error("Error during querying transactions.");
        return response.json();
      })
      .then(body => {
        let parsedTransacitions = JSON.parse(body.transactions);
        var transactions = [];
        console.log(parsedTransacitions);
        parsedTransacitions.forEach(t => {
          ContractApi.verifyTransaction(t, this.state.account.address);
          transactions.push(t);
        });
        this.setState({ apartmentTransactions: transactions });
        if (transactions.length > 0) {
          this.setState({ showApartmentTransactions: true });
        }
      })
      .catch(err => {
        NotificationManager.createNotification(
          "error",
          err.message,
          "Querying transactions"
        );
      });
  };

  rentApartment = async () => {
    const transactionInfo = {
      apartmentId: this.state.apartment._id,
      deposit: this.state.apartment.deposit,
      username: this.state.account.user.username,
      rent: this.state.apartment.rent,
      from: this.state.account.address,
      to: this.state.apartment.ownerAddress
    };
    ContractApi.rentApartment(transactionInfo);
    await this.getTransactionsById(this.state.apartment._id);
    this.setState({
      balanceInEur: ContractApi.getBalanceInEur(this.state.account.address)
    });
    this.setState({
      balanceInEth: ContractApi.getBalanceInEth(this.state.account.address)
    });
  };

  requestPermission() {
    this.state.socket.emit("requestPermissionToPay", {
      from: this.state.account.address,
      to: this.state.apartment.ownerAddress,
      username: this.state.account.user.username
    });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
          {this.state.isLoggedIn ? (
            <React.Fragment>
              <MainHeadline>Apartment transaction details</MainHeadline>
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
              <PrimaryButton
                secondary="true"
                onClick={() => {
                  this.requestPermission();
                }}
              >
                REQUEST PERMISSION TO PAY<FontAwesomeIcon
                  className="margin-left-10"
                  icon={faUnlock}
                />
              </PrimaryButton>
              {this.state.showPayRent ? (
                <React.Fragment>
                  <PrimaryButton
                    secondary="true"
                    onClick={() => {
                      this.rentApartment();
                    }}
                  >
                    RENT APARTMENT<FontAwesomeIcon
                      className="margin-left-10"
                      icon={faCoins}
                    />
                  </PrimaryButton>
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

export default withRouter(ApartmentDetailsTenantView);
