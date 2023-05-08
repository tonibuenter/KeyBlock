//const truffleAssert = require('truffle-assertions');
const moment = require('moment');
const {before} = require("truffle/build/4722.bundled");

const PrivateMessageStore = artifacts.require('PrivateMessageStore');

contract('PrivateMessageStore', function (accounts) {
    const address0 = accounts[0];
    const address1 = accounts[1];
    console.debug(accounts.length);


    it('Insert first private message', async () => {
        const textEnc = 'sdjfkdsljfsdjfds';
        const contract = await PrivateMessageStore.deployed();
        const result0 = await contract.send(address1, textEnc, {from: address0});
        console.debug('result0', result0)
        //
        const result1 = await contract.len({from: address1});
        console.debug('result1', result1)
        assert.equal(1, +result1.toString());
        //
        const result2 = await contract.len({from: address0});
        console.debug('result2', result2)
        assert.equal(0, +result2.toString());
    });


    it('Get getMillisecondsTimestamp', async () => {
        const contract = await PrivateMessageStore.deployed();

        console.debug('getMillisecondsTimestamp', moment(+(await contract.getMillisecondsTimestamp()).toString()))
        //
        const msg1 = await contract.get(0, {from: address1});
        console.debug('sender', msg1[0])
        console.debug('textEnc', msg1[1])
        console.debug('timestamp', moment(+msg1[2])) //moment(+msg1[2] * 1000).format('YYYY-MM-DD HH:mm'))
    });

});
