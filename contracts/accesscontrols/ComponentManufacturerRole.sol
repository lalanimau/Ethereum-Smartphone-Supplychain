pragma solidity ^0.4.24;
import "./Roles.sol";

contract ComponentManufacturerRole {

    using Roles for Roles.Role;

    Roles.Role private manufacturers;

    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);

    constructor() public {
        addManufacturer(msg.sender);
    }

    modifier onlyManufacturer() {
        require(isManufacturer(msg.sender));
        _;
    } 

    function isManufacturer(address a) public view returns (bool) {
        return manufacturers.has(a);
    }

    function addManufacturer(address manufacturer) public {
        manufacturers.add(manufacturer);
        emit ManufacturerAdded(manufacturer);
    }

    function removeManufacturer(address manufacturer) public {
        manufacturers.remove(manufacturer);
        emit ManufacturerRemoved(manufacturer);
    }

}