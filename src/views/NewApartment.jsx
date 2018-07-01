import * as React from 'react';
import styled from 'styled-components';
import { Container, Input, Button, Row, Col } from 'reactstrap';
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
            description: this.state.description,
            deposit: parseInt(this.state.deposit, 10),
            rent: parseInt(this.state.rent, 10),
            isRented: false
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
    var body = await response.json();
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
                <Row>
                    <Col sm="6" md="3">
                        <StyledInput placeholder="Post code" name="postCode" type="number" value={this.state.postCode} onChange={this.handleChange}/>
                    </Col>
                    <Col sm="12" md="3">
                        <StyledInput placeholder="City" name="city" value={this.state.city} onChange={this.handleChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="4">
                        <StyledInput placeholder="Street" name="street" value={this.state.street} onChange={this.handleChange}/>
                    </Col>
                    <Col sm="6" md="2">
                        <StyledInput placeholder="House number" name="houseNumber" type="number" value={this.state.houseNumber} onChange={this.handleChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6" md="2">
                        <StyledInput placeholder="Floor" name="floor" type="number" value={this.state.floor} onChange={this.handleChange}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12" md="6">
                        <StyledInput type="textarea" placeholder="Description" name="description" value={this.state.description} onChange={this.handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col sm="6" md="3">
                        <StyledInput placeholder="Rent" name="rent" type="number" value={this.state.rent} onChange={this.handleChange}/>
                    </Col>
                    <Col sm="6" md="3">
                        <StyledInput placeholder="Deposit" name="deposit" type="number" value={this.state.deposit} onChange={this.handleChange}/>
                    </Col>
                </Row>

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