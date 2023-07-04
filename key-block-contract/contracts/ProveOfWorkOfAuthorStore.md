# A Solidity Contract for Proof of Art Work of Authorship with Encrypted Document Storage

## Requirements

- The author has an Ethereum address with a (public) address, its private key and its public key
- The author can save a so-called art work record about a work he created for later prove of his ownership
- The art work record contains a name, a description, a document uri, an encrypted private key for the document
- A key pair - the document key - is created for every art work record and is safely encrypted by the authors public
  key, this is done outside the contract
- The contract saves the art work record. The art work record contains the following attributes
    - the name of the art work
    - the project reference of the art work - just a reference for the author
    - the description or the art work
    - the document hash
    - the document IPFS uri
    - the document name
    - the encrypted documents private key (encrypted by the author public key)
    - a timestamp of the save time when the entry is saved linked to the authors address
- The document is encrypted by the document public key and stored in IPFS using the filecoin blockchain
- The data entry can NOT be edited, removed or otherwise hidden
- The data can be read by everybody but the document can not be decrypted except by the author
- Providing an address the contract return the number of entries of an author
- Providing an address and an index the contract return the art work record attributes
- The contract is ownable, pausable
- The contract has a saving fee attribute the owner can edit
- Every save of an art work record requires that the saving fee is provided by the author
- The contract owner can send the accumulated saving fee amount ot his address

Now please do the following:

- create the art work contract according to the Requirements
- create code templates for saving the document on IPFS with Filecoin

