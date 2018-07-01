import React from 'react';
// import styled from 'styled-components';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
// import createBrowserHistory from 'history/createBrowserHistory';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import { ErrorHeadline } from '../components/Headlines/MainHeadline'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import NotificationManager from '../manager/NotificationManager';
import ApartmentDetails from '../components/Apartment/ApartmentDetails';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import openSocket from 'socket.io-client';

// const PrimaryButton = styled(Button)`
//   margin-top: 20px;
//   background-color: #1f3651;
//   color: #ffffff;
//   width: 180px;
// `;

// const history = createBrowserHistory();
export class ApartmentDetailsLandlordView extends React.Component {
  constructor(props) {
    super(props);

    var account = UserManager.getCurrentAccount();
    const socket = openSocket('http://192.168.0.6:8000?address=' + account.address);
    socket.on('receiveMessage', message => this.handleReceiveMessage(message));
    socket.on('handshake', data => this.handleHandshake(data));

    this.state = {
      account: account,
      tenantName: '',
      tenantAddress: '',
      apartment: '',
      isLoggedIn: UserManager.isLoggedIn(),
      socket: socket
    }
  }

  componentWillMount() {
    var apartmentId = window.location.href.split('/')[4];
    var fetchUrl = '/api/getAccountByApartmentId?apartmentId=' + apartmentId;
    fetch(fetchUrl)
      .then(response => {
        if (response.status !== 200) throw Error("Error during querying apartments.");
        return response.json()
      })
      .then(body => {
        let parsedAccount = JSON.parse(body.account);
        var apartment;
        parsedAccount.apartments.forEach(a => {
          if (a._id === apartmentId) {

          }
          a["username"] = parsedAccount.user.username;
          apartment = a;
        });
        this.setState({apartment: apartment});
      })
      .catch(err => {
        NotificationManager.createNotification('error', err.message, 'Querying apartment')
      });
  }

  handleHandshake = (data) => {
    this.setState({ tenantName: data.username, tenantAddress: data.from });
    NotificationManager.createNotification('info', data.username + ' is currently looking at your apartment.')
  }

  handleReceiveMessage = (message) => {
    addResponseMessage(message);
  }

  handleNewUserMessage = (message) => {
    if (this.state.tenantAddress === '') return;
    this.state.socket.emit('sendMessage', 
      { message: message, address: this.state.tenantAddress });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
        { this.state.isLoggedIn
              ?
              <React.Fragment>
                <Widget 
                  title={this.state.tenantName}
                  subtitle=""
                  handleNewUserMessage={this.handleNewUserMessage}
                  />
                <MainHeadline>
                  Apartment details
                </MainHeadline>
                <ApartmentDetails {...this.state.apartment}/>
                <SecondaryHeadline>
                  Apartment history
                </SecondaryHeadline> 

              </React.Fragment>
              :
              <React.Fragment>
                <ErrorHeadline>
                  You are not logged in currently! Please go to the homepage to log in.
                </ErrorHeadline>
              </React.Fragment>
            }
        </Container>
      </ViewLayout>
    );
  }
}

  
export default withRouter(ApartmentDetailsLandlordView);