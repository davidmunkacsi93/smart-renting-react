import { createDbUser } from '../api/DbApi';

var currentUser = null;

export const createUser = (username, password) => {
    return createDbUser(username);
}

export const setCurrentUser = (user) => {
    currentUser = user;
    console.log(currentUser + " logged in.");
}

export const getCurrentUser = () => {
    return currentUser;
}

export const isLoggedIn = () => {
    return currentUser === null;
}

export default currentUser;
