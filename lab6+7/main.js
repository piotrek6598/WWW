import {fib} from "./fib2.js";

let imie = document.getElementById("nameField");
let nazw = document.getElementById("surnameField");
let depDate = document.getElementById("departureDate");
let retDate = document.getElementById("returnDate");

let popup = document.getElementById("popup-booking");

popup.onclick = () => popup.style.display = 'none';

let nowyAkapit = document.createElement('DIV');
nowyAkapit.innerHTML = "nowy akapit";
document.querySelector('body').appendChild(nowyAkapit);

setTimeout(() => {
    console.log('No już wreszcie.');
}, 2000);

function nowa_promisa(ms) {
    return new Promise((resolve, reject) => {
        window.setTimeout(resolve, ms);
    });
}

let kolory = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'gold'];

function teczowe_kolory(el) {
    let promisa = new Promise(resolve => resolve());
    kolory.forEach(color => {
        promisa = promisa.then(() => nowa_promisa(1000)).then(() => {
            el.style.backgroundColor = color;
            console.log(color);
        });
    });
}

teczowe_kolory(document.querySelector('.list-table'));

fetch('https://api.github.com/repos/Microsoft/TypeScript/commits')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let nowyAkapit2 = document.createElement('DIV');
        nowyAkapit2.innerHTML = `Avatar autora commitu:\n <img src="${data[0].author.avatar_url}" alt="Avatar"/>`;
        document.querySelector('body').appendChild(nowyAkapit2);
    });

let kolumna = document.querySelector('#opoznienia');
let tabela = document.querySelector('#opoznienia .table-opoznienia');
let formularzObszar = document.querySelector('#bookingForm');
let clicks = 0;
tabela.addEventListener("click", ev => {
    clicks++;
    kolumna.style.backgroundColor = kolory[clicks % 8];
    formularzObszar.style.backgroundColor = kolory[clicks % 8];
    console.log("Fib: ", fib(10 * clicks));
});

function check_form() {
    return !(imie.value === "" || nazw.value === "" || depDate.value === "" || retDate.value === ""
        || new Date(depDate.value) < new Date() || new Date(retDate.value) < new Date(depDate.value));

}

let submitButton = document.querySelector('.submitButton');
submitButton.disabled = true;

function try_make_form_active() {
    if (check_form())
        submitButton.disabled = false;
}

imie.addEventListener("input", try_make_form_active);
nazw.addEventListener("input", try_make_form_active);
depDate.addEventListener("input", try_make_form_active);
retDate.addEventListener("input", try_make_form_active);