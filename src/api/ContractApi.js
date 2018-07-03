import Web3 from "web3";
import NotificationManager from "../manager/NotificationManager";

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

const getAvailableAccounts = async () => {
  let result = [];
  for (const account of web3.eth.accounts) {
    const taken = await UserContract.isAccountTaken.call({ from: account });
    console.log(account + " " + taken);
    if (!taken) {
      result.push(account);
    }
  }
  return result;
};

const authenticate = async (address, password) => {
  const transactionObject = {
    from: address
  };
  const result = await UserContract.authenticate.call(
    password.toString(),
    transactionObject
  );
  return result;
};

const createUser = async (address, username, password) => {
  const transactionObject = {
    from: address
  };
  UserContract.createUser.sendTransaction(
    username,
    password,
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
  var transactionMessage =
    "Apartment created with " +
    apartment["rent"] +
    " € rent and " +
    +apartment["deposit"] +
    " € deposit.";
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
    }
  );
};

const getApartments = async address => {
  const apartmentIds = await ApartmentContract.getApartments.call({
    from: address
  });
  let apartments = [];
  for (const id of apartmentIds) {
    const apartment = await ApartmentContract.getApartmentById.call(
      id.toNumber(),
      { from: address }
    );
    const username = await UserContract.getUsername.call({
      from: apartment.owner
    });
    var result = parseApartment(apartment);
    result.username = username;
    apartments.push(result);
  }
  return apartments;
};

const getApartmentById = async (address, apartmentId) => {
  var apartmentResult = await ApartmentContract.getApartmentById.call(
    apartmentId,
    { from: address }
  );
  var apartment = parseApartment(apartmentResult);
  const username = await UserContract.getUsername.call({
    from: apartment.owner
  });
  apartment.username = username;
  apartment.transactions = [];
  const transactions = await ContractApi.getTransactions(address, apartmentId);
  transactions.forEach(t => apartment.transactions.push(t));
  return apartment;
};

const getTransactions = async (address, apartmentId) => {
  let result = [];
  var transactionIds = await ApartmentContract.getTransactionIds.call(
    apartmentId,
    { from: address }
  );
  for (const id of transactionIds) {
    const transaction = await ApartmentContract.getTransactionById.call(
      id.toNumber(),
      { from: address }
    );
    result.push(parseTransaction(transaction));
  }
  return result;
};

const parseApartment = apartment => {
  return {
    id: apartment[0].toNumber(),
    owner: apartment[1],
    tenant: apartment[2],
    postCode: apartment[3].toNumber(),
    city: apartment[4],
    street: apartment[5],
    houseNumber: apartment[6].toNumber(),
    floor: apartment[7].toNumber(),
    description: apartment[8],
    deposit: apartment[9].toNumber(),
    rent: apartment[10].toNumber(),
    isRented: apartment[11]
  };
};

const parseTransaction = transaction => {
  return {
    id: transaction[0].toNumber(),
    apartmentId: transaction[1].toNumber(),
    message: transaction[2],
    timestamp: transaction[3].toNumber()
  };
};

const getBalanceInEur = address => {
  return web3.fromWei(web3.eth.getBalance(address)).toFixed(2) * fallbackPrice;
};

const getBalanceInEth = address => {
  return web3.fromWei(web3.eth.getBalance(address)).toFixed(2);
};

const sendMessage = async (from, to, username, message) => {
  UserContract.sendMessage(to, username, message, { from: from });
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
  getAvailableAccounts: getAvailableAccounts,
  getApartmentById: getApartmentById,
  getApartments: getApartments,
  getBalanceInEth: getBalanceInEth,
  getBalanceInEur: getBalanceInEur,
  getTransactions: getTransactions,
  createApartment: createApartment,
  createUser: createUser,
  authenticate: authenticate,
  rentApartment: rentApartment,
  sendMessage: sendMessage,
  UserContract: UserContract
};

export default ContractApi;
