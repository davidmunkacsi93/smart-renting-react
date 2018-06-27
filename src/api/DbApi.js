import Dexie from 'dexie';
import ContractApi from './ContractApi';

var db = new Dexie("smartRentDb");

const initializeDb = () => {
  const schema = {
    currentUser: '++id,name,address'
  }
  db.version(1).stores(schema);
  // If a trigger is needed on a table.
  // db['accounts'].hook('creating', (primaryKey, friend) => {
  //   this.onsuccess = function (primaryKey) {
  //   };
  //   return undefined;
  // });
}

const setCurrentUser = (user) => {
  db.current.clear();
  if (user) {
    return db.currentUser.add({name: user.username, address: user.address});
  }
}

const DbApi = {
  initializeDb: initializeDb,
  setCurrentUser: setCurrentUser
}

export default DbApi;
