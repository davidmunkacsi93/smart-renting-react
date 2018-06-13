import Web3 from 'web3';
import fs from 'fs-es6';

let apartmentContractJson = fs.readFileSync('./smart-contracts/build/contracts/Apartment.json');
let apartmentJson = JSON.parse(apartmentContractJson)["contracts"];
console.log(apartmentJson);

const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let apartmentABI=[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"userInfo","outputs":[{"name":"firstName","type":"string"},{"name":"lastName","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"getApartmentInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfApartments","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"payRent","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"payDeposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}];
let apartmentAddress='0xb038070c48cb29dc0be0980950b7c2cc40f33eda';
web3.eth.defaultAccount = web3.eth.accounts[0]


const apartmentContract = web3.eth.contract(apartmentABI).at(apartmentAddress);
export { apartmentContract };