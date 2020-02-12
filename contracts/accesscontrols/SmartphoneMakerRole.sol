pragma solidity ^0.4.24;
import "./Roles.sol";

contract SmartphoneMakerRole {

    using Roles for Roles.Role;

    Roles.Role private smartphoneMakers;

    event SmartphoneMakerAdded(address indexed account);
    event SmartphoneMakerRemoved(address indexed account);

    constructor() public {
        addSmartphoneMaker(msg.sender);
    }

    modifier onlySmartphoneMaker() {
        require(isSmartphoneMaker(msg.sender));
        _;
    } 

    function isSmartphoneMaker(address a) public view returns (bool) {
        return smartphoneMakers.has(a);
    }

    function addSmartphoneMaker(address smartphoneMaker) public {
        smartphoneMakers.add(smartphoneMaker);
        emit SmartphoneMakerAdded(smartphoneMaker);
    }

    function removeSmartphoneMaker(address smartphoneMaker) public {
        smartphoneMakers.remove(smartphoneMaker);
        emit SmartphoneMakerRemoved(smartphoneMaker);
    }

}