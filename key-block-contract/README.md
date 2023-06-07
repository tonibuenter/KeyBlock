# Key Block Contract

With KeyBlock you can save your secrets on the EVM-based Blockchain.

### Main screen

- List of key block entries

### Key Block Entry

- Name (label) [unique, max size 128 character]
- Value (Secret) max size 256 character

### Smart Contract Data

address -> array -> entry (name, value, inserted)

### Smart Contract Functions

- len() : length of array of entries
- add(entry) : append an entry
- set(index, entry) : replace an entry
- get(index) : return entry at index



### Deployed contracts:

All contract have been deployed with remix

#### PublicKeyStore
- Fantom Test : 0xcd6806d98948A6B8A63d60F1788687a2646deEB4
