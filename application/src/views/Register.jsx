import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, InputGroup, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline';
import { createUser } from '../manager/UserManager';
import { createNotification } from '../manager/NotificationManager';
import { withRouter } from 'react-router-dom';

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

export class RegisterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value});
  }

  submit() {

    createUser(this.state.username, this.state.password).then(() => {  
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
          <div>
            <StyledInput placeholder="Username" name="username" value={this.state.username} onChange={this.handleChange}/>
            <StyledInput placeholder="Password" type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
            <PrimaryButton onClick={() => this.submit() }>
                CREATE
            </PrimaryButton>
          </div>
        </Container>
      </ViewLayout>
    );
  }
}

RegisterView.propTypes = {
  match: object.isRequired,
};

export default withRouter(RegisterView);