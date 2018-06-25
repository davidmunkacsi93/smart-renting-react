import Dexie from 'dexie';
import ContractApi from './ContractApi';

var db = new Dexie("smartRentDb");

const initializeDb = () => {
  const schema = {
    accounts: '++id,address',
    users: '++id,name,address'
  }
  db.version(1).stores(schema);
  initializeAccounts();
  // If a trigger is needed on a table.
  // db['accounts'].hook('creating', (primaryKey, friend) => {
  //   this.onsuccess = function (primaryKey) {
  //   };
  //   return undefined;
  // });
}

const initializeAccounts = () => {
  let accounts = ContractApi.getAccounts();
  db.users.toCollection().count().then((cntUsers) => {
    db.accounts.toCollection().count().then((cntAccounts) => {
      if (cntUsers === 0 && cntAccounts === 0) {
        console.log("Initializing accounts...");
        accounts.forEach((acc) => {
          db.accounts.add({address: acc})
        });
      }
    })
  });

}

const getDbAccounts = () => {
  const accounts = [];
  db.accounts.toArray().then((a) => {
      a.forEach(acc => {
        accounts.push(acc);
      })
  });
  return accounts;
}

const getDbUsers = () => {
  const users = [];
  db.users.toArray().then((u) => {
    u.forEach(user => {
      users.push(user);
    })
  });
  return users;
}

const getDbUser = (username) => {
  return db.users.get({ name: username });
}

const createDbUser = (username, password) => {
  return db.accounts.toCollection().first().then(account => {
    if (account == null) {
      throw new Error("No more available accounts.");
    }
    db.accounts.delete(account.id).then(() => {
      db.users.add({name: username, address: account.address}).then((id) => {
        db.users.get(id).then(user => {
          ContractApi.createUser(user.address, password)
        });
      });
    });
  });
}

const DbApi = {
  initializeDb: initializeDb,
  initializeAccounts: initializeAccounts,
  getDbAccounts: getDbAccounts,
  getDbUser: getDbUser,
  getDbUsers: getDbUsers,
  createDbUser: createDbUser
}

export default DbApi;
