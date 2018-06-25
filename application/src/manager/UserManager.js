import { createDbUser } from '../api/DbApi';

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

export var currentUser = null;
