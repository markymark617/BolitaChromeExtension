
document.querySelectorAll(".btnFirstBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        //only 1 can be active at any given time - remove all other active
        document.querySelectorAll(".btnFirstBet").forEach(item => {
         
                item.classList.remove("active");
                item.style.opacity=1;
            
        })

        item.style.opacity= 0.4;
        item.classList.add("active");

        document.getElementById("firstBetInput").value= item.value;

    })
});



document.querySelectorAll(".btnSecondBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        //only 1 can be active at any given time - remove all other active
        document.querySelectorAll(".btnSecondBet").forEach(item => {
         
                item.classList.remove("active");
                item.style.opacity=1;
            
        })

        item.style.opacity= 0.4;
        item.classList.add("active");

        document.getElementById("secondBetInput").value= item.value;

    })
});


document.querySelectorAll(".btnThirdBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        
        //only 1 can be active at any given time - remove all other active
        document.querySelectorAll(".btnThirdBet").forEach(item => {
         
                item.classList.remove("active");
                item.style.opacity=1;
            
        })

        item.style.opacity= 0.4;
        item.classList.add("active");

        document.getElementById("thirdBetInput").value= item.value;

    })
});


var latestNums = document.getElementById("finalNumbersID");
var btnLatestNums = document.getElementById("GetLatestNumbers");

//added for error on Liveserver 
window.onload = function(){ 

    btnLatestNums.onclick = function() {

        latestNums.innerHTML = "Hello World";

    };

};


var btnGetCNNNumbers = document.getElementById("btnGetCNNNumbers");
var latestCaseNum = document.getElementById("latestCaseNum");


//added for error on Liveserver 
window.onload = function(){ 
    btnGetCNNNumbers.onclick = function() {
        
        latestNums.innerHTML = "Hello CNN";
        


    //const json = '{"result":true, "count":42}';
    var url = "https://api.covidtracking.com/v1/us/current.json";

    var obj;
    var positiveCasesNum;

    $.getJSON('https://api.covidtracking.com/v1/us/current.json', function(data) {
        // JSON result in `data` variable
        console.log(data);
        console.log("TADA");
        console.log(data[0].positive);
        positiveCasesNum = data[0].positive;
        console.log("---");
        obj = data;


        latestCaseNum.innerHTML = data[0].positive;
        console.log("<p> tag updated!");
        
        });

    };
};


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
};

    function greeting() {
        console.log('Hello World!');
      }
      
      setTimeout(greeting, 1000);
    
    
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
    
    updateLatestWinningNumbers();
    
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
    
    
    

    /*
        web3 changes
    */

//added since error on web3 may be from race condition
window.addEventListener('load', function() {
 //   var Web3 = require('web3');

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    web3.eth.defaultAccount = web3.eth.accounts[0];

    //var BolitaContract = web3.eth.contract([ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "newAdminAddress", "type": "address" } ], "name": "AddedAdmin", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "newOwnerAddress", "type": "address" } ], "name": "OwnerSet", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "prevAdminAddress", "type": "address" } ], "name": "RemovedAdmin", "type": "event" }, { "anonymous": false, "inputs": [], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "adminAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "ownerAddress", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_newAdminAddress", "type": "address" } ], "name": "setAdmin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_newOwnerAddress", "type": "address" } ], "name": "updateOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function" } ])
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
    '0x1a9dEBC644B9854d44B56bAE1c9cEDDeeba494c6');



    //changes with each deploy on Remix, obv would be fixed if was deployed to testnet or mainnet
    //0.x.x syntax - now outdated
    //var Bolita = BolitaContract.at('0x1a9dEBC644B9854d44B56bAE1c9cEDDeeba494c6');

    console.log(BolitaContract);

});














/*if(latestNums) {
    
    latestNums.addEventListener("click", function() {

        document.getElementById("finalNumbersID").innerHTML = "Hello World";
    
        }
    );
}



    function surprise(cb) {
        (function loop() {
            var now = new Date();
            if (now.getHours() === 19 && now.getMinutes() === 27) {
                latestNums.innerHTML = "Hello World TIMING";
            }
            now = new Date();                  // allow for time passing
            var delay = 60000 - (now % 60000); // exact ms to next minute interval
            setTimeout(loop, delay);
        })();
    }




    <script>



       /* var headerToBeReplaced = document.getElementById('finalNumbersID');
        headerToBeReplaced.innerHTML = headerToBeReplaced.innerHTML.replace('some header val','changedtext')


       const resultsList=document.getElementById('results')
        new URLSearchParams(window.location.search).forEach((value,
        name) => {
            resultsList.append('${name} ${value}')
            resultsList.append(document.createElement('br'))
        })
        
        



    script
        jQuery('finalNumbersID').load('122333');
    script

        
        
        
        
        */


/*
window.setInterval(function(){
    var date = new Date(); 
    if(date.getHours() === 16 && date.getMinutes() === 45){ 
        // Do stuff
    }
}, 60000);





*/



































//WEB3 CODE

/*


if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3( new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];



*/









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