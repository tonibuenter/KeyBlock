const UniqueNameStore = artifacts.require('UniqueNameStore');

module.exports = function (deployer) {
  deployer.deploy(UniqueNameStore);
};
