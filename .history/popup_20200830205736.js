
var elements = document.querySelectorAll('.btnFirstBet');
for (var i = 0; i < elements.length; i++) {
    elements[i].classList.remove('active');
    elements[i].onclick = function (event) {
        console.log("ONCLICK");
        //remove all active class
        removeClass();
        if (event.target.innerHTML === this.innerHTML) {
            this.classList.add("active");
        }
    }
}

function removeClass(){
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.remove('active');
  }
}






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




document.querySelectorAll(".btnFirstBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        item.style.opacity= 0.4;
        //item.classList.add("active");

        //only 1 can be active at any given time

    })
});






*/