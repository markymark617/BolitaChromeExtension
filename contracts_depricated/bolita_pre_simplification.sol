//-U+24B7-Ⓑ-
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../contracts/common-contracts/SafeMath.sol";
import "../contracts/common-contracts/AccessControl.sol";
//one day we will track and make accessible all previous bet data
//contract BolitaHistory {}

//contract BolitaHelper {}

//will inherit BolitaHelper for snapshot before deleting, getWinners, payWinners, etc
//to make Bolita more simple: just makes bets and sets winning number

contract Bolita is AccessController {
    using SafeMath for uint256;
    using SafeMath for uint16;
    // using SafeMath for uint8;

    bool bBettingIsOpen;

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
    
    event Received(address, uint);

    event BetAccepted(address bettor,uint16 numberBetOn);

    event BettingIsOpen(bool bettingIsOpenStatus);

    //event WinningNumber(uint16 winningNum);
    event FirstDigitWinningNumber(uint16 winningNumFirstDigit);
    event SecondDigitWinningNumber(uint16 winningNumSecondDigit);
    event ThirdDigitWinningNumber(uint16 winningNumThirdDigit);
    
    event winners(address[] winners, BetType _betType);
    
    event GotPaid(address _winner);
    
    event BetCleared(address[] bettors, BetType _betType);
    
    event TestEvent(address[] winners);
    
    //get list of addresses that bet on the winning number, uint16 is used for first, second, third, and all digits
    mapping(uint16 => mapping(BetType => address[])) mapOfBets;
    
    mapping(uint16 => address) mappingAddressToBetNum;

    mapping(address => bool) hasPlayerBetAlready;
    
    address[] players;
    
    //FOR USE WHEN A PLAYER WINS, BUT THERE IS NO ETH AVAILABLE
    mapping(address => uint256) amountOwedToPlayersForReimbursement;

    modifier winningDigitChecker(uint16 _number)
    {
        require(_number >= 0 && _number <= 9,
        "Winning digit must be 0-9"
        );
        _;
    }

    modifier threeDigitChecker(uint16 _number)
    {
        require(
            (_number/1000) <= 1 || _number == 0,
            "Must be less than 999"
        );
        
        require(
            (_number/100) >= 1 || _number == 0,
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

        
    modifier bettingIsOpen()
    {
        require(
            bBettingIsOpen == true,
            "Betting is closed"
        );
        _;
    }
    
    //fallback function
    constructor()
        payable 
    {
        bBettingIsOpen = true;
        emit BettingIsOpen(true);
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

    function getSINGLEAddressesByBet(uint16 _numBetOn)
        public
        view
        returns (address[] memory)
    {
        return (mapOfBets[_numBetOn][BetType.FIRSTDIGIT]);
    }

    function clearBets(BetType _betType)
        public
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

    function closeBetting()
        public
        onlyAdmin
    {
        bBettingIsOpen = false;
        emit BettingIsOpen(bBettingIsOpen);
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
      //  uint16 _winningNumber,
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
       // allDigitWinners = mapOfBets[_winningNumber][BetType.ALLTHREE];
        
        emit winners(firstDigitWinners, BetType.FIRSTDIGIT);
        emit winners(secondDigitWinners, BetType.SECONDDIGIT);
        emit winners(thirdDigitWinners, BetType.THIRDDIGIT);
        emit winners(allDigitWinners, BetType.ALLTHREE);
        
       // winningPlayers.push(mapOfBets[_winningNumber]);
    }
    
    //TODO: upgrade with SafeMath
    //TODO: change from memory to calldata so public can be external and lower the gas
    //function setWinningNumber(uint16 _newWinningNum)
    function setWinningNumber(uint16 _firstWinningNum,
                              uint16 _secondWinningNum,
                              uint16 _thirdWinningNum)
        public
        payable
        onlyAdmin
        //threeDigitChecker(_newWinningNum)
        winningDigitChecker(_firstWinningNum)
        winningDigitChecker(_secondWinningNum)
        winningDigitChecker(_thirdWinningNum)
    {

      //  used to support 3 digit bets, so winning numbers were calculated like below
      // most removed to prevent code hoarding, some kept to upgrade one day

        emit FirstDigitWinningNumber(_firstWinningNum);
                
        //latestWinningSecondDigit = ((_newWinningNum/10)%10);
        //latestWinningSecondDigit = _secondWinningNum;
        emit SecondDigitWinningNumber(_secondWinningNum);
                

        emit ThirdDigitWinningNumber(_thirdWinningNum);
        
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
            _firstWinningNum,
            _secondWinningNum,
            _thirdWinningNum
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
        
        //clear data
        clearBets(BetType.FIRSTDIGIT);
        clearBets(BetType.SECONDDIGIT);
        clearBets(BetType.THIRDDIGIT);
        clearBets(BetType.ALLTHREE);

        //take snapshot

        //open back up for betting
        bBettingIsOpen = true;
        emit BettingIsOpen(bBettingIsOpen);
        
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
