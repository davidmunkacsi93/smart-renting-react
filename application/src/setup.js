import Web3 from 'web3';

var apartmentContractJson = require('./contracts-json/Apartment.json');
var apartmentABI=apartmentContractJson.abi;
for(var firstKey in apartmentContractJson.networks){
    var key = firstKey;
}
let apartmentAddress=apartmentContractJson.networks[key].address;

const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.defaultAccount = web3.eth.accounts[0]
const currentUser = web3.eth.defaultAccount;
const apartmentContract = web3.eth.contract(apartmentABI).at(apartmentAddress);
export { apartmentContract, currentUser };