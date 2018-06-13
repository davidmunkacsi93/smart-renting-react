import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { apartmentContract } from "./setup";
import { ShowApartments } from "./ShowApartments";

class App extends Component {
  constructor(props){
    super(props)
    let length = apartmentContract.getNumberOfApartments().toNumber();
    console.log(length);
    let tuple = apartmentContract.getApartmentInfo.call(0, (error, result) => {
        console.log(result);
    });
    this.state.apartments = [];
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