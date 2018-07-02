import * as React from 'react';
import { object } from 'prop-types';
import { Container } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import ContractApi from '../api/ContractApi';

export class MyHomeView extends React.Component {
  constructor(props) {
    super(props);
    var account = UserManager.getCurrentAccount();
    this.state = {
      account: account,
      isLoggedIn: account != null
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
          { this.state.isLoggedIn
            ?
              <React.Fragment>
                <MainHeadline>
                  Hello {this.state.account.username}! Welcome back!
                </MainHeadline>
                <SecondaryHeadline>
                  Your current balance is: {ContractApi.getBalanceInEur(this.state.account.address)} EUR ({ContractApi.getBalanceInEth(this.state.account.address)} ETH)
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

MyHomeView.propTypes = {
  match: object.isRequired,
};

export default withRouter(MyHomeView);
  