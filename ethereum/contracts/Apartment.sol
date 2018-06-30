pragma solidity ^0.4.23;

contract Apartment {
    mapping(uint => uint) apartmentRent;
    mapping(uint => uint) apartmentDeposit;
    mapping(address => ApartmentDetail[]) ownedApartments;
    mapping(address => ApartmentDetail[]) rentedApartments;

    ApartmentDetail[] apartmentlist;

    struct ApartmentDetail {
        string id;
        address owner;
        address tenant;
        uint deposit;
        uint rent;
    }

    constructor() public {
    }


    function createApartmentDetail(string _id, uint _deposit, uint _rent) public payable {
        ownedApartments[msg.sender].push(ApartmentDetail({
            id: _id,
            owner: msg.sender,
            tenant: address(0),
            deposit: _deposit,
            rent: _rent
        }));
    }

    function payRent(address to) public payable {
        to.transfer(msg.value);
    }

    function payDeposit(address to) public payable {
        to.transfer(msg.value);
    }
}