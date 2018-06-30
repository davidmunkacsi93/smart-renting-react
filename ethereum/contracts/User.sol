pragma solidity ^0.4.23;

contract User {
    mapping (address => bytes32) userPasswordMapping;

    mapping (address => string) message;

    function sendMessage(address _recipient, string _message) public {
        message[_recipient] = _message;
    }

    function readMessage() public view returns (string) {
        return message[msg.sender];
    }


    function getBalance(address user) public view returns (uint256) {
        return user.balance;
    }

    function createUserPasswordMapping(string password) public returns (bool) {
        bytes32 passwordHash = keccak256(password);
        userPasswordMapping[msg.sender] = passwordHash;
    }

    function authenticate(string password) public view returns (bool) {
        bytes32 storedHash = userPasswordMapping[msg.sender];
        return storedHash == keccak256(password);

    }

    event Log(string, bytes32);
}