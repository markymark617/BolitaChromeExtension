// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Migrations {
    address public owner;
    uint public lastCompletedMigration;

    constructor() {
        owner = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == owner,
            "ONLY OWNER CAN RUN"
        );
        
         _;
    }

    function setCompleted(uint completed) external restricted {
        lastCompletedMigration = completed;
    }

    function upgrade(address new_address) external restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(lastCompletedMigration);
    }
}
