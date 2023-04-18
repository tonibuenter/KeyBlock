pragma solidity ^0.6.0;


contract Polysafe

{
    struct Item {
        string inserted;
        string secretContent;
    }

    mapping(address => Item[]) itemLists;
    mapping(address => string) keys;
    mapping(address => uint) private itemListIndexes;


    function add(string memory _inserted, string memory _secretContent) public payable
    {
        Item[] storage itemList = itemLists[msg.sender];
        uint itemListIndex = itemListIndexes[msg.sender];
        itemList[itemListIndex] = Item(_inserted, _secretContent);
        itemListIndex += 1;
    }


    function get(uint index) public view returns
    (
        string memory inserted,
        string memory secretContent
    )
    {
        Item storage result = itemLists[msg.sender][index];
        inserted = result.inserted;
        secretContent=result.secretContent;
        return (inserted, secretContent);
    }


    function length() public view returns (uint)
    {
        uint itemListIndex = itemListIndexes[msg.sender];
        return itemListIndex;
    }

}
