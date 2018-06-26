const mongoClient = require('mongodb').MongoClient;
const uri = "mongodb://SmartRent:Pa\$\$word123@smartrentdb-shard-00-00-estgp.mongodb.net:27017,smartrentdb-shard-00-01-estgp.mongodb.net:27017,smartrentdb-shard-00-02-estgp.mongodb.net:27017/test?ssl=true&replicaSet=SmartRentDB-shard-0&authSource=admin&retryWrites=true";

const connect = () => {
    mongoClient.connect(uri, function(err, db) {
        console.log("Connected.")
    });
}

module.exports =  {
 connect : connect
}