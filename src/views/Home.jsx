 import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
import { withRouter } from 'react-router-dom';
import NotificationManager from '../manager/NotificationManager';
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

const StyledSpan = styled.span`
 color:white;
`

export class HomeView extends React.Component {
  constructor(props) {
    super(props);

    var currentUser = UserManager.getCurrentUser();
    if (currentUser != null) {
      window.location.reload();
    }

    this.state = {
      username: '',
      password: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  login() {
    UserManager.login(this.state.username, this.state.password).then(result => {
      if (result) {
        window.location.reload();
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
            <React.Fragment>
              <MainHeadline>
                Welcome to the Ehereum based smart renting application!
              </MainHeadline>
              <StyledSpan>
                Please log in to continue!
              </StyledSpan>
              <StyledInput placeholder="Username" name="username" value={this.state.username} onChange={this.handleChange}/>
              <StyledInput type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
              <PrimaryButton onClick={() => this.login() }>
                  Login
              </PrimaryButton>
            </React.Fragment>
        </Container>
      </ViewLayout>
    );
  }
}

HomeView.propTypes = {
  match: object.isRequired,
};

export default withRouter(HomeView);
  