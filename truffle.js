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
        },
        rinkeby: {
            host: 'localhost', // Localhost (default: none)
            provider: function () {
                return new HDWalletProvider(config.privateKey, 'https://rinkeby.infura.io/v3/' + config.projectId);
            },
            network_id: 4,
            gas: 6700000,
            gasPrice: 10000000000
        },
        goerli: {
            host: 'localhost', // Localhost (default: none)
            provider: function () {
                return new HDWalletProvider(config.main_privateKey, config.goerli_infura_url);
            },
            network_id: 5,
            gas: 6700000,
            gasPrice: 60000000000
        }
        ,
        polygon_mumbai: {
            host: 'localhost', // Localhost (default: none)
            provider: function () {
                return new HDWalletProvider(config.main_privateKey, config.mumbai_infura_url);
            },
            network_id: "*",
            chain_id:"*",
            gas: 6700000,
            gasPrice: 429507555220
        }
    },
    compilers: {
        solc: {
            version: '0.6.0' // ex:  "0.4.20". (Default: Truffle's installed solc)
        }
    }
};
