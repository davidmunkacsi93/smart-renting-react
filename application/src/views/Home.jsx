 import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, InputGroup, Button } from 'reactstrap';
import { createNotification } from '../manager/NotificationManager'
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import { withRouter } from 'react-router-dom';
import { getDbUser } from '../api/DbApi'
import 'react-notifications/lib/notifications.css';

const PrimaryButton = styled(Button)`
  margin-top: 20px;
  background-color: #1f3651;
  color: #ffffff;
  width: 150px;
`;

const StyledInput = styled(Input)`
  width: 20% !important;
`;

export class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.value});
  }

  login() {
    getDbUser(this.state.username).then((user) => {
      console.log(user);
      if (user == null) {
          throw {
            type: 'error',
            name: 'Login',
            message: "User not found."
          }
      }
      createNotification('success', 'Login successful.', "Login");
    }).catch(error => {
      createNotification('error', error.message, "Login");
    });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
          <MainHeadline>
            Welcome to the Ehereum based smart renting application!
          </MainHeadline>
          <SecondaryHeadline>
            Please log in to continue!
          </SecondaryHeadline>
          <InputGroup size="m">
            <StyledInput placeholder="Username" value={this.state.username} onChange={this.handleChange}/>
          </InputGroup>
          <PrimaryButton onClick={() => this.login() }>
              Login
          </PrimaryButton>
        </Container>
      </ViewLayout>
    );
  }
}

HomeView.propTypes = {
  match: object.isRequired,
};

export default withRouter(HomeView);
  