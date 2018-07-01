import ContractApi from '../api/ContractApi';
import NotificationManager from '../manager/NotificationManager';
import { MD5 } from 'object-hash'

const currentAccountKey = "currentAccount";

const createUser = async (username, password) => {
    const data = {
        username: username
    }
    var response = await fetch('/api/createUser', {
        body: JSON.stringify(data),
        cache: 'no-cache',
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    });
    const body = await response.json();
    if (response.status !== 200) throw Error("Error during initializing accounts.");
    if (!body.success) {
        NotificationManager.createNotification('error', body.message, 'Creating user');
    } else {
        try {
            ContractApi.createUser(body.account.address, MD5(password));
            localStorage[currentAccountKey] = JSON.stringify(body.account);
        } catch (error) {
            throw Error("User could not be created.");
        }
        NotificationManager.createNotification('success', "User created successfully.", 'Creating user');
    }
}

const setCurrentAccount = (user) => {
    localStorage[currentAccountKey] = JSON.stringify(user);
}

const getCurrentAccount = () => {
    if(localStorage[currentAccountKey] != null)
        return JSON.parse(localStorage[currentAccountKey]);

    return null;
}

const login = async (username, password) => {
    const response = await fetch('/api/getAccountByUsername?username=' + username);
    const json = await response.json();
    if (!json.success) return false;
    var result = ContractApi.authenticate(json.account.address, MD5(password));
    if (result) {
        setCurrentAccount(json.account);
    } else {
        NotificationManager.createNotification('error', 'Login failed.', 'Login');
    }
    return result;
}

const isLoggedIn = () => {
    return getCurrentAccount() != null;
}

const UserManager = {
    createUser: createUser,
    setCurrentAccount: setCurrentAccount,
    getCurrentAccount: getCurrentAccount,
    login: login,
    isLoggedIn: isLoggedIn
}
export default UserManager;
