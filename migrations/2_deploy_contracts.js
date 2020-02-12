// migrating the appropriate contracts
var Core = artifacts.require("./Core.sol");

module.exports = function(deployer) {
  deployer.deploy(Core);
};
