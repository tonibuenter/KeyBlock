const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const path = require('path');
let rawdata = fs.readFileSync(path.join(__dirname, 'local', 'config.json'));
let config = JSON.parse(rawdata);
console.log(config);

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*' // Match any network id
        }
    },
    compilers: {
        solc: {
            version: '0.8.0'
        }
    }
};
