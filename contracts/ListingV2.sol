// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract ListingV2 is Initializable {
    struct Item {
        string title;
        uint votes;
    }

    modifier onlyAuthor(uint id) {
        require(authorOf[id] == msg.sender, "only author allowed");
        _;
    }

    modifier notAuthor(uint id) {
        require(authorOf[id] != msg.sender, "author not allowed");
        _;
    }

    modifier neverVoted(uint id) {
        Item memory item = items[id];
        require(item.votes == 0, "already voted");
        _;
    }

    modifier uniqVoted(uint id) {
        require(votedBy[id][msg.sender] == false, "already voted by user");
        _;
    }

    uint public qty;
    uint public votes;
    Item[] public items;

    mapping(uint => address) public authorOf;

    mapping(uint => mapping(address => bool)) public votedBy;

    event ItemAdded(uint id, string title, address author);
    event ItemRemoved(uint id);
    event ItemVoted(uint id);

    function initialize() public initializer {}

    function addItem(string memory title) public returns (uint) {
        uint id = qty;
        Item memory item = Item(title, 0);
        items.push(item);
        qty++;

        authorOf[id] = msg.sender;

        emit ItemAdded(id, title, msg.sender);

        return id;
    }

    function voteItem(uint id)
        public
        notAuthor(id)
        uniqVoted(id)
        returns (uint)
    {
        Item storage item = items[id];
        votedBy[id][msg.sender] = true;
        votes++;

        emit ItemVoted(id);

        return item.votes++;
    }

    function removeItem(uint id)
        public
        onlyAuthor(id)
        neverVoted(id)
        returns (uint)
    {
        items[id] = items[items.length - 1];
        items.pop();

        qty--;

        emit ItemRemoved(id);

        return qty;
    }
}
