//-U+24B7-Ⓑ-
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


    ////////////////////////////////////////////////
    //                  VARS                      //
    ////////////////////////////////////////////////
    address[] players;
    //get list of addresses that bet on the winning number, uint16 is used for first, second, third, and all digits
    mapping(uint16 => mapping(BetType => address[])) mapOfBets;
    mapping(uint16 => address) mappingAddressToBetNum;
    mapping(address => bool) hasPlayerBetAlready;
    //BELOW IS FOR USE WHEN A PLAYER WINS, BUT THERE IS NO ETH AVAILABLE
    mapping(address => uint256) amountOwedToPlayersForReimbursement;


    bool public bBettingIsOpen;
    bool public calledByContractFunction;
    enum BetType {FIRSTDIGIT, SECONDDIGIT, THIRDDIGIT, ALLTHREE}

    //BET AMOUNT LOCKED TO .005 ETH = 5 Finney
    //TODO make constant?
    uint256 public defaultBetAmountInt = 5000000000000000 wei;
    
    //TODO use safemath
    uint256 singleDigitWinnings = (defaultBetAmountInt).mul(5);
    uint256 allDigitWinnings = (defaultBetAmountInt).mul(50);
    uint16[] listOfNumbersBetOn;
    

    /////////////////////////////////////////////////
    //                   EVENTS                    //
     ////////////////////////////////////////////////
    event Received(address, uint);
    event BetAccepted(address bettor,uint16 numberBetOn);
    event BettingIsOpen(bool bettingIsOpenStatus);
    event BettingIsClosed(bool bettingIsClosedStatus);
    event WinningNumbers(uint16 firstWinningNum, uint16 secondWinningNum, uint16 thirdWinningNum);
    event winners(address[] winners, BetType _betType);
    event GotPaid(address _winner);
    event BetCleared(address[] bettors, BetType _betType);


    ////////////////////////////////////////////////
    //                  MODIFIERS                 //
    ////////////////////////////////////////////////
    modifier winningDigitChecker(uint16 _number)
    {
        require(_number >= 0 && _number <= 9,
        "Winning digit must be 0-9"
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
    modifier bettingIsOpen()
    {
        require(
            bBettingIsOpen == true,
            "Betting is closed"
        );
        _;
    }
    modifier bettingIsClosed()
    {
        require(
            bBettingIsOpen == false,
            "Betting is open"
        );
        _;
    }
    
    modifier onlyCalledByContract()
    {
        require(
            calledByContractFunction == true,
            "BLOCKING EOA CALL"
        );
        _;
    }

    //fallback function
    constructor()
        payable 
    {
        bBettingIsOpen = true;
        emit BettingIsOpen(bBettingIsOpen);
        //add require for value of ETH sent to contract on deploy
    }
    
    fallback() external payable { 
        //console.log("FALLBACK");
    }
    

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
    
    function sendETHtoContract()
        external
        payable
    {
        payable(address(this)).transfer(msg.value);
    }


    function withdrawBalanceFromContract(uint256 _amount)
        public
        onlyOwner
    {
        payable(ownerAddress).transfer(_amount);
    }

    function getSINGLEAddressesByBet(uint16 _numBetOn)
        public
        view
        returns (address[] memory)
    {
        return (mapOfBets[_numBetOn][BetType.FIRSTDIGIT]);
    }

    ////////////////////////////////////////////////
    //             BETTING FUNCTIONS              //
    ////////////////////////////////////////////////

    //@dev number length is enforced at UI level. This function is mapped to the submit button for the valid field
    function betOnFirstDigit(address _player, uint16 _numberBetOn)
        external
        payable
    {
        makeBet(_player, _numberBetOn, BetType.FIRSTDIGIT);
    }
    //@dev number length is enforced at UI level
    function betOnSecondDigit(address _player, uint16 _numberBetOn)
        external
        payable
    {
        makeBet(_player, _numberBetOn, BetType.SECONDDIGIT);
    }
    //@dev number length is enforced at UI level
    function betOnThirdDigit(address _player, uint16 _numberBetOn)
        external
        payable
    {

        makeBet(_player, _numberBetOn, BetType.THIRDDIGIT);
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
        bettingIsOpen
    {
        
       players.push(_playerAddress);
       
       //replaced with list for now
        mapOfBets[numberBetOn][_betType].push(_playerAddress);
        hasPlayerBetAlready[_playerAddress] = true;
        listOfNumbersBetOn.push(numberBetOn);
        payable(address(this)).transfer(msg.value);

        emit BetAccepted(_playerAddress,numberBetOn);
    }



    ////////////////////////////////////////////////
    //    CLOSE BETTING + SETTLEMENT FUNCTIONS    //
    ////////////////////////////////////////////////


    /**
    * @dev closeBetting() is a pre-req for setWinningNum + its child functions, and clearbets
    */
    function closeBetting()
        public
        onlyAdmin
    {
        bBettingIsOpen = false;
        emit BettingIsOpen(bBettingIsOpen);
        emit BettingIsClosed(bBettingIsOpen);
    }



    //TODO: change from memory to calldata so public can be external and lower the gas

    /**
    * parent function called by admin address to set the winning number, clear everything, and open betting again for the next day
    * emits WinningNumbers to announce the 3 winning numbers
    * @dev uses winningDigitChecker modifer to check for single digit
    * @param _firstWinningNum -- single digit winning number for BetType 0
    * @param _secondWinningNum -- single digit winning number for BetType 1
    * @param _thirdWinningNum -- single digit winning number for BetType 2
    */
    function setWinningNumber(uint16 _firstWinningNum,
                              uint16 _secondWinningNum,
                              uint16 _thirdWinningNum)
        external
        payable
        onlyAdmin
        bettingIsClosed
        winningDigitChecker(_firstWinningNum)
        winningDigitChecker(_secondWinningNum)
        winningDigitChecker(_thirdWinningNum)
    {

        emit WinningNumbers(
            _firstWinningNum,
            _secondWinningNum,
            _thirdWinningNum
        );

        //bool used so admin cannot arbitrarily assign winners - preventing bad actor risk
        calledByContractFunction = true;
        
        processWinners(
            _firstWinningNum,
            _secondWinningNum,
            _thirdWinningNum
        );

       
        //clear data
        clearBets(BetType.FIRSTDIGIT);
        clearBets(BetType.SECONDDIGIT);
        clearBets(BetType.THIRDDIGIT);

        //take snapshot -- for future development


        //reset bad actor check
        calledByContractFunction = false;
        
        //open back up for betting
        bBettingIsOpen = true;
        emit BettingIsOpen(bBettingIsOpen);
    }

    /** 
    * emits winners calls payWinners
    * @dev only can be called during setWinningNumber using onlyCalledByContract modifier to prevent bad actor
    */
    function processWinners(
        uint16 _firstWinningNum,
        uint16 _secondWinningNum,
        uint16 _thirdWinningNum
    )
        public
        onlyAdmin
        payable
        bettingIsClosed
        onlyCalledByContract
        winningDigitChecker(_firstWinningNum)
        winningDigitChecker(_secondWinningNum)
        winningDigitChecker(_thirdWinningNum)
    {
        
        emit winners(
            mapOfBets[_firstWinningNum][BetType.FIRSTDIGIT],
            BetType.FIRSTDIGIT
        );
        emit winners(
            mapOfBets[_secondWinningNum][BetType.SECONDDIGIT],
            BetType.SECONDDIGIT
        );
        emit winners(
            mapOfBets[_thirdWinningNum][BetType.THIRDDIGIT],
            BetType.THIRDDIGIT
        );


        payWinners(
            mapOfBets[_firstWinningNum][BetType.FIRSTDIGIT],
            singleDigitWinnings
        );
        
        payWinners(
            mapOfBets[_secondWinningNum][BetType.SECONDDIGIT],
            singleDigitWinnings
        );
        
        payWinners(
            mapOfBets[_thirdWinningNum][BetType.THIRDDIGIT],
            singleDigitWinnings
        );

    }
    
    /**
    *  called by setWinningNumber via processWinners to pay out each winning address
    * @dev only can be called during setWinningNumber using onlyCalledByContract modifier to prevent bad actor
    */
    function payWinners(address[] memory _winners, uint256 _winningAmount)
        public
        onlyAdmin
        payable
        onlyCalledByContract
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

    /**
    *  clears data from the day to start new betting day
    * emits betCleared for each address in loop
    * @dev  now requires betting to be closed first, please call closeBetting() from admin address first
    */
    function clearBets(BetType _betType)
        public
        bettingIsClosed
        onlyAdmin
    {

        for(uint16 i = 0; i < listOfNumbersBetOn.length; i++)
        {
            emit BetCleared(
                mapOfBets[listOfNumbersBetOn[i]][_betType],
                _betType
            );
            delete mapOfBets[listOfNumbersBetOn[i]][_betType];
        }
      

        for(uint16 j = 0; j < players.length; j++) {
            hasPlayerBetAlready[players[j]] = false;
        }
    }
    
}
