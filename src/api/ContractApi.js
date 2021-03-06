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
    (error, _) => {
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

const getRentedApartments = async address => {
  const apartmentIds = await ApartmentContract.getRentedApartments.call({
    from: address
  });
  let apartments = [];
  for (const id of apartmentIds) {
    const apartment = await ApartmentContract.getApartmentById.call(
      id.toNumber(),
      { from: address }
    );
    var result = parseApartment(apartment);
    const username = await UserContract.getUsernameByAddress.call(result.owner, {
      from: address
    });
    result.username = username;
    apartments.push(result);
  }
  return apartments;
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
    var result = parseApartment(apartment);
    const username = await UserContract.getUsernameByAddress.call(result.owner, {
      from: address
    });
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
  const username = await UserContract.getUsernameByAddress.call(apartment.owner, {
    from: address
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
    rent: apartment[9].toNumber(),
    deposit: apartment[10].toNumber(),
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

const createIssue = async (apartmentId, message, to, from, username) => {
  await ApartmentContract.createIssue.sendTransaction(apartmentId, to, "["+ username + "] "+ message, username, { from: from, gas: 2000000 });
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

const payRent = async transactionInfo => {
  var rentPrice = web3.toWei(transactionInfo.rent / fallbackPrice, "ether");
  const transactionObject = {
    from: transactionInfo.from,
    to: transactionInfo.to,
    value: rentPrice
  };
  await web3.eth.sendTransaction(transactionObject, function(err, _) {
    if (err) {
      NotificationManager.createNotification(
        "error",
        "Error during transferring rent.",
        "Transferring rent"
      );
    } else {
      NotificationManager.createNotification(
        "success",
        "Rent successfully transferred.",
        "Transferring rent"
      );
    }
  });
  var message = "[" + transactionInfo.username + "] paid the " + transactionInfo.rent + " € rent.";
  await ApartmentContract.createTransaction.sendTransaction(transactionInfo.apartmentId, message, { from: transactionInfo.from, gas: 2000000 });
  await ApartmentContract.firePayment(transactionInfo.to, transactionInfo.username,
    transactionInfo.rent, { from: transactionInfo.from });
}

const transferDeposit = async transactionInfo => {
  var depositPrice = web3.toWei(transactionInfo.deposit / fallbackPrice, "ether");
  const transactionObject = {
    from: transactionInfo.from,
    to: transactionInfo.to,
    value: depositPrice
  };
  await web3.eth.sendTransaction(transactionObject, function(err, _) {
    if (err) {
      NotificationManager.createNotification(
        "error",
        "Error during transferring deposit.",
        "Transferring deposit"
      );
    } else {
      NotificationManager.createNotification(
        "success",
        "Deposit successfully transferred.",
        "Transferring deposit"
      );
    }
  });
  await ApartmentContract.firePayment(transactionInfo.to, transactionInfo.username,
    transactionInfo.deposit, { from: transactionInfo.from });
  var message;
  if (transactionInfo.transferBack) {
    message =  "[" + transactionInfo.username + "] paid the transferred the " + transactionInfo.deposit + " € deposit back.";
  } else {
    message =  "[" + transactionInfo.username + "] paid the " + transactionInfo.deposit + " € deposit.";
  }
  await ApartmentContract.createTransaction.sendTransaction(transactionInfo.apartmentId, message, { from: transactionInfo.from, gas: 2000000 });
};

const approveRent = async (apartmentId, tenant, owner) => {
  await ApartmentContract.updateApartment.sendTransaction(apartmentId, tenant, { from: owner, gas: 2000000 });
  console.log("Rent approved.");
};

const terminateContract = async (transactionInfo) => {
  await ApartmentContract.terminateContract.sendTransaction(transactionInfo.apartmentId,
    transactionInfo.to, transactionInfo.username + " terminated the contract.", { from: transactionInfo.from, gas: 3000000 });
};

const rentApartment = async (transactionInfo) => {
  await ContractApi.transferDeposit(transactionInfo);
  await ContractApi.payRent(transactionInfo);
  await ApartmentContract.firePayment(transactionInfo.to, transactionInfo.username,
    transactionInfo.deposit, { from: transactionInfo.from });
  await ApartmentContract.firePayment(transactionInfo.to, transactionInfo.username,
    transactionInfo.rent, { from: transactionInfo.from });
};

const ContractApi = {
  getAccounts: getAccounts,
  getAvailableAccounts: getAvailableAccounts,
  getApartmentById: getApartmentById,
  getApartments: getApartments,
  getRentedApartments: getRentedApartments,
  getBalanceInEth: getBalanceInEth,
  getBalanceInEur: getBalanceInEur,
  getTransactions: getTransactions,
  createApartment: createApartment,
  createUser: createUser,
  createIssue: createIssue,
  authenticate: authenticate,
  approveRent: approveRent,
  transferDeposit: transferDeposit,
  payRent: payRent,
  rentApartment: rentApartment,
  sendMessage: sendMessage,
  terminateContract: terminateContract,
  ApartmentContract: ApartmentContract,
  UserContract: UserContract
};

export default ContractApi;
