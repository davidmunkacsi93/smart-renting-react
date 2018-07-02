pragma solidity ^0.4.23;

contract User {
    mapping (address => bool) accountAvailable;
    mapping (address => bytes32) accountPassword;
    mapping (address => string) accountUsername;

    function initializeAccounts(address[] addresses) public {
        for (uint index = 0; index < addresses.length; index++) {
            accountAvailable[addresses[index]] = true;
        }
    }

    function isAccountAvailable() public view returns(bool) {
        return accountAvailable[msg.sender];
    }

    function createUser(string _username, string _password) public {
        accountAvailable[msg.sender] = false;
        accountUsername[msg.sender] = _username;
        accountPassword[msg.sender] = keccak256(_password);
    }

    function authenticate(string _password) public view returns (string) {
        require(accountPassword[msg.sender] == keccak256(_password)); 
        return accountUsername[msg.sender];   
    }
}