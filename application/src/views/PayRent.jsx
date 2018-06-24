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
import payRent from '../contracts/Apartment.sol';

const PrimaryButton = styled(Button)`
  margin-top: 20px;
  background-color: #1f3651;
  color: #ffffff;
  width: 150px;
`;

const StyledInput = styled(Input)`
  width: 5% !important;
`;

const payrent = payRent.send({
  from: '25f916b82e442497516758d01e5ad0c27d83225caafe47977e0fddc30d70409e', 
  value: 100 
 })
.then(res => 
console.log('Success', res))
.catch(err => console.log(err)) 

export class PayRentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.payment = this.payment.bind(this);
  }

handleChange(event) {
    this.setState({username: event.target.value});
  }
     
 render(){
    return (
      <ViewLayout>
      <Container>
        <MainHeadline> Payment Portal </MainHeadline>
        <SecondaryHeadline>
            Amount:
          </SecondaryHeadline>
            <InputGroup size="s">
            <StyledInput placeholder="Amount" value={this.state.amount} onChange={this.handleChange}/>
          </InputGroup>
        <PrimaryButton onClick={() => this.payrent()}>
              Pay Now
          </PrimaryButton>
      </Container>
    </ViewLayout>
    );
  }
}
PayRentView.propTypes = {
  match: object.isRequired,
};
export default PayRentView;