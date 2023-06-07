pragma solidity 0.8;
// SPDX-License-Identifier: MIT

contract PrivateMessageStore
{
    uint256 public constant MAX_LENGTH_SUBJECT = 256; // Set this to your desired maximum length
    uint256 public constant MAX_LENGTH_TEXT = 512; // Set this to your desired maximum length

    struct MessageInBox {
        address sender;
        uint256 indexOutBox;
        string subjectInBox;
        string textInBox;
        uint256 inserted;

        uint256 confirmedTime;
        bool confirmed;
        bool hasReply;
        uint256 replyIndex;
        bytes32 contentHash;
    }

    struct MessageOutBox {
        address receiver;
        uint256 indexInBox;
        string subjectOutBox;
        string textOutBox;
        bytes32 contentHash;
    }

    mapping(address => MessageInBox[]) addressToMessageInBoxMap;
    mapping(address => MessageOutBox[]) addressToMessageOutBoxMap;


    function checkContent(string memory _subjectInBox,
        string memory _textInBox,
        string memory _subjectOutBox,
        string memory _textOutBox
    ) private {
        require(bytes(_subjectInBox).length <= MAX_LENGTH_SUBJECT, "In Box Subject text is too long");
        require(bytes(_textInBox).length <= MAX_LENGTH_TEXT, "In Box Message text (enc) is too long");
        require(bytes(_subjectOutBox).length <= MAX_LENGTH_SUBJECT, "Out Box Subject text is too long");
        require(bytes(_textOutBox).length <= MAX_LENGTH_TEXT, "Out Box Message text (enc) is too long");
    }


    function send(
        address _receiver,
        string memory _subjectInBox,
        string memory _textInBox,
        string memory _subjectOutBox,
        string memory _textOutBox,
        bytes32 _contentHash) public
    {

        checkContent(_subjectInBox, _textInBox, _subjectOutBox, _textOutBox);
        MessageInBox[] storage inBox = addressToMessageInBoxMap[_receiver];
        MessageOutBox[] storage outBox = addressToMessageOutBoxMap[msg.sender];

        uint256 indexInBox = inBox.length;
        uint256 indexOutBox = outBox.length;

        inBox.push(MessageInBox(msg.sender, indexOutBox, _subjectInBox, _textInBox,
            block.timestamp,
            0, false, false, 0, _contentHash));

        outBox.push(MessageOutBox(_receiver, indexInBox, _subjectOutBox, _textOutBox,
            _contentHash));
    }


    function reply(address _receiver,
        string memory _subjectInBox,
        string memory _textInBox,
        string memory _subjectOutBox,
        string memory _textOutBox,
        bytes32 _contentHash,
        uint256 _replyIndex) public
    {
        checkContent(_subjectInBox, _textInBox, _subjectOutBox, _textOutBox);

        MessageInBox[] storage messages = addressToMessageInBoxMap[msg.sender];
        require(_replyIndex < messages.length, "Reply index out of bounds!");
        require(messages[_replyIndex].sender == _receiver, "Replied to message is not from sender!");

        messages[_replyIndex].hasReply = true;
        messages[_replyIndex].replyIndex = addressToMessageInBoxMap[_receiver].length;

        send(
            _receiver,
            _subjectInBox,
            _textInBox,
            _subjectOutBox,
            _textOutBox,
            _contentHash);
    }


    function lenInBox() public view returns (uint)
    {
        return addressToMessageInBoxMap[msg.sender].length;
    }


    function lenOutBox() public view returns (uint)
    {
        return addressToMessageOutBoxMap[msg.sender].length;
    }

    function getInBox(uint256 _index) public view returns
    (
        address sender,
        uint256 indexOutBox,
        string memory subjectInBox,
        string memory textInBox,
        uint256 inserted,
        uint256 confirmedTime,
        bool confirmed,
        bool hasReply,
        uint256 replyIndex,
        bytes32 contentHash
    )
    {
        require(_index < addressToMessageInBoxMap[msg.sender].length, "Index out of bounds");
        MessageInBox memory m = addressToMessageInBoxMap[msg.sender][_index];
        return (
            m.sender,
            m.indexOutBox,
            m.subjectInBox,
            m.textInBox,
            m.inserted,
            m.confirmedTime,
            m.confirmed,
            m.hasReply,
            m.replyIndex,
            m.contentHash
        );
    }


    function getOutBox(uint256 _index) public view returns (
        address receiver,
        uint256 indexInBox,
        string memory subjectOutBox,
        string memory textOutBox,
        bytes32 contentHash,
        uint256 inserted,
        uint256 confirmedTime,
        bool confirmed,
        bool hasReply,
        uint256 replyIndex
    )
    {
        require(_index < addressToMessageOutBoxMap[msg.sender].length, "Index out of bounds");
        MessageOutBox memory m = addressToMessageOutBoxMap[msg.sender][_index];
        MessageInBox memory m1 = addressToMessageInBoxMap[m.receiver][m.indexInBox];
        return (
            m.receiver,
            m.indexInBox,
            m.subjectOutBox,
            m.textOutBox,
            m.contentHash,
            m1.inserted,
            m1.confirmedTime,
            m1.confirmed,
            m1.hasReply,
            m1.replyIndex
        );
    }


    function confirm(uint256 _index) public
    {
        require(_index < addressToMessageInBoxMap[msg.sender].length, "Index out of bounds");
        MessageInBox storage m = addressToMessageInBoxMap[msg.sender][_index];
        m.confirmedTime = block.timestamp;
        m.confirmed = true;
    }

}

/*

address0            -   address1
...                     ...
5: reply-message    -   index:0 sender=:address0, message, hasReply:true, replyIndex:5

*/
