import * as React from 'react';
import { object } from 'prop-types';
import styled from 'styled-components';
import { Container, Input, Button } from 'reactstrap';
import ViewLayout from '../components/ViewLayout';
import UserManager from '../manager/UserManager';
import NotificationManager from '../manager/NotificationManager';
import { withRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { MainHeadline, ErrorHeadline } from '../components/Headlines/MainHeadline'
import { SecondaryHeadline } from '../components/Headlines/SecondaryHeadline'
import { getBasePrice } from 'crypto-price'

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
    var currentAccount = UserManager.getCurrentAccount();
    this.state = {
        currentAccount: currentAccount,
        postCode: '',
        city: '',
        street: '',
        houseNumber: '',
        floor: '',
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
        var value = event.target.value;
        var name = event.target.name;
        getBasePrice('EUR', 'ETH').then(crypto => { 
            this.setState({[name + "Eth"]: value*crypto.price});
        }).catch(err => {
            console.error(err)
        })
    }
  }

  createApartment = async () => {
    const apartment = {
        account: this.state.currentAccount,
        apartment: {
            postCode: parseInt(this.state.postCode),
            city: this.state.city,
            street: this.state.street,
            houseNumber: parseInt(this.state.houseNumber),
            floor: parseInt(this.state.floor),
            deposit: parseInt(this.state.deposit),
            rent: parseInt(this.state.rent),
            depositEth: this.state.depositEth,
            rentEth: this.state.rentEth
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
    if (response.status !== 200) throw Error("Error during initializing accounts.");
    if (!body.success) {
        NotificationManager.createNotification('error', body.message, 'Creating apartment');
    } else {
        NotificationManager.createNotification('success', "Apartment created successfully.", 'Creating apartment');
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
                </div>

                <div className="col-md-4">
                    <StyledInput className="" className="display-inline" placeholder="Deposit" name="deposit" type="number" value={this.state.deposit} onChange={this.handleChange}/>
                    <StyledInput className="margin-left-10 display-inline" placeholder="Deposit" name="deposit" type="number" value={this.state.depositEth} onChange={this.handleChange}/>
                </div>
                <div className="col-md-4">
                    <StyledInput className="" className="display-inline" placeholder="Rent" name="rent" type="number" value={this.state.rent} onChange={this.handleChange}/>
                    <StyledInput className="margin-left-10 display-inline" placeholder="Rent" name="rent" type="number" value={this.state.rentEth} onChange={this.handleChange}/>
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