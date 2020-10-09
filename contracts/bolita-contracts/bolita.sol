//SPDX-License-Identifier: -U+24B7-Ⓑ-
pragma solidity ^0.7.0;

import "../common-contracts/SafeMath.sol";
import "../common-contracts/AccessControl.sol";

contract bolita is AccessControl {
    using SafeMath for uint128;
    using SafeMath for uint16;
    using SafeMath for uint8;
    
    uint8 winningNum;
    uint8[3] memory winningDigits;

    //TODO add tokenIndex one day
    struct Bet {
        address player;
        uint8 betType;
        uint8 firstNumBetOn;
        uint8 secondNumBetOn;
        uint8 thirdNumBetOn;
        uint128 betAmount;
    }

    enum BetType { SINGLENUM, DOUBLENUM, TRIPLENUM }
        
    Bet[] public bolitaBets;

    mapping(address => bolitaBets[]) bolitaTickets;
    address[] winners;
    
    //TODO add treasury index + token functionality
    
    //TODO add tokenIndex one day
    event EchoFinalResults(
        address[] _players,
        uint256 indexed actualFirstNum,
        uint256 indexed actualSecondNum,
        uint256 indexed actualThirdNum,
        uint256[] _winAmounts
    );
    
    event WinningNumbersReceived(
        bytes32 sourceName,
        uint256 winningNumsAllThree,
        uint timeResultsReceived
    );
    
    //TODO add tokenIndex one day
    function createBet(
        address _player,
        uint8 _betType,
        uint8 _firstNumBetOn,
        uint8 _secondNumBetOn,
        uint8 _thirdNumBetOn,
        uint128 _betAmount
    ) 
        external
        onlyCEO 
    {
        singleBet(
            _player,
            _betType,
            _firstNumBetOn,
            _secondNumBetOn,
            _thirdNumBetOn,
            _betAmount
        );
    }
    //add tokenIndex one day
    function singleBet(
        address _player,
        uint8 _betType,
        uint8 _firstNumBetOn,
        uint8 _secondNumBetOn,
        uint8 _thirdNumBetOn,
        uint128 _betAmount
    ) 
        internal
    {
        bolitaBets.push(Bet({
            player: _player,
            betType: _betType,
            firstNumBetOn: _firstNumBetOn,
            secondNumBetOn: _secondNumBetOn,
            thirdNumBetOn: _thirdNumBetOn,
            betAmount: _betAmount
        }));
    }
    
    /*    //add tokenIndex one day
    function tripleBet() 
    */
    
    function setWinningNumber(
        uint8 firstWinningNum,
        uint8 secondWinningNum,
        uint8 thirdWinningNum
    )
    external
    onlyCEO
    {
        winningDigits.push(
            firstWinningNum,
            secondWinningNum,
            thirdWinningNum
        );
    }

    
    //TODO rework to remove branching, maybe have a mapping of some kind?
    function getPayoutForType(
        uint8 _betType
    ) public pure returns(uint256 payoutMultipler) {
        if (_betType == uint8(BetType.SINGLENUM))
        {
            payoutMultipler=8;
        }
        if (_betType == uint8(BetType.DOUBLENUM))
        {
            payoutMultipler=300;
        }
        if (_betType == uint8(BetType.TRIPLENUM))
        {
            payoutMultipler=1000;
        }
    }
}