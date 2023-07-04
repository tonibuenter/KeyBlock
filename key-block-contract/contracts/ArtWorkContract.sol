// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ArtWorkContract is Ownable, Pausable {
    struct ArtWork {
        string name;
        string projectReference;
        string description;
        bytes32 documentHash;
        string documentUri;
        string documentName;
        string encryptedDocumentPrivateKey;
        uint256 timestamp;
    }

    mapping(address => ArtWork[]) public artWorks;
    uint256 public savingFee;

    event ArtWorkSaved(address indexed author, uint256 indexed index, uint256 timestamp);

    function saveArtWork(
        string memory _name,
        string memory _projectReference,
        string memory _description,
        bytes32 _documentHash,
        string memory _documentUri,
        string memory _documentName,
        string memory _encryptedDocumentPrivateKey
    ) external payable whenNotPaused {
        require(msg.value >= savingFee, "Saving fee is not met");

        ArtWork memory newArtWork = ArtWork({
            name: _name,
            projectReference: _projectReference,
            description: _description,
            documentHash: _documentHash,
            documentUri: _documentUri,
            documentName: _documentName,
            encryptedDocumentPrivateKey: _encryptedDocumentPrivateKey,
            timestamp: block.timestamp
        });

        artWorks[msg.sender].push(newArtWork);

        emit ArtWorkSaved(msg.sender, artWorks[msg.sender].length - 1, block.timestamp);
    }

    function getArtWorkCount(address author) external view returns (uint256) {
        return artWorks[author].length;
    }

    function getArtWork(address author, uint256 index) external view returns (ArtWork memory) {
        return artWorks[author][index];
    }

    function setSavingFee(uint256 _savingFee) external onlyOwner {
        savingFee = _savingFee;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
