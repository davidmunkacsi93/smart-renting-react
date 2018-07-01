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

const ioPort = 8000;
const io = require('socket.io').listen(ioPort);
var clientDict = {};
io.on('connection', (client) => {
  var address = client.request._query["address"];
  console.log("[" + address + "] connected.")
  clientDict[address] = client.id;
  client.on('sendMessage', (data) => {
      if (!clientDict[data.address]) {
        console.log("Client " + data.address + " not found");
        return;
      }
      console.log("Message to " + data.address);
      client.broadcast.to(clientDict[data.address]).emit('receiveMessage', data.message);
  });
  client.on('handshake', (data) => {
      console.log("Handshake with " + data.to);
      if (!clientDict[data.to]) {
        console.log("Client with address " + data.to + " not found");
        return;
      }
      client.broadcast.to(clientDict[data.to]).emit('handshake', data);
  });
  client.on('requestPermissionToPay', (data) => {
    if (!clientDict[data.to]) {
      console.log("Client with address " + data.to + " not found");
      return;
    }
    client.broadcast.to(clientDict[data.to]).emit('requestPermissionToPay', data);
  });
  client.on('permissionDenied', (data) => {
    if (!clientDict[data.address]) {
      console.log("Client with address " + data.address + " not found");
      return;
    }
    client.broadcast.to(clientDict[data.address]).emit('permissionDenied', data);
  });
  client.on('permissionGranted', (data) => {
    if (!clientDict[data.address]) {
      console.log("Client with address " + data.address + " not found");
      return;
    }
    client.broadcast.to(clientDict[data.address]).emit('permissionGranted', data);
  });
  client.on('depositTransferred', (data) => {
    if (!clientDict[data.to]) {
      console.log("Client with address " + data.to + " not found");
      return;
    }
    client.broadcast.to(clientDict[data.to]).emit('depositTransferred', data);
  });
  client.on('rentTransferred', (data) => {
    if (!clientDict[data.to]) {
      console.log("Client with address " + data.to + " not found");
      return;
    }
    client.broadcast.to(clientDict[data.to]).emit('rentTransferred', data);
  });
});

app.get('/api/getAccountCount', (_, res) => {
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

app.get('/api/getAccountByUsername', (request, response) => {
  var username = url.parse(request.url, true).query.username;
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    var query = { user: { username: username } };
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

app.get('/api/getAccountByApartmentId', (request, response) => {
  var apartmentId = url.parse(request.url, true).query.apartmentId;
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    var query = { apartments: {
      $elemMatch: { 
          _id: ObjectId(apartmentId)
         } 
       } 
     };
    dbo.collection("accounts").findOne(query, function(err, document) {
        if (err)  {
          response.send( { success: false, message: "Error by querying accounts." });
          throw err;
        } else {
          response.send( { success: true, account: JSON.stringify(document) });
        }
    });
    db.close();
  });
});

app.get('/api/getAccountsWithAvailableApartments', (request, response) => {
  var address = url.parse(request.url, true).query.address;
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    var query = { address: { $ne: address },
    apartments: {
       $elemMatch: { 
           isRented: false
          } 
        } 
      };
    dbo.collection("accounts").find(query, {}).toArray(function(err, documents) {
        if (err)  {
          response.send( { success: false, message: "Error by querying accounts." });
          throw err;
        } else {
          response.send( { success: true, accounts: JSON.stringify(documents) });
        }
    });
    db.close();
  });
});

app.get('/api/getTransactionsByApartmentId', (request, response) => {
  var apartmentId = url.parse(request.url, true).query.apartmentId;
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    console.log(apartmentId);
    var query = { apartmentId: apartmentId };
    dbo.collection("transactions").find(query, {}).toArray(function(err, documents) {
        if (err)  {
          response.send( { success: false, message: "Error by querying transactions." });
          throw err;
        } else {
          response.send( { success: true, transactions: JSON.stringify(documents) });
        }
    });
    db.close();
  });
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


app.post('/api/createApartmentTransaction', (request, response) => {
  mongoClient.connect(uri, function(err, db) {
    if (err) response.send( { success: false, message: connectionErrorMessage });
    var dbo = db.db(dbName);
    const obj = {
      apartmentId: request.body.apartmentId,
      address: request.body.address,
      transactionMessage: request.body.transactionMessage,
      transactionHash: request.body.transactionHash
    }
    console.log(obj);
    dbo.collection("transactions").insert(obj, (err, _) => {
      if (err) {
        response.send( { success: false, message: "Transaction could not be created." });
      } else {
        response.send( { success: true, message: "Transaction created." });
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