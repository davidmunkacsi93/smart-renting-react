import Dexie from 'dexie';

class Db extends Dexie {
  constructor(dbName) {
    super(dbName);
    const db = new Dexie(dbName);
    db.version(1).stores({
      users: 'name, account',
    });
  }

  getUsers = () => {
    return this.db.users;
  }
}

export const createUser = (userame) => {
  
}

export default Db;
