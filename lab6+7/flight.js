let pax = document.querySelectorAll('.passengerList ul li');
let bestPax = null;
pax.forEach(function(nextPax) {
    if (!bestPax || bestPax.getAttribute('data-identyfikator-pasazera') < nextPax.getAttribute('data-identyfikator-pasazera'))
        bestPax = nextPax;
});
console.log(bestPax.getAttribute('data-identyfikator-pasazera'));