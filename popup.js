
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
 * Get positive cases from covidtracking.com
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
            //store 1st digit


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


//testing function
function greeting() {
    console.log('Hello World!');
}
    
setTimeout(greeting, 1000);

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
                message: "TIMING boom baby"
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



//added since error on web3 may be from race condition
window.addEventListener('load', function() {

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    web3.eth.defaultAccount = web3.eth.accounts[0];

    //var BolitaContract = web3.eth.contract([ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "newAdminAddress", "type": "address" } ], "name": "AddedAdmin", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "newOwnerAddress", "type": "address" } ], "name": "OwnerSet", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "prevAdminAddress", "type": "address" } ], "name": "RemovedAdmin", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "adminAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ownerAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_newAdminAddress", "type": "address" } ], "name": "setAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_newOwnerAddress", "type": "address" } ], "name": "updateOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ])
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
                    "internalType": "uint16",
                    "name": "winningNumFirstDigit",
                    "type": "uint16"
                }
            ],
            "name": "FirstDigitWinningNumber",
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
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint16",
                    "name": "winningNumSecondDigit",
                    "type": "uint16"
                }
            ],
            "name": "SecondDigitWinningNumber",
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
                }
            ],
            "name": "TestEvent",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint16",
                    "name": "winningNumThirdDigit",
                    "type": "uint16"
                }
            ],
            "name": "ThirdDigitWinningNumber",
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
            "name": "betOnAllThree",
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
            "inputs": [],
            "name": "getContractValue",
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
            "inputs": [
                {
                    "internalType": "uint16",
                    "name": "_numBetOn",
                    "type": "uint16"
                }
            ],
            "name": "getSINGLEAddressesByBet",
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


/**
 * 
 * 
 *      PICK UP HERE: GET EVENT LISTENER WORKING, WAS UPDATED IN WEB3 1.X.X
 * 
 * 
 */
    
        BolitaContract.events.BetAccepted(function(error, result){
            
            if (window.location.href.match('results.html') != null) {
            
                if(result) {
                    latestNums.innerHTML = "Bettor: " + web3.toAscii(result.args.bettor) + " Bet on: " + web3.toAscii(result.args.numberBetOn);
                }
                else {
                    latestNums.innerHTML = "I DIDNT WoRK CORRECTLY";
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
     *     }
     *     
     *       BolitaContract.methods.setWinningNumber(digit1, digit2, digit3)
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





//contract abi
//var bolitaContract = web3.eth.contract(asfasdfasdf);

//deployed address that will be used - from remix for testing web3 injection
//var bolitaAddress = bolitaContract.at(asdfasdfasdf)
//console.log(bolitaAddress)

/*bolitaAddress.setBet(function(error,result) {
    if(!error) {
        $("#firstBetInput").html(result[0]+' (' +result[1]');
    } else {
        console.log(error);
    }
});

$("#buttonIDTHATISTARGETTED").click(function() {
    bolitaAddress.setBet($("#firstBetInput").val(),$("#secondBetInput").val(),$("#thirdBetInput").val());
});

*/

/*


[document.querySelectorAll(".firstBet"), document.querySelector('.btnFirstBet')].forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        item.style.opacity= 0.4;
        item.addClass("active");
    })
});


var elements = document.getElementsByClassName(".btnFirstBet");

[].forEach.call(elements, function(currElement) {
    currElemen
    currElement.style.opacity= 0.4;
    currElement.classList.add("active");
    console.log(currElement.tagName);
});


document.getElementsByClassName(".btnFirstBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        item.style.opacity= 0.4;
       // element.classList.add("active");
    })
})




function setFirstBet(value){
    document.getElementById("firstBetInput").value= value;
   
}

 document.getElementById("totalValue").innerHTML= "Total price: $" + 500*value;









var elements = document.querySelectorAll('.btnFirstBet');
for (var i = 0; i < elements.length; i++) {
    elements[i].classList.remove("active");
    elements[i].onclick = function (event) {
        console.log("ONCLICK");
        //remove all active class
        removeClass();
        if (event.elements[i].innerHTML === this.innerHTML) {
            console.log("IN IF");
            this.classList.add("active");
        }
    }
}

function removeClass(){
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.remove("active");
  }
}








*/