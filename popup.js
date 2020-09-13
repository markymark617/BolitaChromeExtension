
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

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3( new Web3.providers.HttpProviders("http://localhost:8545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];


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