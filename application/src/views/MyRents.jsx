import React from 'react';
import { Container } from 'reactstrap';
import { Router, Switch } from 'react-router-dom';
import ViewLayout from '../components/ViewLayout';
import { MainHeadline } from '../components/Headlines/MainHeadline';
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory();
const MyRentsView = () => (
    <ViewLayout>
      <Container>
        <MainHeadline>
            My Rents
        </MainHeadline>
        <Router history={history}>
        <Switch>
        <button onClick={() => history.push('/PayRent')}>
 			 <b>
    			Pay Rent
  			</b>
		</button>
		</Switch>
		</Router>
      </Container>
    </ViewLayout>
  );
  
  export default MyRentsView;