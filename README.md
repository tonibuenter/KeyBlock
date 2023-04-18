# Polysafe

With Polysafe you can safe your secrets on the Polygone Blockchain save and sure.

### Main screen

- List of entries

### Entry

- Name (label) [unique, max size 32 character]
- Secret max size 64 character


### Key

- One polysafe key with NACL, encrypted with MetaMask (Wallet) secret

### Smart Contract Data

address -> map: Name -> Encr-Secret

### Smart Contract Functions for User

- list()
- save(name, secret)


### Smart Contract Functions for Admin and Migration

- list(address)
