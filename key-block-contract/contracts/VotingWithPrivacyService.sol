pragma solidity 0.8;
// SPDX-License-Identifier: MIT

contract VotingWithPrivacyService
{

    string question_en;
    string controllerKey;
    address controllerAddress;
    address providerAddress;
    address[] voterAddresses;

    mapping(address => Ballot1[]) addressToMessagesMap;

    struct  Ballot1 {
        address sender;
        string textEnc;
        uint256 inserted;
    }


    function send(address _receiver, string memory _textEnc) public
    {
        Ballot1[] storage list = addressToMessagesMap[_receiver];
        list.push(Ballot1(msg.sender, _textEnc, block.timestamp));
    }

    function get(uint256 _index) public view returns
    (
        address sender,
        string memory textEnc,
        uint256 inserted
    )
    {
        require(_index < addressToMessagesMap[msg.sender].length, "Index out of bounds");
        sender = addressToMessagesMap[msg.sender][_index].sender;
        textEnc = addressToMessagesMap[msg.sender][_index].textEnc;
        uint256 _inserted = addressToMessagesMap[msg.sender][_index].inserted;
        inserted = _inserted * 1000;
        return (sender, textEnc, inserted);
    }


    function len() public view returns (uint)
    {
        return addressToMessagesMap[msg.sender].length;
    }


    function getMillisecondsTimestamp() public view returns (uint256) {
        return block.timestamp * 1000;
    }


}
