import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import ApartmentItem from '../components/Apartment/ApartmentItem';
import NotificationManager from '../manager/NotificationManager';

const HeadlineWrapper = styled.div`
  text-align: left;
  color: #ffffff;
`;

export class MyApartments extends React.Component {
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
    fetch('/api/getAccountWithApartments?address=' + this.state.account.address)
      .then(response => {
        if (response.status !== 200) throw Error("Error during querying apartments.");
        return response.json()
      })
      .then(body => {
        this.setState({apartments: body.account.apartments});
        this.state.apartments.map((apartment, i)  => {
          console.log(apartment)
        });
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
                    My Apartments
                  </MainHeadline>
                </HeadlineWrapper>
                <Row>
                  <Col>{this.state.apartments.map((apartment, i) => <ApartmentItem {...apartment} key={i}/>)}</Col>
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

  
export default withRouter(MyApartments);