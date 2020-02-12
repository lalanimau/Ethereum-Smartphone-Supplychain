pragma solidity ^0.4.24;
import "./Roles.sol";

contract ConsumerRole {

    using Roles for Roles.Role;

    Roles.Role private consumers;

    event ConsumerAdded(address indexed account);
    event ConsumerRemoved(address indexed account);

    constructor() public {
        addConsumer(msg.sender);
    }

    modifier onlyConsumer() {
        require(isConsumer(msg.sender));
        _;
    } 

    function isConsumer(address a) public view returns (bool) {
        return consumers.has(a);
    }

    function addConsumer(address consumer) public {
        consumers.add(consumer);
        emit ConsumerAdded(consumer);
    }

    function removeConsumer(address consumer) public {
        consumers.remove(consumer);
        emit ConsumerRemoved(consumer);
    }

}