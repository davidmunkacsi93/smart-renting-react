 import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import { withRouter } from 'react-router-dom';
import DbApi from '../api/DbApi'
import NotificationManager from '../manager/NotificationManager';

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
    this.state = {
      username: '',
      password: '',
      isLoggedIn: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  login() {
    DbApi.getDbUser(this.state.username).then((user) => {
      console.log(user);
      if (user == null) {
          throw new Error("User not found.");
      }
      NotificationManager.createNotification('success', 'Login successful.', "Login");
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
  