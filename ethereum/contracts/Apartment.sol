pragma solidity ^0.4.23;

contract Apartment {
    mapping(uint => uint) apartmentRent;
    mapping(uint => uint) apartmentDeposit;
    mapping(address => ApartmentDetail[]) ownedApartments;
    mapping(address => ApartmentDetail[]) rentedApartments;

    ApartmentDetail[] apartmentlist;

    struct ApartmentDetail {
        uint id;
        address owner;
        address tenant;
        uint deposit;
        uint rent;
    }

    constructor() public {
    }


    function payRent(uint id) public payable {
        for(uint i = 0; i < apartmentlist.length; i++) {
            if (apartmentlist[i].id == id) {
                ApartmentDetail storage apartment = apartmentlist[i];
            }
        }
        require(apartment.rent == msg.value);
        apartment.owner.transfer(msg.value);
    }

    function payDeposit(uint id) public payable {
        for(uint i = 0; i < apartmentlist.length; i++) {
            if (apartmentlist[i].id == id) {
                ApartmentDetail storage apartment = apartmentlist[i];
            }
        }
        require(apartment.deposit == msg.value);
        apartment.owner.transfer(msg.value);
    }
}