const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require("body-parser");
const dbName = "smartrent";
const uri = "mongodb://SmartRent:berlin28041993@smartrentdb-shard-00-00-estgp.mongodb.net:27017,smartrentdb-shard-00-01-estgp.mongodb.net:27017,smartrentdb-shard-00-02-estgp.mongodb.net:27017/test?ssl=true&replicaSet=SmartRentDB-shard-0&authSource=admin&retryWrites=true";
const connectionErrorMessage = "Connection with the database could not be establised.";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.get('/api/getCounts', (req, res) => {
  mongoClient.connect(uri, (err, db) => {
    if (err) throw err;
    
    var dbo = db.db(dbName);
    dbo.collection("users").count((errUser, userCount) => {
        if (errUser) throw errUser;
        dbo.collection("accounts").count((errAccount, accountCount) => {
          if (errAccount) throw errAccount; 
          res.send({ success: true, userCount: userCount, accountCount: accountCount });
        });
        db.close();
      });
  });
});

app.post('/api/createUser', (req, res) => {
  mongoClient.connect(uri, function(err, db) {
    if (err)
      res.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    dbo.collection("accounts").updateOne(req.body, function(err, res) {
        if (err) {
          res.send( { success: false, message: "User could not be created." });
        } else {
          res.send( { success: true, message: "User created." });
        }
        db.close();
    });
  });
});

app.post('/api/createAccounts', (req, response) => {
  mongoClient.connect(uri, (err, db) => {
      if (err) 
        response.send( { success: false, message: connectionErrorMessage });
      var dbo = db.db(dbName);
      dbo.collection("accounts").insertMany(req.body, (err, result) => {
          if (err) {
            response.send( { success: false, message: "Accounts could not be created." });
          } else {
            response.send( { success: true, message: result.insertedCount + " accounts created." });
          }
          db.close();
      });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));