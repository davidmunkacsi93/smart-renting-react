pragma solidity ^0.4.23;

contract User {
    mapping (address => bytes32) userPasswords;

    function createUserPassword(string _password) public {
        userPasswords[msg.sender] = keccak256(_password);
    }

    function authenticate(string _password) public view returns (bool) {
        return userPasswords[msg.sender] == keccak256(_password);
    }
}