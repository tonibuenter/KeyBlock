const PrivateMessageStore = artifacts.require("PrivateMessageStore");

module.exports = function (deployer) {
  deployer.deploy(PrivateMessageStore);
};
