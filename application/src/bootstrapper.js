import Web3 from 'web3';
import Db from './utils/db';

var apartmentContractJson = require('./contracts-json/Apartment.json');
var apartmentABI=apartmentContractJson.abi;
for(var firstKey in apartmentContractJson.networks){
    var key = firstKey;
}
let apartmentAddress=apartmentContractJson.networks[key].address;

const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const apartmentContract = web3.eth.contract(apartmentABI).at(apartmentAddress);

const db = new Db('smartRentDb');

export default { apartmentContract, db };