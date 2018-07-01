pragma solidity ^0.4.23;

contract Apartment {
    // Note: the current ABI version does not support the receiving and sending of objects (structs),
    // so for the proof of concept part we just store transaction string.
    mapping(string => bytes32) apartmentTransactions;
    mapping(string => uint) requiredDeposits;
    mapping(string => uint) requiredRents;

    constructor() public {
    }

    function createApartmentTransaction(string _message, string _hashedTimestamp) public {
        apartmentTransactions[_hashedTimestamp] = keccak256(_message);
    }

    function verifyTransaction(string _transactionId, string _message) public view returns(bool) {
        return apartmentTransactions[_transactionId] == keccak256(_message);
    }

    function createRent(string _id, uint _rent) public {
        requiredRents[_id] = _rent;
    }

    function getRent(string _id) public view returns(uint) {
        return requiredRents[_id];
    }

    function createDeposit(string _id, uint _deposit) public {
        requiredDeposits[_id] = _deposit;
    }

    function payRent(address _to) public payable {
        // require(msg.value == requiredRents[_id]);
        _to.transfer(msg.value);
    }

    function payDeposit(address _to) public payable {
        // require(msg.value == requiredDeposits[_id]);
        _to.transfer(msg.value);
    }
}