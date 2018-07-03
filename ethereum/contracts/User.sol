pragma solidity ^0.4.23;

contract User {
    mapping (address => bool) accountTaken;
    mapping (address => bytes32) accountPassword;
    mapping (address => string) accountUsername;

    event MessageSent(
        address from,
        address to,
        string username,
        string message
    );

    function createUser(string _username, string _password) public {
        accountTaken[msg.sender] = true;
        accountUsername[msg.sender] = _username;
        accountPassword[msg.sender] = keccak256(_password);
    }

    function isAccountTaken() public view returns(bool) {
        return accountTaken[msg.sender];
    }

    function getUsername() public view returns(string) {
        return accountUsername[msg.sender];
    }

    function authenticate(string _password) public view returns (bool) {
        return accountPassword[msg.sender] == keccak256(_password);
    }

    function sendMessage(address _to, string _username, string _message) public {
        emit MessageSent(msg.sender, _to, _username, _message);
    }
}