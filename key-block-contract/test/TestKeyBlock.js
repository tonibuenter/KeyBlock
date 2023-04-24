//const truffleAssert = require('truffle-assertions');
const moment = require('moment');
const KeyBlock = artifacts.require('KeyBlock');

contract('KeyBlock', function (accounts) {
  const address0 = accounts[0];
  console.debug(accounts.length);
  const inserted = moment().format('YYYY-MM-DD');
  const name1 = 'emailPass0';
  const secretContent1 = 'asfieriw00erzu';
  const name2 = 'emailPass2';
  const secretContent2 = 'asfie222riw2erzu';
  const name3 = 'emailPass3';
  const secretContent3 = 'asfie1234riwerzu';

  it('Check start is empty', async () => {
    const keyblock = await KeyBlock.deployed();
    const length = await keyblock.len({ from: address0 });
    assert.equal(0, +length.toString());
  });

  it('Add first entry', async () => {
    const keyblock = await KeyBlock.deployed();
    await keyblock.add(name1, secretContent1, inserted, { from: address0 });
    const length = await keyblock.len({ from: address0 });
    assert.equal(1, +length.toString());
  });

  it('Add Second entry', async () => {
    const keyblock = await KeyBlock.deployed();
    await keyblock.add(name2, secretContent2, inserted, { from: address0 });
    const length = await keyblock.len({ from: address0 });
    assert.equal(2, +length.toString());
  });
  it('Check first entry', async () => {
    const keyblock = await KeyBlock.deployed();
    const r = await keyblock.get(0, { from: address0 });
    assert.equal(r[0], name1);
    assert.equal(r[1], secretContent1);
    assert.equal(r[2], inserted);
  });
  it('Check second entry', async () => {
    const keyblock = await KeyBlock.deployed();
    const r = await keyblock.get(1, { from: address0 });
    assert.equal(r[0], name2);
    assert.equal(r[1], secretContent2);
    assert.equal(r[2], inserted);
  });
  it('Overwrite first entry', async () => {
    const keyblock = await KeyBlock.deployed();
    await keyblock.set(0, name3, secretContent3, inserted, { from: address0 });
    const length = await keyblock.len({ from: address0 });
    assert.equal(2, +length.toString());
  });
  it('Check overwritten first entry', async () => {
    const keyblock = await KeyBlock.deployed();
    const r = await keyblock.get(0, { from: address0 });
    assert.equal(r[0], name3);
    assert.equal(r[1], secretContent3);
    assert.equal(r[2], inserted);
  });
});
