import DbApi from '../api/DbApi';
import ContractApi from '../api/ContractApi';

var currentUser = null;

const createUser = (username, password) => {
    return DbApi.createDbUser(username, password);
}

const setCurrentUser = (user) => {
    if (user == null)
        return;
    currentUser = user;
}

const getCurrentUser = () => {
    return currentUser;
}

const login = (username, password) => {
    return ContractApi.authenticate(username, password).then(user => {
        setCurrentUser(user);
        return user;
    });
}

const isLoggedIn = () => {
    return currentUser != null;
}

const UserManager = {
    createUser: createUser,
    setCurrentUser: setCurrentUser,
    getCurrentUser: getCurrentUser,
    login: login,
    isLoggedIn: isLoggedIn
}
export default UserManager;
