pragma solidity ^0.4.24;
import "./Roles.sol";

contract RetailerRole {

    using Roles for Roles.Role;

    Roles.Role private retailers;

    event RetailerAdded(address indexed account);
    event RetailerRemoved(address indexed account);

    constructor() public {
        addRetailer(msg.sender);
    }

    modifier onlyRetailer() {
        require(isRetailer(msg.sender));
        _;
    } 

    function isRetailer(address a) public view returns (bool) {
        return retailers.has(a);
    }

    function addRetailer(address retailer) public {
        retailers.add(retailer);
        emit RetailerAdded(retailer);
    }

    function removeRetailer(address retailer) public {
        retailers.remove(retailer);
        emit RetailerRemoved(retailer);
    }

}