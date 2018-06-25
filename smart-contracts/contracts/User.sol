pragma solidity ^0.4.23;

contract User {
    function getBalance(address user) public view returns (uint256) {
        return user.balance;
    }

    function authenticate() public view returns (bool) {
        return true;
    }
}