import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { apartmentContract, currentUser } from "./setup";
import { ShowApartments } from "./ShowApartments";

class App extends Component {
  constructor(props){
    super(props)
    this.state = { apartments: [] };
    let apartments = this.getApartments();
    for (var key in apartments) {
      this.state.apartments.push(apartments[key]);
    }
  }

  getApartments() {
    let apartments = [];
    let length = apartmentContract.getNumberOfApartments().toNumber();
    for(let i = 0; i < length; i++) {
      // apartmentContract.setIterator({from: currentUser});
      let tuple = apartmentContract.getApartmentInfo();
      let apartment = this.createApartment(tuple);
      apartments.push(apartment)
    }
    return apartments;
  }

  createApartment(tuple) {
    return {
      id: tuple[0].toNumber(),
      city: tuple[1],
      rent: tuple[2].toNumber(),
      deposit: tuple[3].toNumber()
    }
  }

  payRent(apartment) {
      console.log("Paying the rent...");
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Ethereum</h1>
        </header>
        <p className="App-intro">
          Blockchain based Smart Renting
        </p>
        <div>
          <ShowApartments apartments={this.state.apartments} payRent={this.payRent}/>
        </div>
      </div>
    );
  }
}

export default App;