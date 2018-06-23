import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, InputGroup, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import { createUser } from '../api/DbApi';
import { withRouter } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
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

export class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.value});
  }

  createNotification = (type, message) => {
    switch(type) {
      case 'success':
        NotificationManager.success(message, 'Creating user', 3000);
        break;
      case 'error':
        NotificationManager.error(message, 'Creating user', 3000);
        break;
      default:
        break;
    }
  }

  submit() {
    createUser(this.state.username).then(() => {  
         this.createNotification('success', 'User created.');
        }).catch(err => {
           this.createNotification('error', err.message);
        });

  }

  render() {
    return (
      <ViewLayout>
        <Container>
          <SecondaryHeadline>
              Fill out the following form to register:
          </SecondaryHeadline>
          <InputGroup size="m">
            <StyledInput placeholder="Username" value={this.state.username} onChange={this.handleChange}/>
          </InputGroup>
          <PrimaryButton onClick={() => this.submit() }>
              CREATE
          </PrimaryButton>
        </Container>
        <NotificationContainer/>
      </ViewLayout>
    );
  }
}

RegisterView.propTypes = {
  match: object.isRequired,
};

export default withRouter(RegisterView);