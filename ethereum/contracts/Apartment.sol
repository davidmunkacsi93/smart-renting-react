pragma solidity ^0.4.23;

contract Apartment {
    uint32 private counter = 0;
    mapping(address => uint32[]) apartments;
    mapping(address => uint32[]) rentedApartments;
    mapping(uint32 => ApartmentDetails) apartmentDetails;
    mapping(uint32 => uint32[]) apartmentTransactionMappings;
    mapping(uint32 => ApartmentTransaction) apartmentTransactions;

    constructor() public {
    }

    struct ApartmentTransaction {
        uint32 id;
        uint32 apartmentId;
        string message;
        uint timestamp;
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

    event PaymentApproved(
        address from,
        address to
    );

    event PaymentReceived(
        address from,
        address to,
        string username,
        uint32 value
    );

    event IssueCreated(
        address from,
        address to,
        string username
    );

    event ContractTerminated(
        address from,
        address to,
        string message
    );

    function getId() private returns(uint32) {
        return counter++;
    }

    function createApartment(
        uint32 _postCode, string _city, string _street,
        uint32 _houseNumber, uint32 _floor, string _description, uint32 _rent,
        uint32 _deposit, string _transactionMessage) public {
        uint32 apartmentId = getId();
        uint32 transactionId = getId();
        ApartmentDetails memory apartment = ApartmentDetails(
            apartmentId, msg.sender, address(0),
            _postCode, _city, _street, _houseNumber, _floor, _description, _rent, _deposit, false);
        ApartmentTransaction memory transaction = ApartmentTransaction(transactionId, apartmentId, _transactionMessage, now);

        apartments[msg.sender].push(apartmentId);
        apartmentTransactionMappings[apartmentId].push(transactionId);
        apartmentDetails[apartmentId] = apartment;
        apartmentTransactions[transactionId] = transaction;
    }

    function updateApartment(uint32 _apartmentId, address _tenant) public {
        require(msg.sender == apartmentDetails[_apartmentId].owner);
        if (apartmentDetails[_apartmentId].isRented == false) {
            apartmentDetails[_apartmentId].tenant = _tenant;
            apartmentDetails[_apartmentId].isRented = true;
            rentedApartments[_tenant].push(_apartmentId);
        }
        createTransaction(_apartmentId, "The owner approved the rent.");
        emit PaymentApproved(msg.sender, _tenant);
    }

    function createTransaction(uint32 _apartmentId, string _transactionMessage) public {
        uint32 transactionId = getId();
        ApartmentTransaction memory transaction = ApartmentTransaction(transactionId, _apartmentId, _transactionMessage, now);
        apartmentTransactionMappings[_apartmentId].push(transactionId);
        apartmentTransactions[transactionId] = transaction;
    }

    function createIssue(uint32 _apartmentId, address _to, string _transactionMessage, string _username) public {
        uint32 transactionId = getId();
        ApartmentTransaction memory transaction = ApartmentTransaction(transactionId, _apartmentId, _transactionMessage, now);
        apartmentTransactionMappings[_apartmentId].push(transactionId);
        apartmentTransactions[transactionId] = transaction;
        emit IssueCreated(msg.sender, _to, _username);
    }


    function getRentedApartments() public view returns(uint32[]) {
        return rentedApartments[msg.sender];
    }

    function getApartments() public view returns(uint32[]) {
        return apartments[msg.sender];
    }
    
    function getTransactionIds(uint32 apartmentId) public view returns(uint32[]) {
        return apartmentTransactionMappings[apartmentId];
    }

    function getTransactionById(uint32 transactionId) public view returns(uint32 _id, uint32 _apartmentId, string _message, uint _timestamp) {
        ApartmentTransaction storage t = apartmentTransactions[transactionId];
        return (t.id, t.apartmentId, t.message, t.timestamp);
    }

    function getApartmentById(uint32 apartmentId) public view returns(uint32 _id, address _owner, address _tenant,
        uint32 _postCode, string _city, string _street,
        uint32 _houseNumber, uint32 _floor, string _description, uint32 _rent, uint32 _deposit, bool _isRented) {
        ApartmentDetails storage a = apartmentDetails[apartmentId];
        return (a.id, a.owner, a.tenant, a.postCode, a.city, a.street, a.houseNumber, a.floor, a.description, a.rent, a.deposit, a.isRented);
    }

    function firePayment(address _to, string _username, uint32 _value) public {
        emit PaymentReceived(msg.sender, _to, _username, _value);
    }

    function terminateContract(uint32 _apartmentId, address _owner, string _message) public {
        require(msg.sender == apartmentDetails[_apartmentId].tenant);
        apartmentDetails[_apartmentId].tenant = address(0);
        apartmentDetails[_apartmentId].isRented = false;
        uint32[] memory _apartments = rentedApartments[msg.sender];
        uint _apartmentIndex;
        for (uint i = 0; i < _apartments.length; i++) {
            if (_apartments[i] == _apartmentId) {
                _apartmentIndex = i;
            }
        }
        rentedApartments[msg.sender] = remove(_apartments, _apartmentIndex);
        createTransaction(_apartmentId, _message);
        emit ContractTerminated(msg.sender, _owner, _message);
    }

    function remove(uint32[] array, uint index) internal pure returns(uint32[] value) {
        if (index >= array.length) return;

        uint32[] memory arrayNew = new uint32[](array.length-1);
        for (uint i = 0; i<arrayNew.length; i++){
            if(i != index && i<index){
                arrayNew[i] = array[i];
            } else {
                arrayNew[i] = array[i+1];
            }
        }
        delete array;
        return arrayNew;
    }
}