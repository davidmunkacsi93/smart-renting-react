import DbApi from '../api/DbApi';
import ContractApi from '../api/ContractApi';
import NotificationManager from '../manager/NotificationManager';

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
            ContractApi.createUser(body.account.address, password);
            localStorage[currentAccountKey] = JSON.stringify(body.account);
        } catch (error) {
            NotificationManager.createNotification('error', "User could not be created.", 'Creating user');
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

const login = (username, password) => {
    var account = ContractApi.authenticate(username, password);
    setCurrentAccount(account);
    return account;

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
