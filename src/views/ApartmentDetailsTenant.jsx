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
import { faMoneyBill, faCoins } from '@fortawesome/free-solid-svg-icons';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import NotificationManager from '../manager/NotificationManager';
import ApartmentDetails from '../components/Apartment/ApartmentDetails';

const PrimaryButton = styled(Button)`
  margin-top: 20px;
  background-color: #1f3651;
  color: #ffffff;
  width: 180px;
`;

// const history = createBrowserHistory();
export class ApartmentDetailsTenantView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      apartment: '',
      isLoggedIn: UserManager.isLoggedIn()
    }

    this.rentApartment = this.rentApartment.bind(this);
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
          if (a._id == apartmentId) {

          }
          a["username"] = parsedAccount.user.username;
          apartment = a;
        });
        console.log(apartment);
        this.setState({apartment: apartment});
      })
      .catch(err => {
        NotificationManager.createNotification('error', err.message, 'Querying apartment')
      });
  }

  rentApartment() {

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