import Web3 from 'web3';
import NotificationManager from '../manager/NotificationManager';
import UserManager from '../manager/UserManager';

const ethereumValueInEur = 352.70;
const fixedPercentage = 0.005;

var apartmentContractJson = require('../contracts-json/Apartment.json');
var apartmentABI=apartmentContractJson.abi;
for(var appKey in apartmentContractJson.networks){
    var apartmentKey = appKey;
}
let apartmentAddress=apartmentContractJson.networks[apartmentKey].address;

var userContractJson = require('../contracts-json/User.json');
var userABI = userContractJson.abi;
for(var uKey in userContractJson.networks){
    var userKey = uKey;
}
let userAddress=userContractJson.networks[userKey].address;

const web3=new Web3(new Web3.providers.HttpProvider("http://192.168.0.6:8545"));
const ApartmentContract = web3.eth.contract(apartmentABI).at(apartmentAddress);
const UserContract = web3.eth.contract(userABI).at(userAddress);

const initializeAccounts = async () => {
    let accounts = [];
    getAccounts().forEach(acc => {
        accounts.push({ address: acc });
    });
    var response = await fetch('/api/getAccountCount');
    const body = await response.json();
    if (response.status !== 200) throw Error("Error during initializing accounts.");
    if (body.count === 0) {
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
            NotificationManager.createNotification('success', "Accounts created successfully.", 'Creating accounts');
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

const createApartment = (account, apartment) => {
    if (account.address == null) {
        throw new Error("Account could not be identified.");
    }
    if (apartment == null) {
        throw new Error("Apartment can not be null.");
    } else {
        const transactionObject = {
            from: account.address,
        };
        ApartmentContract.createApartmentDetail.sendTransaction(apartment._id, apartment.deposit, apartment.rent, transactionObject, (error, result) => {
            if(error) {
                NotificationManager.createNotification('error', "Error during transaction.", 'Create apartment');
                console.error(error.message);
                return;
            }
            console.log(result);
        });
    }
}

const authenticate = (username, password) => {
    var account = UserManager.getCurrentAccount();
    if (account === null) {
        NotificationManager.createNotification('error', 'Current user could not be identified.', 'Login')
        return null;
    }
    const transactionObject = {
        from: account.address
    };

    return UserContract.authenticate.call(password, transactionObject) ? account : null;
}

const getBalanceInEur = (address) => {
    return web3.fromWei(web3.eth.getBalance(address)).toFixed(2)*ethereumValueInEur;
}

const getBalanceInEth = (address) => {
    return web3.fromWei(web3.eth.getBalance(address)).toFixed(2);
}

const getTransactionPriceInEur = (deposit, rent) => {
    return (parseInt(deposit, 10)+parseInt(rent, 10))*fixedPercentage;
}
const getTransactionPriceInEth = (deposit, rent) => {
    return (parseInt(deposit, 10)+parseInt(rent, 10))*fixedPercentage/ethereumValueInEur;
}

const getTransactionPriceInWei = (deposit, rent) => {
    return (parseInt(deposit, 10)+parseInt(rent, 10))*fixedPercentage/ethereumValueInEur*Math.pow(10,18);
}

const getRemainingAmountInEur = (address, deposit, rent) => {
    return (getBalanceInEur(address) - getTransactionPriceInEur(deposit, rent)).toFixed(3);
}

const getRemainingAmountInEth = (address, deposit, rent) => {
    return (getBalanceInEth(address) - getTransactionPriceInEth(deposit, rent)).toFixed(3);
}


const payRent = (apartment) => {
    console.log("Paying the rent...");
};

const ContractApi = {
    ethereumValueInEur: ethereumValueInEur,
    initializeAccounts: initializeAccounts,
    getAccounts: getAccounts,
    getTransactionPriceInEur: getTransactionPriceInEur,
    getTransactionPriceInEth: getTransactionPriceInEth,
    getRemainingAmountInEur: getRemainingAmountInEur,
    getRemainingAmountInEth: getRemainingAmountInEth,
    getBalanceInEth: getBalanceInEth,
    getBalanceInEur: getBalanceInEur,
    createApartment: createApartment,
    createUser: createUser,
    authenticate: authenticate,
    payRent: payRent
}

export default ContractApi;