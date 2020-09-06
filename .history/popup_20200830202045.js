


document.querySelectorAll(".btnFirstBet").forEach(item => {
    item.addEventListener('click', event => {
        //handle click
        item.style.opacity= 0.4;
        //item.classList.add("active");

        //only 1 can be active at any given time
        var elems = document.querySelectorAll(".active");
        [].forEach.call(elems, function(el) {
            el.classList.remove("active");
        });
        
        e.target.className = "active";
    })
});





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







*/