pragma solidity ^0.4.23;

contract User {
    mapping (address => bytes32) userPasswordMapping;

    function getBalance(address user) public view returns (uint256) {
        return user.balance;
    }

    function createUserPasswordMapping(string password) public returns (bool) {
        userPasswordMapping[msg.sender] = keccak256(password);
    }

    function authenticate(string password) public view returns (bool) {
        return userPasswordMapping[msg.sender] == keccak256(password);
    }
}