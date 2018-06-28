import Dexie from 'dexie';
import ContractApi from './ContractApi';

var db = new Dexie("smartRentDb");

const initializeDb = () => {
  const schema = {
    currentAccount: '++id,name,address'
  }
  db.version(1).stores(schema);
  // If a trigger is needed on a table.
  // db['accounts'].hook('creating', (primaryKey, friend) => {
  //   this.onsuccess = function (primaryKey) {
  //   };
  //   return undefined;
  // });
}

const getCurrentAccount = () => {
  return db.currentAccount.toCollection().first();
}

const setCurrentAccount = (account) => {
  db.currentAccount.clear();
  if (account) {
    return db.currentAccount.add({name: account.user.username, address: account.address});
  }
}

const DbApi = {
  initializeDb: initializeDb,
  getCurrentAccount: getCurrentAccount,
  setCurrentAccount: setCurrentAccount
}

export default DbApi;
