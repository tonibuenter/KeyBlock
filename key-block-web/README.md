# KeyBlock Web

KeyBlock Web is a ReactJS front end for the KeyBlock contract.


## Functionality

The following functionality is included:
- Connect to address and netword via MetaMask browser extension
- Reading KeyBlock entries from the blockchain (belonging to the address)
- Add new KeyBlock entries
- Update KeyBlock entries
- Encrypt the entry value with the public key of the address
- Decrypt the entry value with the private key of the address
- Only encrypted values are saved to the blockchain


## Blockchains

The BlockKey contract is deployed to the following EVM-compatible blockchains main networks:
- Ethereum: 
- Polygon
- Fanton

For testing the BlockKey contract is deployed to the following test blockchains:
- Polygon Mumbai
- Fantom Testnet
- 


## Troubleshooting & Errors
`react-app-rewired build` produces built with the following error

```
caught TypeError: Cannot convert a BigInt value to a number
    at Math.pow (<anonymous>)

```

Solution

Update browser list in `package.json`:

```
"browserslist": {
    "production": [
      "chrome >= 67",
      "edge >= 79",
      "firefox >= 68",
      "opera >= 54",
      "safari >= 14"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }

```

