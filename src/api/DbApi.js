import Dexie from 'dexie';
import ContractApi from './ContractApi';

var db = new Dexie("smartRentDb");

const initializeDb = () => {
  const schema = {
    currentUser: '++id,name,address'
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
  const response = fetch('/api/getAccountCount');
  console.log(response);
  // const body = response.json();
  // if (response.status !== 200) throw Error(body.message);

}

const createCurrentUser = (user) => {
  return db.users.add({name: user.username, address: user.address});
}

const DbApi = {
  initializeDb: initializeDb,
  createCurrentUser: createCurrentUser
}

export default DbApi;
