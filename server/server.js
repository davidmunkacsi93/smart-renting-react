const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

const ioPort = 8000;
const io = require("socket.io").listen(ioPort);
var clientDict = {};
io.on("connection", client => {
  var address = client.request._query["address"];
  console.log("[" + address + "] connected.");
  clientDict[address] = client.id;
  client.on("sendMessage", data => {
    if (!clientDict[data.address]) {
      console.log("Client " + data.address + " not found");
      return;
    }
    console.log("Message to " + data.address);
    client.broadcast
      .to(clientDict[data.address])
      .emit("receiveMessage", data.message);
  });
  client.on("handshake", data => {
    console.log("Handshake with " + data.to);
    if (!clientDict[data.to]) {
      console.log("Client with address " + data.to + " not found");
      return;
    }
    client.broadcast.to(clientDict[data.to]).emit("handshake", data);
  });
  client.on("requestPermissionToPay", data => {
    if (!clientDict[data.to]) {
      console.log("Client with address " + data.to + " not found");
      return;
    }
    client.broadcast
      .to(clientDict[data.to])
      .emit("requestPermissionToPay", data);
  });
  client.on("permissionDenied", data => {
    if (!clientDict[data.address]) {
      console.log("Client with address " + data.address + " not found");
      return;
    }
    client.broadcast
      .to(clientDict[data.address])
      .emit("permissionDenied", data);
  });
  client.on("permissionGranted", data => {
    if (!clientDict[data.address]) {
      console.log("Client with address " + data.address + " not found");
      return;
    }
    client.broadcast
      .to(clientDict[data.address])
      .emit("permissionGranted", data);
  });
  client.on("depositTransferred", data => {
    if (!clientDict[data.to]) {
      console.log("Client with address " + data.to + " not found");
      return;
    }
    client.broadcast.to(clientDict[data.to]).emit("depositTransferred", data);
  });
  client.on("rentTransferred", data => {
    if (!clientDict[data.to]) {
      console.log("Client with address " + data.to + " not found");
      return;
    }
    client.broadcast.to(clientDict[data.to]).emit("rentTransferred", data);
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
