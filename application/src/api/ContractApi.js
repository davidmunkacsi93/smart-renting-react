import Web3 from 'web3';
import Contracts from '../bootstrapper';
import { DbApi } from '../api/DbApi';

const getAccounts = () => {
    const web3=new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    return web3.eth.accounts;
 };
 
const createUser = (address, password) => {
    if (address == null) {
        throw new Error("Account could not be identified.");
    } else {
        const transactionObject = {
            from: address
        }
        Contracts.User.createUserPasswordMapping.sendTransaction(password, transactionObject, (error, result) => {
            if(!error) {
                console.log(result);
            } else {
                console.error(error);
            }
        });
    }
}

const authenticate = (username, password) => {

}

const payRent = (apartment) => {
    console.log("Paying the rent...");
};

const ContractApi = {
    getAccounts: getAccounts,
    createUser: createUser,
    authenticate: authenticate,
    payRent: payRent
}

export default ContractApi;