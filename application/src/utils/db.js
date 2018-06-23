import Dexie from 'dexie';
import { getAccounts } from './contractUtils';

export const initializeDb = () => {
  const schema = {
    accounts: '++id,address',
    users: '++id,name,address'
  }
  db.version(1).stores(schema);
  db['accounts'].hook('creating', function (primaryKey, friend) {
    console.log(`Saving "${friend.name}" but we don't now the primary key yet ("${primaryKey}").`);
    this.onsuccess = function (primaryKey) {
      console.log(`Saved "${friend.name}" with primary key "${primaryKey}".`);
    };
    return undefined;
  });

  let accounts = getAccounts();
  accounts.forEach((acc) => {
    console.log(acc);
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
  var accounts = getDbAccounts();
  console.log(accounts);
  // console.log(getDbAccounts()[0]);
}

const db = new Dexie("smartRentDb");

export default db;
