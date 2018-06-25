import Web3 from 'web3';

var apartmentContractJson = require('./contracts-json/Apartment.json');
var apartmentABI=apartmentContractJson.abi;
for(var appKey in apartmentContractJson.networks){
    var apartmentKey = appKey;
}
let apartmentAddress=apartmentContractJson.networks[apartmentKey].address;

var userContractJson = require('./contracts-json/User.json');
var userABI = userContractJson.abi;
for(var uKey in userContractJson.networks){
    var userKey = uKey;
}
let userAddress=userContractJson.networks[userKey].address;

const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const apartmentContract = web3.eth.contract(apartmentABI).at(apartmentAddress);
const userContract = web3.eth.contract(userABI).at(userAddress);

const Contracts = {
    Apartment: apartmentContract,
    User: userContract
}

export default Contracts;

