// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract AccessController {

    address public ownerAddress;
    address public adminAddress;

    bool public paused = false;
    
    //owner is included as an admin
    mapping (address => bool) isAdmin;

    event OwnerSet(address newOwnerAddress);
    event RemovedAdmin(address prevAdminAddress);
    event AddedAdmin(address newAdminAddress);

    event Paused();
    event Unpaused();

    constructor() 
    {
        ownerAddress = msg.sender;
        isAdmin[ownerAddress] = true;
       
        emit OwnerSet(ownerAddress);
        emit AddedAdmin(ownerAddress);
    }

    modifier onlyOwner()
    {
        require(
            msg.sender == ownerAddress,
            'AccessControl: msg.sender must be owner'
        );
        _;
    }

    modifier onlyAdmin()
    {
        require(
            isAdmin[msg.sender] == true,
            'AccessControl: msg.sender must be admin'
        );
        _;
    }

    modifier whenNotPaused()
    {
        require(
            !paused,
            'AccessControl: currently paused'
        );
        _;
    }

    modifier whenPaused
    {
        require(
            paused,
            'AccessControl: currenlty not paused'
        );
        _;
    }

    function updateOwner(address _newOwnerAddress) 
        public
        onlyOwner
    {
        require(
            _newOwnerAddress != address(0x0),
            'AccessControl: invalid CEO address'
        );
        ownerAddress = _newOwnerAddress;
        emit OwnerSet(ownerAddress);
    }

    function setAdmin(address _newAdminAddress)
        public
        onlyOwner
    {
        require(
            _newAdminAddress != address(0x0),
            'AccessControl: invalid worker address'
        );
        //remove prev admin
        isAdmin[adminAddress] = false;
        emit RemovedAdmin(adminAddress);
        
        //set new admin + add to mapping
        adminAddress = _newAdminAddress;
        isAdmin[adminAddress] == true;
        emit AddedAdmin(adminAddress);
    }

    function pause()
        external
        onlyAdmin
        whenNotPaused
    {
        paused = true;
        emit Paused();
    }

    function unpause()
        external
        onlyAdmin
        whenPaused
    {
        paused = false;
        emit Unpaused();
    }
}



//probably unneeded in solidity 0.8.0, but adding for consistency's sake
library SafeMath {

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, 'SafeMath: addition overflow');
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, 'SafeMath: subtraction overflow');
        uint256 c = a - b;
        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, 'SafeMath: multiplication overflow');
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, 'SafeMath: division by zero');
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, 'SafeMath: modulo by zero');
        return a % b;
    }
}





contract Bolita is AccessController {
    using SafeMath for uint256;
    using SafeMath for uint16;
    // using SafeMath for uint8;

    uint16 latestWinningNumber;
    uint8 latestWinningFirstDigit;
    uint8 latestWinningSecondDigit;
    uint8 latestWinningThirdDigit;
    
    enum BetType {FIRSTDIGIT, SECONDDIGIT, THIRDDIGIT, ALLTHREE}

    //BET AMOUNT LOCKED TO .005
    
    
    event WinningNumber(uint16 winningNum);
    event FirstDigitWinningNumber(uint8 winningNumFirstDigit);
    event SecondDigitWinningNumber(uint8 winningNumSecondDigit);
    event ThirdDigitWinningNumber(uint8 winningNumThirdDigit);

    struct Bet {
        address player;
        uint16 numberBetOn;
        BetType betTypeOfBet;

      //  uint128 betAmount;
    }
    
    //TODO: upgrade with SafeMath
    function setWinningNumber(uint16 _newWinningNum)
        public
        onlyAdmin
    {
        require(
            _newWinningNum <= 999,
            "BOLITA: invalid winning number"
        );
        
        emit WinningNumber(_newWinningNum);
        
        latestWinningFirstDigit = uint8(_newWinningNum/(100));
        emit FirstDigitWinningNumber(latestWinningFirstDigit);
                
        latestWinningSecondDigit = uint8((_newWinningNum/(10))%10);
        emit SecondDigitWinningNumber(latestWinningSecondDigit);
                
        latestWinningThirdDigit = uint8(_newWinningNum%10);
        emit ThirdDigitWinningNumber(latestWinningThirdDigit);
        
    }
    
    // /**
    //  * uint8 betType; 
    //  * 0 = ALLTYPE
    //  * 1 = FIRSTDIGIT
    //  * 2 = SECONDDIGIT
    //  * 3 = THIRDDIGIT 
    //  * /


}