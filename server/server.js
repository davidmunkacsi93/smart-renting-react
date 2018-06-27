const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const dbName = "smartrent";
const uri = "mongodb://SmartRent:berlin28041993@smartrentdb-shard-00-00-estgp.mongodb.net:27017,smartrentdb-shard-00-01-estgp.mongodb.net:27017,smartrentdb-shard-00-02-estgp.mongodb.net:27017/test?ssl=true&replicaSet=SmartRentDB-shard-0&authSource=admin&retryWrites=true";

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/getAccountCount', (req, res) => {
  mongoClient.connect(uri, (err, db) => {
    if (err) 
      res.send( { success: false, message: "Connection with the database could not be establised." });
    var dbo = db.db(dbName);
    dbo.collection("accounts").count((err, count) => {
        if (err) 
          res.send( { success: false, message: "Connection with the database could not be establised." });
        else {
          res.send({ success: true, count: count });
        }
        db.close();
      });
  });
});

app.post('api/createUser', (req, res) => {
  mongoClient.connect(uri, function(err, db) {
    if (err)
      res.send( { success: false, message: "Connection with the database could not be establised." });
    var dbo = db.db(dbName);
    dbo.collection("users").insertOne(user, function(err, res) {
        if (err) {
          res.send( { success: false, message: "User could not be inserted." });
        } else {
          res.send( { success: true, message: "User inserted." });
        }
        db.close();
    });
  });
});

app.post('api/createAccounts', (req, res) => {
  mongoClient.connect(uri, (err, db) => {
      if (err) 
        res.send( { success: false, message: "Connection with the database could not be establised." });
      var dbo = db.db(dbName);
      dbo.collection("accounts").insertOne(addresses, (err, res) => {
          if (err) {
            res.send( { success: false, message: "Accounts could not be inserted." });
          } else {
            res.send( { success: true, message: "Number of accounts inserted: " + res.insertedCount });
          }
          db.close();
      });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));