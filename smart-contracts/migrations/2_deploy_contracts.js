var Apartment = artifacts.require("./Apartment.sol");

module.exports = function(deployer) {
  deployer.deploy(Apartment);
};