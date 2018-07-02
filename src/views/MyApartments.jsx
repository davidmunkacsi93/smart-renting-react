import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import ApartmentItem from '../components/Apartment/ApartmentItem';
import ContractApi from '../api/ContractApi';

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
    ContractApi.getApartments(this.state.account.address)
      .then(apartments => {
        this.setState({ apartments: apartments });
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