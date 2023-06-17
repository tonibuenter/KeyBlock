const UniqueNameStore = artifacts.require('UniqueNameStore');

contract('UniqueNameStore', (accounts) => {
  let contractInstance;
  const owner = accounts[0];
  const user = accounts[2];
  const userName = 'Alice';
  const newUserName = 'Bob';

  const newOwner = accounts[1];

  before(async () => {
    contractInstance = await UniqueNameStore.deployed();
  });

  it('allows a user to set their name', async () => {
    await contractInstance.setName(userName, { from: user });

    const name = await contractInstance.addressToNameMap(user);

    assert.equal(name, userName, 'The name was not set correctly');
  });

  it('does not allow a name to be taken by another user', async () => {
    try {
      await contractInstance.setName(userName, { from: owner });
      assert.fail('Expected error not received');
    } catch (error) {
      assert(
        error.message.includes('Name already taken'),
        "Expected 'Name already taken' but got '" + error.message + "' instead"
      );
    }
  });

  it("allows the owner to change a user's name", async () => {
    await contractInstance.changeName(user, newUserName, { from: owner });

    const newName = await contractInstance.addressToNameMap(user);

    assert.equal(newName, newUserName, 'The name was not changed correctly');
  });

  it('allows the owner to remove a name', async () => {
    await contractInstance.removeName(newUserName, { from: owner });

    const removedName = await contractInstance.addressToNameMap(user);

    assert.equal(removedName, '', 'The name was not removed correctly');
  });

  it('pauses the contract', async () => {
    await contractInstance.pause({ from: owner });

    try {
      await contractInstance.setName('Eve', { from: user });
      assert.fail('Expected error not received');
    } catch (error) {
      assert(
        error.message.includes('Pausable: paused'),
        "Expected 'Pausable: paused' but got '" + error.message + "' instead"
      );
    }
  });

  it('unpauses the contract', async () => {
    await contractInstance.unpause({ from: owner });

    await contractInstance.setName('Eve', { from: user });

    const name = await contractInstance.addressToNameMap(user);

    assert.equal(name, 'Eve', 'The name was not set correctly after unpausing');
  });

  it('changes the contract owner', async () => {
    // Transfer the ownership to a new owner
    await contractInstance.transferOwnership(newOwner, { from: owner });

    const contractOwner = await contractInstance.owner();

    assert.equal(contractOwner, newOwner, 'The owner was not changed correctly');
  });

  it('allows the new owner to perform owner-only actions', async () => {
    // Set a name as the new owner
    await contractInstance.setName(userName, { from: newOwner });

    const name = await contractInstance.addressToNameMap(newOwner);

    assert.equal(name, userName, 'The new owner could not set a name');
  });

  it('prevents the old owner from performing owner-only actions', async () => {
    // Attempt to change a user's name as the old owner
    try {
      await contractInstance.changeName(user, newUserName, { from: owner });
      assert.fail('Expected error not received');
    } catch (error) {
      assert(
        error.message.includes('Ownable: caller is not the owner'),
        "Expected 'Ownable: caller is not the owner' but got '" + error.message + "' instead"
      );
    }
  });
});
