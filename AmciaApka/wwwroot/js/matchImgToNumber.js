import {
    getRandomInt,
    shuffleArray,
    startTimer,
    sendToController
} from './functions.js'

let difficulty;
let dif;
const randNumImg = document.querySelector(".randNum");
const imgs = ["../img/1j.jpg", "../img/2j.jpg", "../img/3j.jpg", "../img/4j.jpg", "../img/5j.jpg"];
const imgsToMatch = ["../img/1.png", "../img/2.png", "../img/3.png", "../img/4.png", "../img/5.png"];
let randInt = getRandomInt(imgs.length);
randNumImg.src = imgs[randInt];
let prevRand = randInt;
let randInt2;
let mistakes = 0;
let time;

function onClick() {
    if (this.getAttribute("name") == imgs[randInt][7]) {
        const elapsedTime = time.stop();
        sendToController("Dopasuj ilosc", difficulty, mistakes, elapsedTime);
        alert("Wygrałeś");
        randInt = getRandomInt(imgs.length);
        while (randInt === prevRand) {
            randInt = getRandomInt(imgs.length);
        }
        prevRand = randInt;
        randNumImg.src = imgs[randInt];
        startGame();
    }
    else
        mistakes++;
}
function startGame() {
    mistakes = 0;
    let randOptions = [];
    let prevOptions = [];
    let div = document.querySelector(".chooseNumber");
    div.innerHTML = "";
    document.querySelectorAll(".chooseNumber img").forEach(element => element.removeEventListener("click", onClick));
    fetch(`/Games/GetDifficulty?gameType=${encodeURIComponent("Dopasuj ilosc")}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(
            data => {
                difficulty = data
                if (difficulty == 1)
                    dif = 2
                else if (difficulty == 2)
                    dif = 3
                else
                    dif = 4
                let numCards = parseInt(dif);
                for (let i = 0; i < numCards; i++) {
                    randInt2 = getRandomInt(imgs.length);
                    while (randInt2 === randInt || randOptions.includes(randInt2) || prevOptions.includes(randInt2)) {
                        randInt2 = getRandomInt(imgs.length);
                    }
                    prevOptions.push(randInt2);
                    randOptions.push(randInt2);
                }
                randOptions = shuffleArray([...randOptions, randInt]);
                randOptions.forEach(element => {
                    let img = document.createElement("img");
                    img.setAttribute("name", imgsToMatch[element][7]);
                    img.src = imgsToMatch[element];
                    div.appendChild(img);
                })
                document.querySelectorAll(".chooseNumber img").forEach(element => element.addEventListener("click", onClick));
                time = startTimer();
            }
         )
}
startGame();