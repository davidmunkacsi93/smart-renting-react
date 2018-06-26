const express = require('express');
const mongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 5000;
const uri = "mongodb://SmartRent:Pa\$\$word123@smartrentdb-shard-00-00-estgp.mongodb.net:27017,smartrentdb-shard-00-01-estgp.mongodb.net:27017,smartrentdb-shard-00-02-estgp.mongodb.net:27017/test?ssl=true&replicaSet=SmartRentDB-shard-0&authSource=admin&retryWrites=true";

app.get('/api/connect', (req, res) => {
  mongoClient.connect(uri, function(err, db) {
    res.send({ mongo: 'Hello From Mongo' });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));