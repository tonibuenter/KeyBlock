pragma solidity 0.8;
// SPDX-License-Identifier: MIT

contract PublicKeyStore
{

    uint256 public constant MAX_LENGTH = 128; // Set this to your desired maximum length

    mapping(address => string) publicKeyMap;


    function set(string memory _publicKey) public
    {
        require(bytes(_publicKey).length <= MAX_LENGTH, "PublicKey is too long");
        publicKeyMap[msg.sender] = _publicKey;
    }


    function get(address _address) public view returns
    (
        string memory
    )
    {
        return publicKeyMap[_address];
    }


    function getMine() public view returns (   string memory )
    {
        return publicKeyMap[msg.sender];
    }

}
