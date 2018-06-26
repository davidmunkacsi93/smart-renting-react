const express = require('express');
const dbApi = require('./MongoDbApi');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/connect', (req, res) => {
  var result = dbApi.connect();
  res.send({ res: result });
});

app.listen(port, () => console.log(`Listening on port ${port}`));