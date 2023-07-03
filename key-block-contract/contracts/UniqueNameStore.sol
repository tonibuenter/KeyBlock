// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";

contract UniqueNameStore is Ownable, Pausable {

    mapping(address => string) public addressToNameMap;
    mapping(string => address) public nameToAddressMap;

    function setName(string memory _name) public whenNotPaused {
        // Ensure the name is not already taken.
        require(nameToAddressMap[_name] == address(0), "Name already taken!");

        // If the caller already has a name, remove the old name.
        string memory currentName = addressToNameMap[msg.sender];
        if (bytes(currentName).length > 0) {
            delete nameToAddressMap[currentName];
        }

        // Set the new name.
        addressToNameMap[msg.sender] = _name;
        nameToAddressMap[_name] = msg.sender;
    }

    function unSetName() public whenNotPaused {
        // Ensure the name is available.
        require(bytes(addressToNameMap[msg.sender]).length > 0, "No name set!");

        string memory currentName = addressToNameMap[msg.sender];

        delete nameToAddressMap[currentName];
        delete addressToNameMap[msg.sender];

    }

    function changeName(address _address, string memory _newName) public onlyOwner {
        // Ensure the new name is not already taken.
        require(nameToAddressMap[_newName] == address(0), "New name already taken");

        // Remove the old name mapping.
        string memory currentName = addressToNameMap[_address];
        if (bytes(currentName).length > 0) {
            delete nameToAddressMap[currentName];
        }

        // Set the new name.
        addressToNameMap[_address] = _newName;
        nameToAddressMap[_newName] = _address;
    }

    function removeName(string memory _name) public onlyOwner {
        address ownerAddress = nameToAddressMap[_name];

        require(ownerAddress != address(0), "Name does not exist");

        delete nameToAddressMap[_name];
        delete addressToNameMap[ownerAddress];
    }


    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

}
