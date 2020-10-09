//SPDX-License-Identifier: -U+24B7-Ⓑ-
pragma solidity ^0.7.0;

import "../common-contracts/SafeMath.sol";
import "../common-contracts/AccessControl.sol";

contract bolita is AccessControl {
    using SafeMath for uint128;
    using SafeMath for uint16;
    
    enum BetType { SINGLENUM, DOUBLENUM, TRIPLENUM }
    
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
    struct Bet {
        address player;
        uint8 betType;
        uint16 numberBetOn;
        uint128 betAmount;
    }
    
    Bet[] public bolitaBets;
    
    //TODO add tokenIndex one day
    function createBet(
        address _player,
        uint8 _betType,
        uint16 _numberBetOn,
        uint128 _betAmount
    ) 
        external
        onlyCEO 
    {
        bet(
            _player,
            _betType,
            _numberBetOn,
            _betAmount
        );
    }
    //add tokenIndex one day
    function bet(
        address _player,
        uint8 _betType,
        uint16 _numberBetOn,
        uint128 _betAmount
    ) 
        internal
    {
        bolitaBets.push(Bet({
            player: _player,
            betType: _betType,
            numberBetOn: _numberBetOn,
            betAmount: _betAmount
        }));
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