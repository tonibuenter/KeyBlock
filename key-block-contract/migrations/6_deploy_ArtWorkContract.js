const ArtWorkContract = artifacts.require('ArtWorkContract');

module.exports = function (deployer) {
  deployer.deploy(ArtWorkContract);
};
