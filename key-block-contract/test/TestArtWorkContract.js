const ArtWorkContract = artifacts.require('ArtWorkContract');
const { expect } = require('chai');
const truffleAssert = require('truffle-assertions');
const BN = require('bn.js');

contract('ArtWorkContract', function (accounts) {
  let contractInstance;
  const owner = accounts[0];
  const author = accounts[1];
  const savingFee = web3.utils.toWei(new BN(1), 'ether'); // 1 Ether

  before(async function () {
    contractInstance = await ArtWorkContract.deployed();
  });

  it('Should be able to set saving fee', async function () {
    await contractInstance.setSavingFee(savingFee, { from: owner });
    const fee = await contractInstance.savingFee();
    expect(fee.toString()).to.equal(savingFee.toString());
  });

  it('Should not allow non-owners to set saving fee', async function () {
    await truffleAssert.reverts(
      contractInstance.setSavingFee(savingFee, { from: author }),
      'Ownable: caller is not the owner'
    );
  });

  it('Should allow an author to save an artwork', async function () {
    const tx = await contractInstance.saveArtWork(
      'Art Work 1',
      'Project 1',
      'Description 1',
      web3.utils.keccak256('Document 1'),
      'ipfs://documentUri',
      'Document 1',
      'encryptedDocumentPrivateKey',
      { from: author, value: savingFee }
    );

    truffleAssert.eventEmitted(tx, 'ArtWorkSaved', (event) => {
      return event.author === author && event.index.toString() === '0';
    });
  });

  it('Should not allow an author to save an artwork without enough fee', async function () {
    await truffleAssert.reverts(
      contractInstance.saveArtWork(
        'Art Work 2',
        'Project 2',
        'Description 2',
        web3.utils.keccak256('Document 2'),
        'ipfs://documentUri2',
        'Document 2',
        'encryptedDocumentPrivateKey2',
        { from: author, value: '0' }
      ),
      'Saving fee is not met'
    );
  });

  it('Should get the correct artwork count', async function () {
    const count = await contractInstance.getArtWorkCount(author);
    expect(count.toString()).to.equal('1');
  });

  it('Should get the correct artwork data', async function () {
    const artwork = await contractInstance.getArtWork(author, 0);
    expect(artwork.name).to.equal('Art Work 1');
    expect(artwork.projectReference).to.equal('Project 1');
    expect(artwork.description).to.equal('Description 1');
    expect(artwork.documentHash).to.equal(web3.utils.keccak256('Document 1'));
    expect(artwork.documentUri).to.equal('ipfs://documentUri');
    expect(artwork.documentName).to.equal('Document 1');
    expect(artwork.encryptedDocumentPrivateKey).to.equal('encryptedDocumentPrivateKey');
  });
});
