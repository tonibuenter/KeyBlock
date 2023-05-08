pragma solidity 0.8;
// SPDX-License-Identifier: MIT

contract PublicKeyStore
{

    mapping(address => string) publicKeyMap;


    function set(string memory _publicKey) public
    {
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
