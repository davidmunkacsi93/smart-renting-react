 import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
import { withRouter } from 'react-router-dom';
import UserManager from '../manager/UserManager';
import { NotificationManager } from 'react-notifications';
import Dropdown from "react-dropdown";
import 'react-dropdown/style.css';
import ContractApi from '../api/ContractApi';

const PrimaryButton = styled(Button)`
  margin-top: 20px;
  background-color: #1f3651;
  color: #ffffff;
  width: 150px;
`;

const StyledInput = styled(Input)`
  width: 50%;
  margin-top: 10px;
  display: block;
`

const StyledSpan = styled.span`
 color:white;
`
const StyledDropdown = styled(Dropdown)`
  width: 50%;
`

const StyledDiv = styled.div`
  margin-top: 20px;
`

export class HomeView extends React.Component {
  constructor(props) {
    super(props);

    let accounts = [];
    ContractApi.getAccounts().forEach(acc => {
      accounts.push(acc);
    });

    var currentAccount = UserManager.getCurrentAccount();
    if (currentAccount != null) {
      window.location.reload();
    }

    this.state = {
      accounts: accounts,
      selectedAccount: '',
      username: '',
      password: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(event) {
    this.setState({ selectedAccount: event.value });
  }


  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

   login = async () => {
      const authenticated = await UserManager.login(this.state.selectedAccount, this.state.username, this.state.password);
      if (authenticated) {
        window.location.reload();
      }
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
              <StyledDiv>
                <StyledDropdown options={this.state.accounts} name="selectedAccount" value={this.state.selectedAccount} onChange={this.onSelect}/>
                <StyledInput placeholder="Username" name="username" value={this.state.username} onChange={this.handleChange}/>
                <StyledInput type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
                <PrimaryButton onClick={() => this.login() }>
                    Login
                </PrimaryButton>
              </StyledDiv>
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
  