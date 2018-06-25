 import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, Button } from 'reactstrap';
import createBrowserHistory from 'history/createBrowserHistory'
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import { withRouter } from 'react-router-dom';
import NotificationManager from '../manager/NotificationManager';
import ContractApi from '../api/ContractApi';
import UserManager from '../manager/UserManager';

const PrimaryButton = styled(Button)`
  margin-top: 20px;
  background-color: #1f3651;
  color: #ffffff;
  width: 150px;
`;

const StyledInput = styled(Input)`
  width: 40%;
  margin-top: 10px;
  display: block;
`

export class HomeView extends React.Component {
  constructor(props) {
    super(props);

    var currentUser = UserManager.getCurrentUser();
    if (currentUser != null) {
      this.goToMyHome();
    }

    this.state = {
      username: '',
      password: '',
      isLoggedIn: UserManager.isLoggedIn()
    }
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  goToMyHome() {
    const history = createBrowserHistory();
    history.push('/MyHome');
    window.location.reload();
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  login() {
    UserManager.login(this.state.username, this.state.password).then(result => {
      if (result) {
        NotificationManager.createNotification('success', 'Login successful.', "Login");
        this.goToMyHome();
      } else {
        throw new Error("Login failed.");
      }
    }).catch(error => {
      NotificationManager.createNotification('error', error.message, "Login");
    });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
          { this.state.isLoggedIn
            ?
              <React.Fragment>
                <MainHeadline>
                  Welcome David to the based smart renting application!
                </MainHeadline>
              </React.Fragment>
            :
              <React.Fragment>
                <MainHeadline>
                  Welcome to the Ehereum based smart renting application!
                </MainHeadline>
                <SecondaryHeadline>
                  Please log in to continue!
                </SecondaryHeadline>
                <StyledInput placeholder="Username" name="username" value={this.state.username} onChange={this.handleChange}/>
                <StyledInput type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
                <PrimaryButton onClick={() => this.login() }>
                    Login
                </PrimaryButton>
              </React.Fragment>
          }

          
        </Container>
      </ViewLayout>
    );
  }
}

HomeView.propTypes = {
  match: object.isRequired,
};

export default withRouter(HomeView);
  