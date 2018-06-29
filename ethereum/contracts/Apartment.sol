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

    function payRent(string _id) public payable {
        for(uint i = 0; i < apartmentlist.length; i++) {
            if (keccak256(apartmentlist[i].id) == keccak256(_id)) {
                ApartmentDetail storage apartment = apartmentlist[i];
            }
        }
        require(apartment.rent == msg.value);
        apartment.owner.transfer(msg.value);
    }

    function payDeposit(string _id) public payable {
        for(uint i = 0; i < apartmentlist.length; i++) {
            if (keccak256(apartmentlist[i].id) == keccak256(_id)) {
                ApartmentDetail storage apartment = apartmentlist[i];
            }
        }
        require(apartment.deposit == msg.value);
        apartment.owner.transfer(msg.value);
    }
}