//const truffleAssert = require('truffle-assertions');
const PublicKeyStore = artifacts.require('PublicKeyStore');
const testPublicKey = 'AREALLY-FUNNYPUBLIC-ADDRESS';

contract('PublicKeyStore', function (accounts) {
  const address0 = accounts[0];
  const address1 = accounts[1];
  console.debug(accounts.length);

  it('Insert first', async () => {
    const contract = await PublicKeyStore.deployed();
    const result0 = await contract.set(testPublicKey, { from: address0 });
    console.debug('result0', result0);
    //
    const result1 = await contract.get(address0, { from: address0 });
    console.debug('result1', result1);
    //assert.equal(0, +length.toString());
    //
    const result2 = await contract.getMine({ from: address0 });
    console.debug('result2', result2);
    assert.equal(result1.toString(), result2.toString());
    assert.equal(result1.toString(), testPublicKey);
  });
  it('Check getMine time', async () => {
    const contract = await PublicKeyStore.deployed();

    //
    const result1 = await contract.get(address0, { from: address0 });
    console.debug('result1', result1);
    //assert.equal(0, +length.toString());
    //
    const result2 = await contract.getMine({ from: address0 });
    console.debug('result2', result2);
    assert.equal(result1.toString(), result2.toString());
    assert.equal(result1.toString(), testPublicKey);
  });

  it('Check get public key of address0 by address1', async () => {
    const contract = await PublicKeyStore.deployed();
    const result1 = await contract.get(address0, { from: address1 });
    console.debug('result1', result1);
    assert.equal(result1.toString(), testPublicKey);
  });
});
