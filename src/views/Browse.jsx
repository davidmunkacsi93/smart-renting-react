import React from 'react';
import styled from 'styled-components';
import { Container, Row, Col } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import ApartmentItemExtended from '../components/Apartment/ApartmentItemExtended';
import ContractApi from '../api/ContractApi';

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
    ContractApi.getAccounts().forEach(account => {
      if (account !== this.state.account.address) {
        ContractApi.getApartments(account).then(apartments => {
          var resultApartments = [];
          apartments.forEach(apartment => {
            resultApartments.push(apartment);
          });
          this.setState({apartments: resultApartments});
        });
      }
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