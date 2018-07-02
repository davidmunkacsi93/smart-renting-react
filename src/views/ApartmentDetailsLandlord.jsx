import React from "react";
import { Container } from "reactstrap";
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
import openSocket from "socket.io-client";
import PermissionRequest from "../components/Request/PermissionRequest";
import ContractApi from "../api/ContractApi";
import HistoryItem from "../components/History/HistoryItem";

const host = require("../../package.json").host;

// const history = createBrowserHistory();
export class ApartmentDetailsLandlordView extends React.Component {
  constructor(props) {
    super(props);

    var account = UserManager.getCurrentAccount();
    const socket = openSocket(
      "http://" + host + ":8000?address=" + account.address
    );
    socket.on("receiveMessage", message => this.handleReceiveMessage(message));
    socket.on("handshake", data => this.handleHandshake(data));
    socket.on("requestPermissionToPay", data =>
      this.handleRequestPermission(data)
    );

    var balanceInEur = ContractApi.getBalanceInEur(account.address);
    var balanceInEth = ContractApi.getBalanceInEth(account.address);
    this.state = {
      account: account,
      tenantName: "",
      tenantAddress: "",
      apartment: "",
      balanceInEur: balanceInEur,
      balanceInEth: balanceInEth,
      isLoggedIn: UserManager.isLoggedIn(),
      socket: socket,
      showPermissionRequest: false,
      permissionRequests: [],
      showApartmentTransactions: false,
      apartmentTransactions: []
    };
  }

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
            a["username"] = parsedAccount.username;
            apartment = a;
          }
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
      })
      .catch(err => {
        NotificationManager.createNotification(
          "error",
          err.message,
          "Querying apartment"
        );
      });
  }

  handleHandshake = data => {
    this.setState({ tenantName: data.username, tenantAddress: data.from });
    NotificationManager.createNotification(
      "info",
      data.username + " is currently looking at your apartment."
    );
  };

  handleRequestPermission = data => {
    this.state.permissionRequests.push(data);
    this.setState({ showPermissionRequest: true });
    NotificationManager.createNotification(
      "info",
      data.username +
        " wants to rent your apartment. You can accept or decline his/her request."
    );
  };

  handleAccept = () => {
    var array = [...this.state.permissionRequests]; // make a separate copy of the array
    array.splice(0, 1);
    this.setState({ permissionRequests: array });
    if (array.length === 0) {
      this.setState({ showPermissionRequest: false });
    }
    this.state.socket.emit("permissionGranted", {
      address: this.state.tenantAddress
    });
  };

  handleDecline = () => {
    var array = [...this.state.permissionRequests]; // make a separate copy of the array
    array.splice(0, 1);
    this.setState({ permissionRequests: array });
    if (array.length === 0) {
      this.setState({ showPermissionRequest: false });
    }
    this.state.socket.emit("permissionDenied", {
      address: this.state.tenantAddress
    });
  };

  handleReceiveMessage = message => {
    addResponseMessage(message);
  };

  handleNewUserMessage = message => {
    if (this.state.tenantAddress === "") return;
    this.state.socket.emit("sendMessage", {
      message: message,
      address: this.state.tenantAddress
    });
  };

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
