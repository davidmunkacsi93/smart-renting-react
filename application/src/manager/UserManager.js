import DbApi from '../api/DbApi';

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

const isLoggedIn = () => {
    return currentUser === null;
}

const UserManager = {
    createUser: createUser,
    setCurrentUser: setCurrentUser,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn
}
export default UserManager;
