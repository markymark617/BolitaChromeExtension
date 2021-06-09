
/**
 * For: FIRST ROW OF BUTTONS
 * make each button clickable, turn lighter when clicked, 
 * and set the value of the corresponding input field
 */
document.querySelectorAll(".btnFirstBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        //only 1 can be active at any given time - remove all other active
        document.querySelectorAll(".btnFirstBet").forEach(item => {
         
                item.classList.remove("active");
                item.style.opacity=1;
            
        });

        item.style.opacity= 0.4;
        item.classList.add("active");

        document.getElementById("firstBetInput").value= item.value;

    });
});

/**
 * For: SECOND ROW OF BUTTONS
 * make each button clickable, turn lighter when clicked, 
 * and set the value of the corresponding input field
 */
document.querySelectorAll(".btnSecondBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        //only 1 can be active at any given time - remove all other active
        document.querySelectorAll(".btnSecondBet").forEach(item => {
         
                item.classList.remove("active");
                item.style.opacity=1;
            
        });

        item.style.opacity= 0.4;
        item.classList.add("active");

        document.getElementById("secondBetInput").value= item.value;

    });
});

/**
 * For: THIRD ROW OF BUTTONS
 * make each button clickable, turn lighter when clicked, 
 * and set the value of the corresponding input field
 */
document.querySelectorAll(".btnThirdBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        //only 1 can be active at any given time - remove all other active
        document.querySelectorAll(".btnThirdBet").forEach(item => {
         
                item.classList.remove("active");
                item.style.opacity=1;
            
        });

        item.style.opacity= 0.4;
        item.classList.add("active");

        document.getElementById("thirdBetInput").value= item.value;

    });
});

//Button IDs on second page
var latestNums = document.getElementById("finalNumbersID");
var btnLatestNums = document.getElementById("GetLatestNumbers");

var btnGetCNNNumbers = document.getElementById("btnGetCNNNumbers");
var latestCaseNum = document.getElementById("latestCaseNum");

var firstWinningNum;
var secondWinningNum;
var thirdWinningNum;


/**
 * Get # of positive cases from covidtracking.com
 */
//added for error on Liveserver 
if (window.location.href.match('results.html') != null) {
    btnGetCNNNumbers.onclick = function() {
        
        latestNums.innerHTML = "Hello CNN";
            
        //const json = '{"result":true, "count":42}';
        var url = "https://api.covidtracking.com/v1/us/current.json";

        var positiveCasesNum;

        //API call
        $.getJSON('https://api.covidtracking.com/v1/us/current.json', function(data) {
            // JSON result in `data` variable
            console.log(data);
            console.log("TADA!");
            console.log(data[0].positive);
            positiveCasesNum = data[0].positive;
            console.log("---");
            console.log(positiveCasesNum);


            //latestCaseNum.innerHTML = data[0].positive;
            latestCaseNum.innerHTML = positiveCasesNum;
            console.log("<p> tag updated!");

            //store 3rd winning number
            thirdWinningNum = ~~(positiveCasesNum % 10);
            console.log("3rd digit: " + thirdWinningNum);

            //store 2nd winning number then 1st winning number
            var counter;
            var positiveCasesStartingNum = positiveCasesNum;
            var currDigit;
            for(counter = 0; counter<3; counter++) {

                currDigit = positiveCasesStartingNum % 10;
                positiveCasesStartingNum = positiveCasesStartingNum/10;

                if(counter === 1) {
                    secondWinningNum = ~~currDigit;
                    console.log("SAVED THE SECOND WINNING NUM");
                    console.log("---");
                    console.log(secondWinningNum);
                    console.log("---");
                }

                if(counter === 2) {
                    firstWinningNum = ~~currDigit;
                    console.log("SAVED THE THIRD WINNING NUM");
                    console.log("---");
                    console.log(firstWinningNum);
                    console.log("---");
                }
            }
        });
    }
}

var sendNotificationbtn = document.getElementById("btnSendNotification");
var options = {
    title:'myNotification',
    message: 'TIMING NOTIFICATION',
    iconUrl: 'images/bolita_logo.png',
    type: 'basic'
}

//added for error on Liveserver 
window.onload = function(){ 
    chrome.notifications.create(options);
}


//clock function 
function updateLatestWinningNumbers() {
    (function loop() {
    
        var now = new Date();
        if (now.getHours() === 20 && now.getMinutes() === 08) {
            latestNums.innerHTML = "Hello World TIMING";
            console.log('TIMING RAN!');

            var notifOptions = {
                type: 'basic',
                iconUrl: 'images/bolita_logo.png',
                title: 'Time reached',
                message: "TIMING"
            };

            chrome.notifications.create('timeNotif', notifOptions);
        }

        now = new Date();                  // allow for time passing
        var delay = 60000 - (now % 60000); // exact ms to next minute interval
        setTimeout(updateLatestWinningNumbers, delay);

        }
    )();
}

//run clock function
updateLatestWinningNumbers();

//added for error on Liveserver 
if (window.location.href.match('results.html') != null) {
    function updateClock() {
        var now = new Date(), // current date
            time = now.getHours() + ':' + now.getMinutes() +"::" + now.getSeconds();

            // a cleaner way than string concatenation
            date = [now.getDate(), 
                    now.getFullYear()].join(' ');

        // set the content of the element with the ID time to the formatted string
        document.getElementById('time').innerHTML =  now;

        // call this function again in 1000ms
        setInterval(updateClock, 1000);
    }

    updateClock(); // initial call
}

    /*
        web3 changes
    */

//added since error on web3 may be from race condition\

//infura could be injected here
//localhost would be replaced with websocket

//deploy on rinkiby testnet
//next to robstein testnet
window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    web3.eth.defaultAccount = web3.eth.accounts[0];

    // address changes with each deploy on Remix, and would be a fixed addr if was deployed to testnet or mainnet
    var BolitaContract = new web3.eth.Contract([
        {
            "inputs": [],
            "stateMutability": "payable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amountNeeded",
                    "type": "uint256"
                }
            ],
            "name": "ALERTFundingNeeded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "newAdminAddress",
                    "type": "address"
                }
            ],
            "name": "AddedAdmin",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "bettor",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint16",
                    "name": "numberBetOn",
                    "type": "uint16"
                }
            ],
            "name": "BetAccepted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address[]",
                    "name": "bettors",
                    "type": "address[]"
                },
                {
                    "indexed": false,
                    "internalType": "enum Bolita.BetType",
                    "name": "_betType",
                    "type": "uint8"
                }
            ],
            "name": "BetCleared",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "bettingIsClosedStatus",
                    "type": "bool"
                }
            ],
            "name": "BettingIsClosed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "bettingIsOpenStatus",
                    "type": "bool"
                }
            ],
            "name": "BettingIsOpen",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_winner",
                    "type": "address"
                }
            ],
            "name": "GotPaid",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "newOwnerAddress",
                    "type": "address"
                }
            ],
            "name": "OwnerSet",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "Paused",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_winnerNotYetPaid",
                    "type": "address"
                }
            ],
            "name": "PaymentIsQueued",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "Received",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "prevAdminAddress",
                    "type": "address"
                }
            ],
            "name": "RemovedAdmin",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "Unpaused",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint16",
                    "name": "firstWinningNum",
                    "type": "uint16"
                },
                {
                    "indexed": false,
                    "internalType": "uint16",
                    "name": "secondWinningNum",
                    "type": "uint16"
                },
                {
                    "indexed": false,
                    "internalType": "uint16",
                    "name": "thirdWinningNum",
                    "type": "uint16"
                }
            ],
            "name": "WinningNumbers",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address[]",
                    "name": "winners",
                    "type": "address[]"
                },
                {
                    "indexed": false,
                    "internalType": "enum Bolita.BetType",
                    "name": "_betType",
                    "type": "uint8"
                }
            ],
            "name": "winners",
            "type": "event"
        },
        {
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "inputs": [],
            "name": "adminAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "bBettingIsOpen",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "bPaymentsAreBacklogged",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_player",
                    "type": "address"
                },
                {
                    "internalType": "uint16",
                    "name": "_numberBetOn",
                    "type": "uint16"
                }
            ],
            "name": "betOnFirstDigit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_player",
                    "type": "address"
                },
                {
                    "internalType": "uint16",
                    "name": "_numberBetOn",
                    "type": "uint16"
                }
            ],
            "name": "betOnSecondDigit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_player",
                    "type": "address"
                },
                {
                    "internalType": "uint16",
                    "name": "_numberBetOn",
                    "type": "uint16"
                }
            ],
            "name": "betOnThirdDigit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "calledByContractFunction",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "enum Bolita.BetType",
                    "name": "_betType",
                    "type": "uint8"
                }
            ],
            "name": "clearBets",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "closeBetting",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint16",
                    "name": "_numBetOn",
                    "type": "uint16"
                }
            ],
            "name": "getAddressesByBet",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_playerAddress",
                    "type": "address"
                },
                {
                    "internalType": "uint16",
                    "name": "numberBetOn",
                    "type": "uint16"
                },
                {
                    "internalType": "enum Bolita.BetType",
                    "name": "_betType",
                    "type": "uint8"
                }
            ],
            "name": "makeBet",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ownerAddress",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "pause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "paused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address[]",
                    "name": "_winners",
                    "type": "address[]"
                },
                {
                    "internalType": "uint256",
                    "name": "_winningAmount",
                    "type": "uint256"
                }
            ],
            "name": "payWinners",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "payoutBackloggedWinners",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint16",
                    "name": "_firstWinningNum",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "_secondWinningNum",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "_thirdWinningNum",
                    "type": "uint16"
                }
            ],
            "name": "processWinners",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "sendETHtoContract",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_newAdminAddress",
                    "type": "address"
                }
            ],
            "name": "setAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint16",
                    "name": "_firstWinningNum",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "_secondWinningNum",
                    "type": "uint16"
                },
                {
                    "internalType": "uint16",
                    "name": "_thirdWinningNum",
                    "type": "uint16"
                }
            ],
            "name": "setWinningNumber",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "singleDigitWinnings",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "unpause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_newOwnerAddress",
                    "type": "address"
                }
            ],
            "name": "updateOwner",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "withdrawBalanceFromContract",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "stateMutability": "payable",
            "type": "receive"
        }
    ],
    '0x1818E7e5fCA9513aABeD1AAa0d3E0b8233456AC2');

    console.log(BolitaContract);

    var bolitaMakeBetEvent = BolitaContract.events.BetAccepted({}, 'latest');

//                      listening to the following events:
//winners
//BetCleared
//BettingIsOpen

//FirstDigitWinningNumber
//SecondDigitWinningNumber
//ThirdDigitWinningNumber
/**
 *      PICK UP HERE: GET EVENT LISTENER WORKING, WAS UPDATED IN WEB3 1.X.X
 */
    
    BolitaContract.events.BetAccepted(function(error, result){
        
        if (window.location.href.match('results.html') != null) {
        
            if(result) {
                latestNums.innerHTML = "Bettor: " + web3.toAscii(result.args.bettor) + " Bet on: " + web3.toAscii(result.args.numberBetOn);
            }
            else {
                latestNums.innerHTML = "I DIDNT WORK CORRECTLY";
            }
        }
    });

    BolitaContract.events.FirstDigitWinningNumber(function(error, result){
        
        if (window.location.href.match('results.html') != null) {
        
            if(result) {
                console.log("Got back the result:");
                console.log(result);
            }
            else {
                console.log("Event: FirstDigitWinningNumber returned an error:");
                console.log(error);
            }
        }
    });

    BolitaContract.events.SecondDigitWinningNumber(function(error, result){
        
        if (window.location.href.match('results.html') != null) {
        
            if(result) {
                console.log("Got back the result:");
                console.log(result);
            }
            else {
                console.log("Event: SecondDigitWinningNumber returned an error:");
                console.log(error);
            }
        }
    });

    BolitaContract.events.ThirdDigitWinningNumber(function(error, result){
        
        if (window.location.href.match('results.html') != null) {
        
            if(result) {
                console.log("Got back the result:");
                console.log(result);
            }
            else {
                console.log("Event: ThirdDigitWinningNumber returned an error:");
                console.log(error);
            }
        }
    });

    BolitaContract.events.winners(function(error, result){
        
        if (window.location.href.match('results.html') != null) {
        
            if(result) {
                console.log("Got back the result:");
                console.log(result);
            }
            else {
                console.log("Event: winners returned an error:");
                console.log(error);
            }
        }
    });

    BolitaContract.events.BetCleared(function(error, result){
        
        if (window.location.href.match('results.html') != null) {
        
            if(result) {
                console.log("Got back the result:");
                console.log(result);
            }
            else {
                console.log("Event: BetCleared returned an error:");
                console.log(error);
            }
        }
    });

    BolitaContract.events.BettingIsOpen(function(error, result){
        
        if (window.location.href.match('results.html') != null) {
        
            if(result) {
                console.log("Got back the result:");
                console.log(result);
            }
            else {
                console.log("Event: BettingIsOpen returned an error:");
                console.log(error);
            }
        }
    });

    //add getter to results.html to verify blockchain connectivity

    if (window.location.href.match('popup.html') != null) {

        //BET ON FIRST DIGIT
        btnFirstBetSubmit.onclick = function() {
 
            BolitaContract.methods.betOnFirstDigit(document.getElementById("addresstext").value, document.getElementById("firstBetInput").value);

            console.log("1st BET BTN WAS CLICKED");
            console.log(document.getElementById("addresstext").value);
            console.log(document.getElementById("firstBetInput").value);
        }

        //BET ON SECOND DIGIT
        btnSecondBetSubmit.onclick = function() {
 
            BolitaContract.methods.betOnSecondDigit(document.getElementById("addresstext").value, document.getElementById("secondBetInput").value);

            console.log("2nd BET BTN WAS CLICKED");
            console.log(document.getElementById("addresstext").value);
            console.log(document.getElementById("secondBetInput").value);
        }

        //BET ON THIRD DIGIT
        btnThirdBetSubmit.onclick = function() {
 
            BolitaContract.methods.betOnThirdDigit(document.getElementById("addresstext").value, document.getElementById("thirdBetInput").value);

            console.log("3rd BET BTN WAS CLICKED");
            console.log(document.getElementById("addresstext").value);
            console.log(document.getElementById("thirdBetInput").value);
        }

    }


    /**
     * Using getLatestNumber button to test the winning Number method
     * 
     * @dev in later implementation, this will called based on the clock at 3pm EST
     * pseduo code would look like:
     *    if (now.getHours() === 15 && now.getMinutes() === 00) {
     *      $getJSON function() {
     *          //get latest #
     *          //save latest 3 digits as vars
     *       }
     *     BolitaContract.methods.setWinningNumber(digit1, digit2, digit3)
     *   }
     */
     if (window.location.href.match('results.html') != null) {

        btnLatestNums.onclick = function() {
            
            BolitaContract.methods.setWinningNumber(
                firstWinningNum,
                secondWinningNum,
                thirdWinningNum
            );
            
            latestNums.innerHTML = "Hello World";

        }
     }

});


/*
//testing function
function greeting() {
    console.log('Hello World!');
}
    
setTimeout(greeting, 1000);
*/