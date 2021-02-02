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
//one day we will track and make accessible all previous bet data
//contract BolitaHistory {}

//contract BolitaHelper {}

//will inherit BolitaHelper for snapshot before deleting, getWinners, payWinners, etc
//to make Bolita more simple: just makes bets and sets winning number

contract Bolita is AccessController {
    using SafeMath for uint256;
    using SafeMath for uint16;
    // using SafeMath for uint8;

    uint16 latestWinningNumber;
    uint16 latestWinningFirstDigit;
    uint16 latestWinningSecondDigit;
    uint16 latestWinningThirdDigit;
    
    enum BetType {FIRSTDIGIT, SECONDDIGIT, THIRDDIGIT, ALLTHREE}


    //BET AMOUNT LOCKED TO .005 ETH = 5 Finney
    uint256 defaultBetAmountInt = 5000000000000000 wei;
    
    //TODO use safemath
    uint256 singleDigitWinnings = 5 * (defaultBetAmountInt);
    uint256 allDigitWinnings = 50 * (defaultBetAmountInt);
    uint16[] listOfNumbersBetOn;
    
    
    event WinningNumber(uint16 winningNum);
    event FirstDigitWinningNumber(uint16 winningNumFirstDigit);
    event SecondDigitWinningNumber(uint16 winningNumSecondDigit);
    event ThirdDigitWinningNumber(uint16 winningNumThirdDigit);
    
    event winners(address[] winners, BetType _betType);
    
    event GotPaid(address _winner);
    
    event BetCleared(address[] bettors);
    
    event TestEvent(address[] winners);
    
    //get list of addresses that bet on the winning number, uint16 is used for first, second, third, and all digits
    mapping(uint16 => mapping(BetType => address[])) mapOfBets;

    mapping(address => bool) hasPlayerBetAlready;
    
    //FOR USE WHEN A PLAYER WINS, BUT THERE IS NO ETH AVAILABLE
    mapping(address => uint256) amountOwedToPlayersForReimbursement;

    modifier threeDigitChecker(uint16 _number)
    {
        require(
            (_number/1000) < 1 || _number == 0,
            "Must be less than 999"
        );
        
        require(
            (_number/100) > 1 || _number == 0,
            "Must be three digits"
        );
        _;
    }

    //move up to BolitaHelper
    modifier defaultBetAmount(uint256 _betAmount)
    {
        require(
            defaultBetAmountInt == _betAmount,
            "Bet Amount must be .005 ETH"
        );
        _;
    }
    
    modifier hasAddressBetAlready(address _player)
    {
        require(
            hasPlayerBetAlready[_player] != true,
            "CANNOT EXCEED 1 BET PER DAY"
        );
        _;
    }
    
    //fallback function
        constructor()  payable {

    }
    
    fallback() external payable { 
        //console.log("FALLBACK");
    }
    
    
    
    function sendETHtoContract()
        external
        payable
    {
        payable(address(this)).transfer(msg.value);
    }

    function getSINGLEAddressesByBet(uint16 _numBetOn)
        public
        returns (address[] memory)
    {
        return (mapOfBets[_numBetOn][BetType.FIRSTDIGIT]);
    }


    function clearBets(BetType _betType)
        public
        onlyAdmin
    {
        address[] memory betsList;
        
        for(uint16 i = 0; i < listOfNumbersBetOn.length; i++)
        {
            betsList = mapOfBets[i][_betType];
            
            emit BetCleared(mapOfBets[i][_betType]);
            delete mapOfBets[i][_betType];
            
            for(uint16 i = 0; i < betsList.length; i++) {
                hasPlayerBetAlready[betsList[i]] = false;
            }
            
        }
        
    }
    
    function payWinners(address[] memory _winners, uint256 _winningAmount)
        public
        onlyAdmin
        payable
    {
        
        for(uint i = 0; i<_winners.length; i++) {
            require(
                _winners[i] != address(0x0),
                "CANNOT USE TEST ACCOUNTS"
            );
            
            payable(_winners[i]).transfer(_winningAmount);
            
            emit GotPaid(_winners[i]);
        }
    }
    
    function getWinners(
        uint16 _winningNumber,
        uint16 _firstWinningDigit,
        uint16 _secondWinningDigit,
        uint16 _thirdWinningDigit
    )
        internal
        returns(
            address[] memory firstDigitWinners,
            address[] memory secondDigitWinners,
            address[] memory thirdDigitWinners,
            address[] memory allDigitWinners
        )
    {
        
        firstDigitWinners = mapOfBets[_firstWinningDigit][BetType.FIRSTDIGIT];
        secondDigitWinners = mapOfBets[_secondWinningDigit][BetType.SECONDDIGIT];
        thirdDigitWinners = mapOfBets[_thirdWinningDigit][BetType.THIRDDIGIT];
        allDigitWinners = mapOfBets[_winningNumber][BetType.ALLTHREE];
        
        emit winners(firstDigitWinners, BetType.FIRSTDIGIT);
        emit winners(secondDigitWinners, BetType.SECONDDIGIT);
        emit winners(thirdDigitWinners, BetType.THIRDDIGIT);
        emit winners(allDigitWinners, BetType.ALLTHREE);
        
       // winningPlayers.push(mapOfBets[_winningNumber]);
    }
    
    //TODO: upgrade with SafeMath
    //TODO: change from memory to calldata so public can be external and lower the gas
    function setWinningNumber(uint16 _newWinningNum)
        public
        payable
        onlyAdmin
        threeDigitChecker(_newWinningNum)
    {

        emit WinningNumber(_newWinningNum);
        
        latestWinningFirstDigit = _newWinningNum/(100);
        emit FirstDigitWinningNumber(latestWinningFirstDigit);
                
        latestWinningSecondDigit = ((_newWinningNum/10)%10);
        emit SecondDigitWinningNumber(latestWinningSecondDigit);
                
        latestWinningThirdDigit = _newWinningNum%10;
        emit ThirdDigitWinningNumber(latestWinningThirdDigit);
        
        address[] memory firstDigitWinners;
        address[] memory secondDigitWinners;
        address[] memory thirdDigitWinners;
        address[] memory allDigitWinners;
        
        (firstDigitWinners,
            secondDigitWinners,
            thirdDigitWinners,
            allDigitWinners
        ) =  
        getWinners(
            _newWinningNum,
            latestWinningFirstDigit,
            latestWinningSecondDigit,
            latestWinningThirdDigit
        );
        
        
        payWinners(
            firstDigitWinners,
            singleDigitWinnings
        );
        
        payWinners(
            secondDigitWinners,
            singleDigitWinnings
        );
        
        payWinners(
            thirdDigitWinners,
            singleDigitWinnings
        );
        
        payWinners(
            firstDigitWinners,
            allDigitWinnings
        );
        
    //TO BE REMOVED:        
        // emit TestEvent(firstDigitWinners);
        // emit TestEvent(secondDigitWinners);
        // emit TestEvent(thirdDigitWinners);
        // emit TestEvent(allDigitWinners);
        
        
        //clear data
        clearBets(BetType.FIRSTDIGIT);
        clearBets(BetType.SECONDDIGIT);
        clearBets(BetType.THIRDDIGIT);
        clearBets(BetType.ALLTHREE);

        //take snapshot
        
    }

    //@dev number length is enforced at UI level. This function is mapped to the submit button for the valid field
    function betOnFirstDigit(address _player, uint16 _numberBetOn)
        external
        payable
        
    {
        require(
            (_numberBetOn/10) < 1,
            "Must be single digit"
        );

        makeBet(_player, _numberBetOn, BetType.FIRSTDIGIT);
    }
    //@dev number length is enforced at UI level
    function betOnSecondDigit(address _player, uint16 _numberBetOn)
        external
        payable
    {
        require(
            (_numberBetOn/10) < 1,
            "Must be single digit"
        );

        makeBet(_player, _numberBetOn, BetType.SECONDDIGIT);
    }
    //@dev number length is enforced at UI level
    function betOnThirdDigit(address _player, uint16 _numberBetOn)
        external
        payable
    {
        require(
            (_numberBetOn/10) < 1,
            "Must be single digit"
        );

        makeBet(_player, _numberBetOn, BetType.THIRDDIGIT);
    }
    //@dev number length is enforced at UI level
    function betOnAllThree(address _player, uint16 _numberBetOn)
        external
        payable
    {
        require(
            (_numberBetOn/1000) < 1,
            "Must be less than 999"
        );

        makeBet(_player, _numberBetOn, BetType.ALLTHREE);   
    }

    function makeBet(
        address _playerAddress,
        uint16 numberBetOn,
        BetType _betType
    )
        public
        payable
        defaultBetAmount(uint256(msg.value))
        hasAddressBetAlready(_playerAddress)
    {
        
        mapOfBets[numberBetOn][_betType].push(_playerAddress);
        hasPlayerBetAlready[_playerAddress] = true;
        listOfNumbersBetOn.push(numberBetOn);
        payable(address(this)).transfer(msg.value);
    }
    
    
    function getContractValue()
        external
        view
        returns(uint256)
    {
        return address(this).balance;
        
    }

    function withdrawBalanceFromContract(uint256 _amount)
        public
        onlyOwner
    {
        payable(ownerAddress).transfer(_amount);
    }

}
