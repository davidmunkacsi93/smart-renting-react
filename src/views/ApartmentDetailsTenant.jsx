import React from 'react';
import styled from 'styled-components';
import { Container, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
// import createBrowserHistory from 'history/createBrowserHistory';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import { ErrorHeadline } from '../components/Headlines/MainHeadline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import NotificationManager from '../manager/NotificationManager';
import ApartmentDetails from '../components/Apartment/ApartmentDetails';
import ContractApi from '../api/ContractApi';
import { Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const PrimaryButton = styled(Button)`
  margin-top: 15px;
  margin-left: 10px;
  background-color: #1f3651;
  color: #ffffff;
  width: 180px;
`;

const StyledSpan = styled.span`
 display:block;
 margin-top: 20px;
 margin-bottom: 20px;
 color:white;
`

// const history = createBrowserHistory();
export class ApartmentDetailsTenantView extends React.Component {
  constructor(props) {
    super(props);

    var account = UserManager.getCurrentAccount();
    var balanceInEur = ContractApi.getBalanceInEur(account.address);
    var balanceInEth = ContractApi.getBalanceInEth(account.address);
    this.state = {
      username: '',
      account: account,
      balanceInEur: balanceInEur,
      balanceInEth: balanceInEth,
      apartment: '',
      isLoggedIn: UserManager.isLoggedIn()
    }

    this.rentApartment = this.rentApartment.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
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
          a["ownerAddress"] = parsedAccount.address;
          a["username"] = parsedAccount.user.username;
          apartment = a;
        });
        this.setState({apartment: apartment});
      })
      .catch(err => {
        NotificationManager.createNotification('error', err.message, 'Querying apartment')
      });
  }

  rentApartment() {
    const transactionInfo = {
      deposit: this.state.apartment.deposit,
      rent: this.state.apartment.rent,
      from: this.state.account.address,
      to: this.state.apartment.ownerAddress
    };
    ContractApi.rentApartment(transactionInfo);
    this.setState({balanceInEur: ContractApi.getBalanceInEur(this.state.account.address)});
    this.setState({balanceInEth: ContractApi.getBalanceInEth(this.state.account.address)});
  }

  sendMessage() {

  }
  
  render() {
    return (
      <ViewLayout>
        <Container>
        { this.state.isLoggedIn
              ?
              <React.Fragment>
                <MainHeadline>
                  Apartment details
                </MainHeadline>
                <ApartmentDetails {...this.state.apartment}/>
                <SecondaryHeadline>
                  Apartment history
                </SecondaryHeadline>
                <StyledSpan>
                  Your current balance is: {this.state.balanceInEur} EUR ({this.state.balanceInEth} ETH)
                </StyledSpan>
                <Widget/>
                <PrimaryButton secondary="true" onClick={() => { this.sendMessage() }}>
                  SEND MESSAGE<FontAwesomeIcon className="margin-left-10" icon={faEnvelope}/>
                </PrimaryButton>  
                <PrimaryButton secondary="true" onClick={() => { this.rentApartment() }}>
                  RENT APARTMENT<FontAwesomeIcon className="margin-left-10" icon={faCoins}/>
                </PrimaryButton>  
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

  
export default withRouter(ApartmentDetailsTenantView);