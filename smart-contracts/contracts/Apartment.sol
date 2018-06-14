pragma experimental ABIEncoderV2;

contract Apartment {
    uint counter;

    mapping(address => UserInfo) public userInfo;
    mapping(address => ApartmentInfo[]) private ownedApartments;
    mapping(address => ApartmentInfo[]) private rentedApartments;

    struct UserInfo {
        string firstName;
        string lastName;
    }

    struct ApartmentInfo {
        uint id;

        address owner;
        address tenant;

        string city;
        // string country;
        // string houseNumber;
        // string street;
        // string zip;

        // bool isRented;

        uint256 rent;
        uint256 deposit;
    }

    constructor() public {
        // TODO: Remove mock data.
        ownedApartments[msg.sender].push(ApartmentInfo
        ({
            id: getId(),
            owner: msg.sender,
            tenant: address(0),
            city: "Berlin",
            rent: 800,
            deposit: 1600
        }));
        ownedApartments[msg.sender].push(ApartmentInfo
        ({
            id: getId(),
            owner: msg.sender,
            tenant: address(0),
            city: "München",
            rent: 1200,
            deposit: 3600
        }));
        ownedApartments[msg.sender].push(ApartmentInfo
        ({
            id: getId(),
            owner: msg.sender,
            tenant: address(0),
            city: "Düsseldorf",
            rent: 700,
            deposit: 1000
        }));
    }

    function getId() private returns (uint) {
        return ++counter;
    }

    function getApartmentInfo() public view returns (ApartmentInfo[]) {
        // TODO: Mock, use Id later.
        return ownedApartments[msg.sender];
    }

    function getNumberOfApartments() public view returns (uint256) {
        return ownedApartments[msg.sender].length;
    }

    function payRent() public payable {
        // TODO: Mock, use Id later.
        ApartmentInfo storage apartment = rentedApartments[msg.sender][0];
        require(apartment.rent == msg.value);
        apartment.owner.transfer(msg.value);
    }

    function payDeposit() public payable {
        // TODO: Mock, use Id later.
        ApartmentInfo storage apartment = rentedApartments[msg.sender][0];
        require(apartment.deposit == msg.value);
        apartment.owner.transfer(msg.value);
    }
}