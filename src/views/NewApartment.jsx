import * as React from 'react';
import styled from 'styled-components';
import { Container, Input, Button, Label } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import UserManager from '../manager/UserManager';
import NotificationManager from '../manager/NotificationManager';
import { withRouter } from 'react-router-dom';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline'
import ContractApi from '../api/ContractApi';
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

export class NewApartmentView extends React.Component {
  constructor(props) {
    super(props);
    var account = UserManager.getCurrentAccount();
    this.state = {
        account: account,
        postCode: '',
        city: '',
        street: '',
        houseNumber: '',
        floor: '',
        description: '',
        deposit: '',
        rent: '',
        depositEth: '',
        rentEth: '',
        isLoggedIn: UserManager.isLoggedIn()
    }


    this.handleChange = this.handleChange.bind(this);
    this.createApartment = this.createApartment.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value});
    if (event.target.name === "rent" || event.target.name === "deposit") {  
        // var value = event.target.value;
        // var name = event.target.name;
        // getBasePrice('EUR', 'ETH').then(crypto => { 
        //     this.setState({[name + "Eth"]: value*crypto.price});
        // }).catch(err => {
        //     console.error(err)
        // })
    }
  }

  createApartment = async () => {
    const apartment = {
        account: this.state.account,
        apartment: {
            postCode: parseInt(this.state.postCode, 10),
            city: this.state.city,
            street: this.state.street,
            houseNumber: parseInt(this.state.houseNumber, 10),
            floor: parseInt(this.state.floor, 10),
            descripton: this.state.description,
            deposit: parseInt(this.state.deposit, 10),
            rent: parseInt(this.state.rent, 10)
        }
    }
    var response = await fetch('/api/createApartment', {
        body: JSON.stringify(apartment),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    });
    const body = await response.json();
    if (response.status !== 200) throw Error("Error during creating apartment.");
    if (!body.success) {
        NotificationManager.createNotification('error', body.message, 'Creating apartment');
    } else {
        try {
            ContractApi.createApartment(body.account, body.apartment);
        } catch (err) {
            NotificationManager.createNotification('error', err.message, 'Creating apartment');
            return;
        }
        NotificationManager.createNotification('success', "Apartment created successfully. You'll be soon redirected.", 'Creating apartment');
        setTimeout(function () {
            const history = createBrowserHistory();
            history.push('/apartments');
            window.location.reload();
         }, 2000);
    }
  }
 
  render() {
    return (
      <ViewLayout>
        <Container>
        { this.state.isLoggedIn
              ?
              <React.Fragment>
                <MainHeadline>
                  New Apartment
                </MainHeadline>
                <StyledSpan>
                    Here you can create a new apartment. It will be displayed under "My Apartments".
                </StyledSpan>
                <div className="col-sm-12">
                    <StyledInput placeholder="Post code" name="postCode" type="number" value={this.state.postCode} onChange={this.handleChange}/>
                    <StyledInput placeholder="City" name="city" value={this.state.city} onChange={this.handleChange}/>
                    <StyledInput placeholder="Street" name="street" value={this.state.street} onChange={this.handleChange}/>
                    <StyledInput placeholder="House number" name="houseNumber" type="number" value={this.state.houseNumber} onChange={this.handleChange}/>
                    <StyledInput placeholder="Floor" name="floor" type="number" value={this.state.floor} onChange={this.handleChange}/>
                    <StyledInput type="textarea" placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} />
                </div>

                <div className="col-md-4">
                    <StyledInput className="display-inline" placeholder="Deposit" name="deposit" type="number" value={this.state.deposit} onChange={this.handleChange}/>
                </div>
                <div className="col-md-4">
                    <StyledInput className="display-inline" placeholder="Rent" name="rent" type="number" value={this.state.rent} onChange={this.handleChange}/>
                </div>
                <div className="margin-top-10">
                    <StyledSpan>Your current balance is {ContractApi.getBalanceInEur(this.state.account.address)} EUR ({ContractApi.getBalanceInEth(this.state.account.address)} ETH).</StyledSpan>
                </div>
                <div>
                    <StyledSpan>The current transaction is going to cost {ContractApi.getTransactionPriceInEur(this.state.deposit, this.state.rent)} EUR ({ContractApi.getTransactionPriceInEth(this.state.deposit, this.state.rent)} ETH).</StyledSpan>
                </div>
                <div>
                    <StyledSpan>Balance after transaction: {ContractApi.getRemainingAmountInEur(this.state.account.address, this.state.deposit, this.state.rent)} EUR ({ContractApi.getRemainingAmountInEth(this.state.account.address, this.state.deposit, this.state.rent)} ETH).</StyledSpan>
                </div>
                <PrimaryButton onClick={() => this.createApartment() }>
                    CREATE
                </PrimaryButton>
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
  
export default withRouter(NewApartmentView);