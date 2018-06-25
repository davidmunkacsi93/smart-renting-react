import DbApi from '../api/DbApi';
import ContractApi from '../api/ContractApi';

var currentUser = null;

const createUser = (username, password) => {
    return DbApi.createDbUser(username, password);
}

const setCurrentUser = (user) => {
    currentUser = user;
    console.log(currentUser + " logged in.");
}

const getCurrentUser = () => {
    return currentUser;
}

const login = (username, password) => {
    return ContractApi.authenticate(username, password);
}

const isLoggedIn = () => {
    return currentUser === null;
}

const UserManager = {
    createUser: createUser,
    setCurrentUser: setCurrentUser,
    getCurrentUser: getCurrentUser,
    login: login,
    isLoggedIn: isLoggedIn
}
export default UserManager;
