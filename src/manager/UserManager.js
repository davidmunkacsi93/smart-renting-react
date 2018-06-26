import DbApi from '../api/DbApi';
import ContractApi from '../api/ContractApi';

const currentUserKey = "currentUser";

const createUser = (username, password) => {
    return DbApi.createDbUser(username, password);
}

const setCurrentUser = (user) => {
    localStorage[currentUserKey] = JSON.stringify(user);
}

const getCurrentUser = () => {
    return JSON.parse(localStorage[currentUserKey]);
}

const login = (username, password) => {
    return ContractApi.authenticate(username, password).then(user => {
        setCurrentUser(user);
        return user;
    });
}

const isLoggedIn = () => {
    return getCurrentUser() != null;
}

const UserManager = {
    createUser: createUser,
    setCurrentUser: setCurrentUser,
    getCurrentUser: getCurrentUser,
    login: login,
    isLoggedIn: isLoggedIn
}
export default UserManager;
