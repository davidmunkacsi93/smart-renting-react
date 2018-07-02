pragma solidity ^0.4.23;

contract User {
    mapping (address => bool) accountAvailable;
    mapping (address => bytes32) accountPassword;
    mapping (address => string) accountUsername;

    function createUser(string _username, string _password) public {
        accountAvailable[msg.sender] = false;
        accountUsername[msg.sender] = _username;
        accountPassword[msg.sender] = keccak256(_password);
    }

    function authenticate(string _password) public view returns (bool) {
        return accountPassword[msg.sender] == keccak256(_password);
    }
}