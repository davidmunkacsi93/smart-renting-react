pragma solidity ^0.4.23;

contract User {
    mapping (address => bytes32) userPasswords;

    function createUserPassword(bytes _password) public returns (bool) {
        userPasswords[msg.sender] = keccak256(_password);
    }

    function authenticate(bytes32 _password) public view returns (bool) {
        return userPasswords[msg.sender] == keccak256(_password);
    }
}