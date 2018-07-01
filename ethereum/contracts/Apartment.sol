pragma solidity ^0.4.23;

contract Apartment {
    // Note: the current ABI version does not support the receiving and sending of objects (structs),
    // so for the proof of concept part we just store transaction string.
    mapping(bytes32 => string) apartmentTransactions;
    mapping(string => uint) requiredDeposits;
    mapping(string => uint) requiredRents;

    constructor() public {
    }

    function createApartmentTransaction(string _transactionMessage) public returns(bytes32) {
        bytes32 hashedTimestamp = keccak256(abi.encodePacked(block.timestamp));
        apartmentTransactions[hashedTimestamp] = _transactionMessage;
        return hashedTimestamp;
    }

    function createRent(string _id, uint _rent) public {
        requiredRents[_id] = _rent;
    }

    function createdDeposit(string _id, uint _deposit) public {
        requiredDeposits[_id] = _deposit;
    }

    function getTransaction(bytes32 transactionId) public view returns(string) {
        return apartmentTransactions[transactionId];
    }

    function payRent(address _to, string _id) public payable {
        require(msg.value == requiredRents[_id]);
        _to.transfer(msg.value);
    }

    function payDeposit(address _to, string _id) public payable {
        require(msg.value == requiredDeposits[_id]);
        _to.transfer(msg.value);
    }
}