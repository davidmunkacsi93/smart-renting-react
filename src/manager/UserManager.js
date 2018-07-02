import ContractApi from "../api/ContractApi";
import NotificationManager from "../manager/NotificationManager";
import { MD5 } from "object-hash";

const currentAccountKey = "currentAccount";

const createUser = async (selectedAccount, username, password) => {
    var hashedPassword = MD5(password);
    ContractApi.createUser(selectedAccount, username, hashedPassword);
};

const setCurrentAccount = user => {
  localStorage[currentAccountKey] = JSON.stringify(user);
};

const getCurrentAccount = () => {
  if (localStorage[currentAccountKey] != null)
    return JSON.parse(localStorage[currentAccountKey]);

  return null;
};

const login = async (address, username, password) => {
  var hashedPassword = MD5(password);
  const authenticated = await ContractApi.authenticate(address, hashedPassword);
  if (authenticated) {
    setCurrentAccount({ address: address, username: username });
  } else {
    NotificationManager.createNotification('error', 'Login failed.', "Login");
  }
  return authenticated;
};

const isLoggedIn = () => {
  return getCurrentAccount() != null;
};

const UserManager = {
  createUser: createUser,
  setCurrentAccount: setCurrentAccount,
  getCurrentAccount: getCurrentAccount,
  login: login,
  isLoggedIn: isLoggedIn
};
export default UserManager;
