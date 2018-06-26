import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import UserManager from '../manager/UserManager';
import NotificationManager from '../manager/NotificationManager';
import { withRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

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
 margin-top: 30px;
 color:white;
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

    UserManager.createUser(this.state.username, this.state.password).then(() => {  
      NotificationManager.createNotification('success', 'Registration successful! You will be soon redirected to the home page.', "Register");
      setTimeout(function () {
        const history = createBrowserHistory();
        history.push('/');
        window.location.reload();
     }, 2000);
    }).catch(err => {
      NotificationManager.createNotification('error', err.message, "Create user");
    });
  }

  render() {
    return (
      <ViewLayout>
        <Container>
          <StyledSpan>
              Fill out the following form to register:
          </StyledSpan>
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