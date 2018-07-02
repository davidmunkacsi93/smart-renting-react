import Web3 from "web3";
import NotificationManager from "../manager/NotificationManager";
import { MD5 } from "object-hash";

const fallbackPrice = 352.7;
const host = "localhost";

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

const initializeAccounts = async () => {
  try {
    var accounts = [];
    getAccounts().forEach(acc => {
      accounts.push(acc);
    });
    UserContract.initializeAccounts.sendTransaction(
      accounts,
      { from: web3.eth.accounts[0], gas: 2000000 },
      function(err, res) {
        if (err) throw Error(err.message);
        console.log(res);
      }
    );
    console.log(accounts);
    accounts.forEach(acc => {
      UserContract.isAccountAvailable.call({ from: acc }, function(err, res) {
        if (err) throw Error(err.message);
        console.log(res);
      });
    });
    NotificationManager.createNotification(
      "success",
      "Accounts created successfully.",
      "Creating accounts"
    );
  } catch (err) {
    NotificationManager.createNotification(
      "error",
      err.message,
      "Creating accounts"
    );
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

    UserContract.createUserPassword.sendTransaction(
      password,
      transactionObject,
      (error, _) => {
        if (error) {
          throw new Error(error);
        }
      }
    );
  }
};

const createApartment = async (account, apartment) => {
  if (account.address == null) {
    throw new Error("Account could not be identified.");
  }
  if (apartment == null) {
    throw new Error("Apartment can not be null.");
  } else {
    const transactionObject = {
      from: account.address
    };
    ApartmentContract.createRent.sendTransaction(
      apartment._id,
      apartment.rent,
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
    ApartmentContract.createDeposit.sendTransaction(
      apartment._id,
      apartment.deposit,
      transactionObject,
      (error, _) => {
        if (error) {
          NotificationManager.createNotification(
            "error",
            "Error during transaction.",
            "Create deposit"
          );
          console.error(error.message);
          return;
        }
      }
    );
    var transactionMessage =
      "Apartment created with " +
      apartment.rent +
      " € rent and " +
      apartment.deposit +
      " €.";
    var hashedTimestamp = MD5(new Date().getTime().toString());
    var hashedMessage = MD5(transactionMessage);
    ApartmentContract.createApartmentTransaction.call(
      hashedMessage,
      hashedTimestamp,
      transactionObject,
      (error, result) => {
        if (error) {
          NotificationManager.createNotification(
            "error",
            "Error during transaction.",
            "Create apartment transaction"
          );
          console.error(error.message);
          return;
        }
        const data = {
          apartmentId: apartment._id,
          address: account.address,
          transactionMessage: transactionMessage,
          transactionHash: hashedTimestamp
        };
        fetch("/api/createApartmentTransaction", {
          body: JSON.stringify(data),
          cache: "no-cache",
          headers: {
            "content-type": "application/json"
          },
          method: "POST"
        });
      }
    );
  }
};

const createApartmentTransaction = (transactionInfo, transactionMessage) => {
  var hashedTimestamp = MD5(new Date().getTime().toString());
  var hashedMessage = MD5(transactionMessage);
  const transactionObject = {
    from: transactionInfo.from
  };
  ApartmentContract.createApartmentTransaction.call(
    hashedMessage,
    hashedTimestamp,
    transactionObject,
    (error, result) => {
      if (error) {
        NotificationManager.createNotification(
          "error",
          "Error during transaction.",
          "Create apartment transaction"
        );
        console.error(error.message);
        return;
      }
      const data = {
        apartmentId: transactionInfo.apartmentId,
        address: transactionInfo.from,
        transactionMessage: transactionMessage,
        transactionHash: hashedTimestamp
      };
      fetch("/api/createApartmentTransaction", {
        body: JSON.stringify(data),
        cache: "no-cache",
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      });
    }
  );
};

const verifyTransaction = (transaction, address) => {
  const transactionObject = {
    from: address
  };
  var hashedMessage = MD5(transaction.transactionMessage);
  ApartmentContract.verifyTransaction.call(
    transaction.transactionHash,
    hashedMessage,
    transactionObject,
    (error, result) => {
      if (error) {
        NotificationManager.createNotification(
          "error",
          "Error during transaction.",
          "Reading apartment transaction"
        );
        console.error(error.message);
      }
      console.log(result);
    }
  );
};

const authenticate = (address, username, password) => {
  const transactionObject = {
    from: address
  };
  return UserContract.authenticate.call(password.toString(), transactionObject);
};

const getBalanceInEur = address => {
  return web3.fromWei(web3.eth.getBalance(address)).toFixed(2) * fallbackPrice;
};

const getBalanceInEth = address => {
  return web3.fromWei(web3.eth.getBalance(address)).toFixed(2);
};

// const getCurrentTransactionPrice = (transactionInfo) => {
//     getBasePrice('EUR', 'ETH').then(obj => {
//         var currentPriceInEth = obj.price*(transactionInfo.deposit + transactionInfo.rent);
//         var priceInWei = currentPriceInEth;
//     }).catch(err => {
//         NotificationManager.createNotification('error', err.message, 'Renting an apartment');
//     })
// }

const rentApartment = async transactionInfo => {
  var depositPrice = web3.toWei(
    transactionInfo.deposit / fallbackPrice,
    "ether"
  );
  var rentPrice = web3.toWei(transactionInfo.rent / fallbackPrice, "ether");
  const transactionObject = {
    from: transactionInfo.from,
    to: transactionInfo.to,
    value: depositPrice
  };
  console.log("From: " + transactionInfo.from + " To: " + transactionInfo.to);
  web3.eth.sendTransaction(transactionObject, function(err, res) {
    if (err) {
      console.error(err);
      NotificationManager.createNotification(
        "error",
        "Error during transferring deposit.",
        "Transferirng deposit"
      );
    } else {
      console.log(res);
      createApartmentTransaction(
        transactionInfo,
        transactionInfo.username +
          " paid the " +
          transactionInfo.deposit +
          " € deposit."
      );
      NotificationManager.createNotification(
        "success",
        "Deposit successfully transferred.",
        "Transferring deposit"
      );
      transactionObject["value"] = rentPrice;
      web3.eth.sendTransaction(transactionObject, function(err, res) {
        if (err) {
          NotificationManager.createNotification(
            "error",
            "Error during transferring rent.",
            "Transferring rent"
          );
        } else {
          createApartmentTransaction(
            transactionInfo,
            transactionInfo.username +
              " paid the " +
              transactionInfo.rent +
              " € rent."
          );
          NotificationManager.createNotification(
            "success",
            "Rent successfully transferred.",
            "Transferring rent"
          );
        }
      });
    }
  });
};

const ContractApi = {
  initializeAccounts: initializeAccounts,
  getAccounts: getAccounts,
  getBalanceInEth: getBalanceInEth,
  getBalanceInEur: getBalanceInEur,
  verifyTransaction: verifyTransaction,
  createApartment: createApartment,
  createUser: createUser,
  authenticate: authenticate,
  rentApartment: rentApartment
};

export default ContractApi;
