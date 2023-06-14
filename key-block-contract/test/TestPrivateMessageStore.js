//const truffleAssert = require('truffle-assertions');
const { assert } = require('chai');

const PrivateMessageStore = artifacts.require('PrivateMessageStore');

const subjectInBox = 'Important!!!-in';
const textInBox = 'Hello-World-Zero-in';

const subjectOutBox = 'Important!!!-out';
const textOutBox = 'Hello-World-Zero-out';

const contentHash = web3.utils.keccak256(subjectInBox + '-' + textInBox);
// const contentHash = web3.utils.fromAscii(web3.utils.keccak256('1234'));

// struct MessageInBox {
//      address sender;
//      uint256 indexOutBox;
//      string subjectInBox;
//      string textInBox;
//      uint256 inserted;
//
//      uint256 confirmedTime;
//      bool confirmed;
//      bool hasReply;
//      uint256 replyIndex;
//      bytes32 contentHash;
//  }
//
//  struct MessageOutBox {
//      address receiver;
//      uint256 indexInBox;
//      string subjectOutBox;
//      string textOutBox;
//      uint256 inserted;
//      bytes32 contentHash;
//  }

contract('PrivateMessageStore', function (accounts) {
  const address0 = accounts[0];
  const address1 = accounts[1];
  const alice = accounts[2];
  const bob = accounts[3];
  const charlie = accounts[4];
  console.debug(accounts.length);

  it('Check MAX_LENGTH_SUBJECT and MAX_LENGTH_TEXT', async () => {
    const contract = await PrivateMessageStore.deployed();
    const maxLengthSubject = await contract.MAX_LENGTH_SUBJECT.call();
    assert.equal(256, maxLengthSubject);
    const maxLengthTextEnc = await contract.MAX_LENGTH_TEXT.call();
    assert.equal(512, maxLengthTextEnc);

    // send message: address0 -> addr
  });

  it('Insert and select first private message', async () => {
    const contract = await PrivateMessageStore.deployed();

    // send message: address0 -> address1
    const result0 = await contract.send(address1, subjectInBox, textInBox, subjectOutBox, textOutBox, contentHash, {
      from: address0
    });
    console.debug('result0', result0);
    //
    const lenInBox = await contract.lenInBox({ from: address1 });
    console.debug('lenInBox', lenInBox);
    assert.equal(+lenInBox.toString(), 1);

    assertOutBoxLen(contract, address0, 1);
    assertInBoxLen(contract, address0, 0);
    assertOutBoxLen(contract, address1, 0);
    assertInBoxLen(contract, address1, 1);

    const getInBox = await contract.getInBox(0, { from: address1 });
    assert.equal(getInBox.sender, address0);
    assert.equal(getInBox.indexOutBox, 0);
    assert.equal(getInBox.subjectInBox, subjectInBox);
    assert.equal(getInBox.textInBox, textInBox);
    assert.equal(getInBox.contentHash, contentHash);
    let inserted = getInBox.inserted.toString();
    assert.isBelow(Math.abs(Date.now() - inserted * 1000), 1000);

    const getOutBox = await contract.getOutBox(0, { from: address0 });
    assert.equal(getOutBox.receiver, address1);
    assert.equal(getOutBox.indexInBox, 0);
    assert.equal(getOutBox.subjectOutBox, subjectOutBox);
    assert.equal(getOutBox.textOutBox, textOutBox);
    assert.equal(getOutBox.contentHash, contentHash);
    inserted = getOutBox.inserted.toString();
    assert.isBelow(Math.abs(Date.now() - inserted * 1000), 1000);
  });

  it('confirm first private message', async () => {
    const contract = await PrivateMessageStore.deployed();
    assertOutBoxLen(contract, address0, 1);
    assertInBoxLen(contract, address0, 0);
    assertOutBoxLen(contract, address1, 0);
    assertInBoxLen(contract, address1, 1);

    await contract.confirm(0, { from: address1 });

    const getInBox = await contract.getInBox(0, { from: address1 });
    const getOutBox = await contract.getOutBox(0, { from: address0 });

    assert.isBelow(Math.abs(Date.now() - getInBox.confirmedTime * 1000), 2000);
    assert.isTrue(getInBox.confirmed);

    assert.isBelow(Math.abs(Date.now() - getOutBox.confirmedTime * 1000), 2000);
    assert.isTrue(getOutBox.confirmed);
  });

  it('reply to first private message', async () => {
    const contract = await PrivateMessageStore.deployed();
    // // reply message: address1 -> address0
    const replySubject = 'RE:' + subjectInBox;
    const replyText = 'I agree...';
    await contract.reply(address0, replySubject, replyText, replySubject, replyText, contentHash, 0, {
      from: address1
    });

    assertOutBoxLen(contract, address0, 1);
    assertInBoxLen(contract, address0, 1);
    assertOutBoxLen(contract, address1, 1);
    assertInBoxLen(contract, address1, 1);

    const getInBox = await contract.getInBox(0, { from: address0 });
    assert.equal(getInBox.sender, address1);
    assert.equal(getInBox.subjectInBox, replySubject);
    assert.equal(getInBox.textInBox, replyText);
    assert.equal(+getInBox.indexOutBox.toString(), 0);
    assert.equal(getInBox.contentHash, contentHash);
    let inserted = getInBox.inserted.toString();
    assert.isBelow(Math.abs(Date.now() - inserted * 1000), 2000);

    const getOutBox = await contract.getOutBox(0, { from: address1 });
    assert.equal(getOutBox.receiver, address0);
    assert.equal(getOutBox.indexInBox, 0);
    assert.equal(getOutBox.subjectOutBox, replySubject);
    assert.equal(getOutBox.textOutBox, replyText);
    assert.equal(getOutBox.contentHash, contentHash);
    inserted = getOutBox.inserted.toString();
    assert.isBelow(Math.abs(Date.now() - inserted * 1000), 1000);
  });

  it('Multiple messages and replies', async () => {
    const contract = await PrivateMessageStore.deployed();

    const messages = [
      {
        from: alice,
        to: bob,
        subject: 'hello',
        text: 'how are you'
      },
      {
        from: bob,
        to: alice,
        subject: 'RE-hello',
        text: 'Good, what about you?',
        replayIndex: 0
      },
      {
        from: charlie,
        to: alice,
        subject: 'Guten Tag',
        text: 'Ich wollte mich mal wieder melden'
      }
    ];

    await processMessages(contract, messages);

    //
    await assertInBoxLen(contract, alice, 2);
    await assertInBoxLen(contract, bob, 1);
    await assertInBoxLen(contract, charlie, 0);
    await assertMessageInBox(contract, bob, 0, { ...messages[0], confirmed: false, hasReply: true });
    await assertMessageInBox(contract, alice, 0, { ...messages[1], confirmed: false, hasReply: false });
  });
});

async function processMessages(contract, messages) {
  for (const entry of messages) {
    const { from, subject, text, to, replayIndex } = entry;
    const contentHash = web3.utils.keccak256(subject + '-' + text);

    if (replayIndex === undefined) {
      await contract.send(to, subject, text, subject, text, contentHash, { from });
    } else {
      await contract.reply(to, subject, text, subject, text, contentHash, replayIndex, { from });
    }
  }
}

async function assertOutBoxLen(contract, address, lenOutBox) {
  const actual = await contract.lenOutBox({ from: address });
  assert.equal(actual.toString(), lenOutBox);
}

async function assertInBoxLen(contract, address, outInLen) {
  const actual = await contract.lenInBox({ from: address });
  assert.equal(actual.toString(), outInLen);
}

async function assertMessageInBox(contract, address, index, message) {
  const msg = await contract.getInBox(index, { from: address });
  assert.equal(message.subject, msg.subjectInBox);
  assert.equal(message.text, msg.textInBox);
  assert.equal(message.confirmed, msg.confirmed);
  assert.equal(message.hasReply, msg.hasReply);
  assert.equal(message.from, msg.sender);
}
