import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import { publicRoutes as publicRoutesConfig } from './routes';
import { apartmentContract, currentUser } from "./setup";

const history = createBrowserHistory();

const publicRoutes = () =>
  publicRoutesConfig.map(route => (
    <Route path={route.path} exact={route.exact} component={route.page} />
  ));

const App = () => (
  <div>
    <Router history={history}>
      <Switch>{publicRoutes()}</Switch>
    </Router>
  </div>
);

// class App extends Component {
//   constructor(props){
//     super(props)
//     this.state = { apartments: [] };
//     let apartments = this.getApartments();
//     for (var key in apartments) {
//       this.state.apartments.push(apartments[key]);
//     }
//   }

//   getApartments() {
//     let apartments = [];
//     let length = apartmentContract.getNumberOfApartments().toNumber();
//     for(let i = 0; i < length; i++) {
//       // apartmentContract.setIterator({from: currentUser});
//       let tuple = apartmentContract.getApartmentInfo();
//       let apartment = this.createApartment(tuple);
//       apartments.push(apartment)
//     }
//     return apartments;
//   }

//   createApartment(tuple) {
//     return {
//       id: tuple[0].toNumber(),
//       city: tuple[1],
//       rent: tuple[2].toNumber(),
//       deposit: tuple[3].toNumber()
//     }
//   }

//   payRent(apartment) {
//       console.log("Paying the rent...");
//     }
//   }
// }

export default App;