import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, InputGroup, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import { createUser } from '../api/DbApi';
import { createNotification } from '../manager/NotificationManager';
import { withRouter } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
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



  submit() {
    createUser(this.state.username).then(() => {  
          createNotification('success', 'User created! You can now login on the homepage.', "Create user");
        }).catch(err => {
          createNotification('error', err.message, "Create user");
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
      </ViewLayout>
    );
  }
}

RegisterView.propTypes = {
  match: object.isRequired,
};

export default withRouter(RegisterView);