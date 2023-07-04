const IPFS = require('ipfs-core');
const { globSource } = IPFS;
const expect = chai.expect;
const fs = require('fs');
const path = require('path');

describe('IPFS Tests', function () {
  let ipfs;

  before(async () => {
    ipfs = await IPFS.create();
  });

  it('should add a file to IPFS and retrieve it', async function () {
    // Create a sample file
    const filePath = path.join(__dirname, 'test.txt');
    fs.writeFileSync(filePath, 'Hello, world!');

    // Add file to IPFS
    const { cid } = await ipfs.add(globSource(filePath, { recursive: true }));

    // Retrieve the file
    const stream = ipfs.cat(cid);

    let data = '';

    for await (const chunk of stream) {
      data += chunk.toString();
    }

    // Assert
    expect(data).to.equal('Hello, world!');

    // Clean up
    fs.unlinkSync(filePath);
  });

  after(async () => {
    await ipfs.stop();
  });
});
