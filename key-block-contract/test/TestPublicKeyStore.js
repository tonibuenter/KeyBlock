//const truffleAssert = require('truffle-assertions');
const PublicKeyStore = artifacts.require('PublicKeyStore');

contract('PublicKeyStore', function (accounts) {
    const address0 = accounts[0];
    console.debug(accounts.length);

    it('Insert first', async () => {
        const testPublicKey = 'AREALLYFUNNYPUBLICADDRESS';
        const contract = await PublicKeyStore.deployed();
        const result0 = await contract.set(testPublicKey, {from: address0});
        console.debug('result0', result0)
        //
        const result1 = await contract.get(address0, {from: address0});
        console.debug('result1', result1)
        //assert.equal(0, +length.toString());
        //
        const result2 = await contract.getMine({from: address0});
        console.debug('result2', result2)
        assert.equal(result1.toString(), result2.toString());
        assert.equal(result1.toString(), testPublicKey);
    });
    it('Check second', async () => {
        const testPublicKey = 'AREALLYFUNNYPUBLICADDRESS';
        const contract = await PublicKeyStore.deployed();

        //
        const result1 = await contract.get(address0, {from: address0});
        console.debug('result1', result1)
        //assert.equal(0, +length.toString());
        //
        const result2 = await contract.getMine({from: address0});
        console.debug('result2', result2)
        assert.equal(result1.toString(), result2.toString());
        assert.equal(result1.toString(), testPublicKey);
    });

});
