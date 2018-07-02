import Web3 from "web3";
import NotificationManager from "../manager/NotificationManager";
import { MD5 } from "object-hash";

const fallbackPrice = 352.7;
const host = require("../../package.json").host;

var apartmentContractJson = require("../contracts-json/Apartment.json");
var apartmentABI = apartmentContractJson.abi;
for (var appKey in apartmentContractJson.networks) {
  var apartmentKey = appKey;
}
let apartmentAddress = apartmentContractJson.networks[apartmentKey].address;

var userContractJson = require("../contracts-json/User.json");
var userABI = userContractJson.abi;
for (var uKey in userContractJson.networks) {
  var userKey = uKey;
}
let userAddress = userContractJson.networks[userKey].address;

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://" + host + ":8545")
);
const ApartmentContract = web3.eth.contract(apartmentABI).at(apartmentAddress);
const UserContract = web3.eth.contract(userABI).at(userAddress);

const getAccounts = () => {
  return web3.eth.accounts;
};

const authenticate = async (address, password) => {
  const transactionObject = {
    from: address
  };
  const result = await UserContract.authenticate.call(password.toString(), transactionObject);
  return result;
};

const createUser = async (address, username, password) => {
  const transactionObject = {
    from: address
  };
  UserContract.createUser.sendTransaction(
    username, password,
    transactionObject,
    (error, result) => {
      if (error) {
        console.error(error);
      }
    }
  );
};

const createApartment = async (account, apartment) => {
    const transactionObject = {
      from: account.address,
      gas: 2000000
    };
    console.log(apartment);
    console.log(apartment.rent);
    var transactionMessage = "Apartment created with " + apartment["rent"] + " € rent and " + + apartment["deposit"] + " € deposit.";
    console.log(transactionMessage);
    ApartmentContract.createApartment.sendTransaction(
      apartment.postCode,
      apartment.city,
      apartment.street,
      apartment.houseNumber,
      apartment.floor,
      apartment.description,
      apartment.rent,
      apartment.deposit,
      transactionMessage,
      transactionObject,
      (error, result) => {
        if (error) {
          NotificationManager.createNotification(
            "error",
            "Error during transaction.",
            "Create rent"
          );
          console.error(error.message);
          return;
        }
        console.log(result);
      }
    );
};

const getApartments = async address => {
  const apartmentIds = await ApartmentContract.getApartments.call({ from: address });
  let apartments = [];
  for (const id of apartmentIds) {
    const apartment = await ApartmentContract.getApartmentById.call(id.toNumber(), { from: address });
    apartments.push(parseApartment(apartment));
  }
  return apartments;
}

const parseApartment = apartment => {
  return {
    postCode: apartment[0].toNumber(),
    city: apartment[1],
    street: apartment[2],
    houseNumber: apartment[3].toNumber(),
    floor: apartment[4].toNumber(),
    description: apartment[5],
    deposit: apartment[6].toNumber(),
    rent: apartment[7].toNumber(),
    isRented: apartment[8]
  }
}

const getBalanceInEur = address => {
  return web3.fromWei(web3.eth.getBalance(address)).toFixed(2) * fallbackPrice;
};

const getBalanceInEth = address => {
  return web3.fromWei(web3.eth.getBalance(address)).toFixed(2);
};

const rentApartment = async transactionInfo => {
  // var depositPrice = web3.toWei(
  //   transactionInfo.deposit / fallbackPrice,
  //   "ether"
  // );
  // var rentPrice = web3.toWei(transactionInfo.rent / fallbackPrice, "ether");
  // const transactionObject = {
  //   from: transactionInfo.from,
  //   to: transactionInfo.to,
  //   value: depositPrice
  // };
  // console.log("From: " + transactionInfo.from + " To: " + transactionInfo.to);
  // web3.eth.sendTransaction(transactionObject, function(err, res) {
  //   if (err) {
  //     console.error(err);
  //     NotificationManager.createNotification(
  //       "error",
  //       "Error during transferring deposit.",
  //       "Transferirng deposit"
  //     );
  //   } else {
  //     console.log(res);
  //     createApartmentTransaction(
  //       transactionInfo,
  //       transactionInfo.username +
  //         " paid the " +
  //         transactionInfo.deposit +
  //         " € deposit."
  //     );
  //     NotificationManager.createNotification(
  //       "success",
  //       "Deposit successfully transferred.",
  //       "Transferring deposit"
  //     );
  //     transactionObject["value"] = rentPrice;
  //     web3.eth.sendTransaction(transactionObject, function(err, res) {
  //       if (err) {
  //         NotificationManager.createNotification(
  //           "error",
  //           "Error during transferring rent.",
  //           "Transferring rent"
  //         );
  //       } else {
  //         createApartmentTransaction(
  //           transactionInfo,
  //           transactionInfo.username +
  //             " paid the " +
  //             transactionInfo.rent +
  //             " € rent."
  //         );
  //         NotificationManager.createNotification(
  //           "success",
  //           "Rent successfully transferred.",
  //           "Transferring rent"
  //         );
  //       }
  //     });
  //   }
  // });
};

const ContractApi = {
  getAccounts: getAccounts,
  getApartments: getApartments,
  getBalanceInEth: getBalanceInEth,
  getBalanceInEur: getBalanceInEur,
  createApartment: createApartment,
  createUser: createUser,
  authenticate: authenticate,
  rentApartment: rentApartment
};

export default ContractApi;
