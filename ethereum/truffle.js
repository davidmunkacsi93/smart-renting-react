var host = require("../package.json").host;

module.exports = {
  networks: {
    development: {
      host: host,
      port: 8545,
      network_id: "*",
      gas: 4500000
    }
  }
};
