import Dexie from 'dexie';
import { getAccounts } from './contractUtils';

const db = new Dexie("smartRentDb");
db.version(1).stores({
  accounts: 'address',
  users: 'name, account',
});
let accounts = getAccounts();
for (var index in accounts) {
  var account = accounts[index];
  db.table("accounts").add({ address: account });
}

export const getDbAccounts = () => {
  return db.table("accounts").toArray();
}

export const getDbUsers = () => {
  return db.table("users").toArray();
}

export const createUser = (username) => {
  db.table("accounts").toArray().then((accounts) => 
  {
     var account = accounts[0];
  });
  console.log(account);
}

export default db;
