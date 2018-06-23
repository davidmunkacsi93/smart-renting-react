import Dexie from 'dexie';
import { getAccounts } from './ContractApi';

export const initializeDb = () => {
  const schema = {
    accounts: '++id,address',
    users: '++id,name,address'
  }
  db.version(1).stores(schema);
  // If a trigger is needed on a table.
  // db['accounts'].hook('creating', (primaryKey, friend) => {
  //   this.onsuccess = function (primaryKey) {
  //   };
  //   return undefined;
  // });
  // initializeAccounts();
}

export const initializeAccounts = () => {
  let accounts = getAccounts();
  accounts.forEach((acc) => {
    db.accounts.add({address: acc})
  });
}

export const getDbAccounts = () => {
  const accounts = [];
  db.accounts.toArray().then((a) => {
      a.forEach(acc => {
        accounts.push(acc);
      })
  });
  return accounts;
}

export const getDbUsers = () => {
  const users = [];
  db.users.toArray().then((u) => {
    u.forEach(user => {
      users.push(user);
    })
  });
  return users;
}

export const createUser = (username) => {
  return db.accounts.toCollection().first().then(account => {
    if (account == null) {
      throw {
        type: 'error',
        name: 'DbApi.createUser',
        message: "No more available accounts."
      };
    }
    db.accounts.delete(account.id).then(() => {
      db.users.add({name: username, address: account.address}).then(() => {
      });
    });
  });
}

const db = new Dexie("smartRentDb");

export default db;
