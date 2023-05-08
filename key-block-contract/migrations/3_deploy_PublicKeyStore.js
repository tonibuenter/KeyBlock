const PublicKeyStore = artifacts.require("PublicKeyStore");

module.exports = function (deployer) {
  deployer.deploy(PublicKeyStore);
};
