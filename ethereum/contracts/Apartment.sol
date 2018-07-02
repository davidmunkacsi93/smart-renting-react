pragma solidity ^0.4.23;

contract Apartment {
    uint32 private counter = 0;
    mapping(address => uint32[]) apartments;
    mapping(uint32 => ApartmentDetails) apartmentDetails;
    mapping(uint32 => uint32[]) apartmentTransactionMappings;
    mapping(uint32 => ApartmentTransaction) apartmentTransactions;

    constructor() public {
    }

    struct ApartmentTransaction {
        uint32 id;
        uint32 apartmentId;
        string message;
    }

    struct ApartmentDetails {
        uint32 id;
        address owner;
        address tenant;
        uint32 postCode;
        string city;
        string street;
        uint32 houseNumber;
        uint32 floor;
        string description;
        uint32 rent;
        uint32 deposit;
        bool isRented;
    }

    function getId() public returns(uint32) {
        return counter++;
    }

    function createApartment(uint32 _postCode, string _city, string _street,
            uint32 _houseNumber, uint32 _floor, string _description, uint32 _rent, uint32 _deposit, string _transactionMessage) public {
        uint32 apartmentId = getId();
        uint32 transactionId = getId();
        ApartmentDetails memory apartment = ApartmentDetails(apartmentId, msg.sender, address(0),
            _postCode, _city, _street, _houseNumber, _floor, _description, _rent, _deposit, false);
        ApartmentTransaction memory transaction = ApartmentTransaction(transactionId, apartmentId, _transactionMessage);

        apartments[msg.sender].push(apartmentId);
        apartmentTransactionMappings[apartmentId].push(transactionId);
        apartmentDetails[apartmentId] = apartment;
        apartmentTransactions[transactionId] = transaction;
    }

    function getApartments() public view returns(uint32[]) {
        return apartments[msg.sender];
    }
}