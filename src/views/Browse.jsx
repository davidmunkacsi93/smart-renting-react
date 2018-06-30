import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import ApartmentItemExtended from '../components/Apartment/ApartmentItemExtended';
import NotificationManager from '../manager/NotificationManager';

const HeadlineWrapper = styled.div`
  text-align: left;
  color: #ffffff;
`;

export class BrowseView extends React.Component {
  constructor(props) {
    super(props);
    var account = UserManager.getCurrentAccount();
    this.state = {
      account: account,
      apartments: [],
      isLoggedIn: UserManager.isLoggedIn()
    }
  }

  componentWillMount() {
    fetch('/api/getAccountsWithAvailableApartments')
      .then(response => {
        if (response.status !== 200) throw Error("Error during querying apartments.");
        return response.json()
      })
      .then(body => {
        let parsed = JSON.parse(body.accounts);
        let apartments = [];
        parsed.forEach(account => {
            account.apartments.forEach(apartment => {
                apartment["username"] = account.user.username;
                apartments.push(apartment);
            });
        });
        console.log(apartments);
        this.setState({apartments: apartments});
      })
      .catch(err => {
        NotificationManager.createNotification('error', err.message, 'Querying apartments')
      });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
        { this.state.isLoggedIn
              ?
              <React.Fragment>
                <HeadlineWrapper>
                  <MainHeadline>
                    Apartments currently available
                  </MainHeadline>
                </HeadlineWrapper>
                <Row>
                  <Col>{this.state.apartments.map((apartment, i) => <ApartmentItemExtended {...apartment} key={i}/>)}</Col>
                </Row>
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

  
export default withRouter(BrowseView);