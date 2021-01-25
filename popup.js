
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

btnLatestNums.onclick = function() {

    latestNums.innerHTML = "Hello World";

};


var btnGetCNNNumbers = document.getElementById("btnGetCNNNumbers");
var latestCaseNum = document.getElementById("latestCaseNum");




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



var sendNotificationbtn = document.getElementById("btnSendNotification");


var options = {
    title:'myNotification',
    message: 'TIMING NOTIFICATION',
    iconUrl: 'images/bolita_logo.png',
    type: 'basic'
}

chrome.notifications.create(options);


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