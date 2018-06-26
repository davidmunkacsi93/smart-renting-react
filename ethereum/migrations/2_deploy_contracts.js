var Apartment = artifacts.require("./Apartment.sol");
var User = artifacts.require("./User.sol");

module.exports = function(deployer) {
  deployer.deploy(Apartment);
  deployer.deploy(User);
};