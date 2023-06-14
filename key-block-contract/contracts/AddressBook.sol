pragma solidity 0.8;
// SPDX-License-Identifier: MIT

contract AddressBook
{
    uint256 public constant MAX_LENGTH_NAME = 256;

    struct AddressEntry {
        address address0;
        string name;
        uint256 inserted;
        uint256 state;
    }


    struct OwnerEntry {
        string name;
        uint256 inserted;
                uint256 state;
    }


    mapping(address => AddressEntry[]) addressEntriesMap;
    mapping(address => OwnerEntry) ownerEntryMap;


//    function checkContent(string memory _subjectInBox,
//        string memory _textInBox,
//        string memory _subjectOutBox,
//        string memory _textOutBox
//    ) pure private {
//        require(bytes(_subjectInBox).length <= MAX_LENGTH_SUBJECT, "In Box Subject text is too long");
//        require(bytes(_textInBox).length <= MAX_LENGTH_TEXT, "In Box Message text (enc) is too long");
//        require(bytes(_subjectOutBox).length <= MAX_LENGTH_SUBJECT, "Out Box Subject text is too long");
//        require(bytes(_textOutBox).length <= MAX_LENGTH_TEXT, "Out Box Message text (enc) is too long");
//    }

//     function setOwnerEntry(string memory _name, uint256 _state) public
//    {
//        require(bytes(_name).length <= MAX_LENGTH_NAME, "Name is too long");
//        OwnerEntry storage owner = OwnerEntry(_name, block.timestamp, _state);
//    }
//
//     function getOwnerEntry(string memory _name, uint256 _state) public view
//    {
//        require(bytes(_name).length <= MAX_LENGTH_NAME, "Name is too long");
//        OwnerEntry storage owner = OwnerEntry(_name, block.timestamp, _state);
//    }


//
//    function getOwnerEntry() public view returns
//    (
//        string memory name,
//        string memory value,
//        string memory inserted
//    )
//    {
//        require(_index < itemLists[msg.sender].length, "Index out of bounds");
//        name = itemLists[msg.sender][_index].name;
//        value = itemLists[msg.sender][_index].value;
//        inserted = itemLists[msg.sender][_index].inserted;
//        return (name, value, inserted);
//    }

//     function add(address _address0, string memory _name, uint256 _state) public
//    {
//        Item[] storage itemList = itemLists[msg.sender];
//        itemList.push(Item(_name, _value, _inserted));
//    }
//
//    function set(uint256 _index, string memory _name, string memory _value, string memory _inserted) public
//    {
//        require(_index < itemLists[msg.sender].length, "Index out of bounds");
//        itemLists[msg.sender][_index] = Item(_name, _value, _inserted);
//    }


}

/*

address0            -   address1
...                     ...
5: reply-message    -   index:0 sender=:address0, message, hasReply:true, replyIndex:5

*/
