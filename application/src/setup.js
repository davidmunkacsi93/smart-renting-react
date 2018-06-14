import Web3 from 'web3';

let apartmentContractJson = require('./contracts-json/Apartment.json');
let apartmentABI=apartmentContractJson.abi;
let apartmentAddress=apartmentContractJson.networks[1529007864976].address;

const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0]
const currentUser = web3.eth.defaultAccount;
const apartmentContract = web3.eth.contract(apartmentABI).at(apartmentAddress);
export { apartmentContract, currentUser };