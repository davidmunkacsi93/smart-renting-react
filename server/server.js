const express = require('express');
const url = require('url');
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

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

app.get('/api/getAccountCount', (req, res) => {
  mongoClient.connect(uri, (err, db) => {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("accounts").count((err, count) => {
      if (err) throw err; 
      res.send({ success: true, count: count });
    });
    db.close();
  });
});

app.get('/api/getAccount', (request, response) => {
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    var query = { account: { user: request.body }};
    dbo.collection("accounts").findOne(query, function(err, document) {
        if (err)  {
          response.send( { success: false, message: "User could not be found." });
          throw err;
        } else {
          response.send( { success: true, message: "User created successfully.", account: document });
        }
    });
    db.close();
  });
});

app.get('/api/getAccountWithApartments', (request, response) => {
  var address = url.parse(request.url, true).query.address;
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    var query = { address: address };
    dbo.collection("accounts").findOne(query, function(err, document) {
        if (err)  {
          response.send( { success: false, message: "Error by querying accounts." });
          throw err;
        } else {
          response.send( { success: true, account: document });
        }
    });
    db.close();
  });
});

app.get('/api/getApartments', (request, response) => {
  // var address = url.parse(request.url, true).query.address;
  // mongoClient.connect(uri, function(err, db) {
  //   if (err) response.send( { success: false, message: connectionErrorMessage });
  //   var dbo = db.db(dbName);
  //   var query = { address: address };
  //   dbo.collection("accounts").find(query, {}).toArray(function(err, documents) {
  //       if (err)  {
  //         response.send( { success: false, message: "Error by querying accounts." });
  //         throw err;
  //       } else {
  //         response.send( { success: true, account: JSON.stringify(documents) });
  //       }
  //   });
  //   db.close();
  // });
});

app.post('/api/createUser', (request, response) => {
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    var query = { user: { $exists: false }};
    var update = { $set: { user: request.body } };
    dbo.collection("accounts").findOneAndUpdate(query, update, { returnOriginal: false }, function(err, document) {
        if (err)  {
          response.send( { success: false, message: "User could not be created." });
          throw err;
        } if (document.value === null) {
          response.send( { success: false, message: "No more available accounts." });
        } 
        else {
          response.send( { success: true, message: "User created successfully.", account: document.value });
        }
    });
    db.close();
  });
});

app.post('/api/createApartment', (request, response) => {
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    var query = { address: request.body.account.address };
    var apartment = request.body.apartment;
    apartment["_id"] = ObjectId();
    var update = { $push: { apartments: request.body.apartment } };
    dbo.collection("accounts").findOneAndUpdate(query, update, { returnOriginal: false }, function(err, document) {
        if (err)  {
          response.send( { success: false, message: "Apartment could not be created." });
          throw err;
        }
        else {
          var apartment = document.value.apartments[document.value.apartments.length-1];
          response.send( { success: true, message: "Apartment created successfully.", account: document.value, apartment: apartment });
        }
    });
    db.close();
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
      });
      db.close();
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));