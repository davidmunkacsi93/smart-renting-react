import Web3 from 'web3';
import DbApi from './DbApi';
import NotificationManager from '../manager/NotificationManager';

// var apartmentContractJson = require('../contracts-json/Apartment.json');
// var apartmentABI=apartmentContractJson.abi;
// for(var appKey in apartmentContractJson.networks){
//     var apartmentKey = appKey;
// }
// let apartmentAddress=apartmentContractJson.networks[apartmentKey].address;

var userContractJson = require('../contracts-json/User.json');
var userABI = userContractJson.abi;
for(var uKey in userContractJson.networks){
    var userKey = uKey;
}
let userAddress=userContractJson.networks[userKey].address;

const web3=new Web3(new Web3.providers.HttpProvider("http://192.168.0.6:8545"));
// const ApartmentContract = web3.eth.contract(apartmentABI).at(apartmentAddress);
const UserContract = web3.eth.contract(userABI).at(userAddress);

const initializeAccounts = async () => {
    let accounts = [];
    getAccounts().forEach(acc => {
        accounts.push({ address: acc });
    });
    var response = await fetch('/api/getCounts');
    const body = await response.json();
    if (response.status !== 200) throw Error("Error during initializing accounts.");
    console.log(body);
    if (body.accountCount === 0 && body.userCount === 0) {
        console.log("Creating accounts...");
        response = await fetch('/api/createAccounts', {
            body: JSON.stringify(accounts),
            cache: 'no-cache',
            headers: {
              'content-type': 'application/json'
            },
            method: 'POST'
        });
        const body = await response.json();
        if (response.status !== 200) throw Error("Error during initializing accounts.");
        if (!body.success) {
            NotificationManager.createNotification('error', body.message, 'Creating accounts');
        } else {
            NotificationManager.createNotification('success', "Accounts created successfully.", 'Creating accounts...');
        }
    }
  };

const getAccounts = () => {
    return web3.eth.accounts;
 };
 
const createUser = (address, password) => {
    if (address == null) {
        throw new Error("Account could not be identified.");
    } else {
        const transactionObject = {
            from: address
        };

        UserContract.createUserPasswordMapping.sendTransaction(password, transactionObject, (error, result) => {
            if(error) {
                throw new Error(error);
            }
        });
    }
}

const authenticate = (username, password) => {
    return DbApi.getUser(username).then((user) => {
        if (user === undefined) {
            throw new Error("Login failed. User does not exist.");
        }
        const transactionObject = {
            from: user.address
        };

        return UserContract.authenticate.call(password, transactionObject) ? user : null;
    });
}

const payRent = (apartment) => {
    console.log("Paying the rent...");
};

const ContractApi = {
    initializeAccounts: initializeAccounts,
    getAccounts: getAccounts,
    createUser: createUser,
    authenticate: authenticate,
    payRent: payRent
}

export default ContractApi;