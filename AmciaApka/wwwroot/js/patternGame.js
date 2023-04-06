import {
    getRandomInt,
    shuffleArray,
    startTimer,
    sendToController
} from './functions.js'

const imgs = ["../img/aurelia.svg", "../img/vue.svg", "../img/angular.svg", "../img/ember.svg", "../img/backbone.svg", "../img/react.svg"];
let difficulty;

let pattern = [...document.querySelectorAll(".memory-game div img")];
let patternDiv = document.querySelector(".memory-game");
let matchedCount = 0;
let randInt;
let prevOptions = [];
let randPattern = [];
let mistakes = 0;
let time;
let dif;


function onClick() {
    if (this.getAttribute("name") == imgs[randPattern[matchedCount]]) {
        let newElement = document.createElement("div");
        let newImg = document.createElement("img");
        newImg.src = this.getAttribute("name");
        newImg.classList.add("front-face");
        newElement.appendChild(newImg);
        newElement.classList.add("memory-card");
        newElement.classList.add("added");
        patternDiv.appendChild(newElement);
        matchedCount++;
        if (matchedCount == dif) {
            setTimeout(() => {
                const elapsedTime = time.stop();
                sendToController("Dopasuj wzor", difficulty, mistakes, elapsedTime);
                alert("Wygra³eœ!");
                getRandPattern();
            }, 500);
        }
    }
    else
        mistakes++;
}

function getRandPattern() {
    mistakes = 0;
    patternDiv.innerHTML = "";
    document.querySelectorAll(".choose-card div").forEach(element => element.removeEventListener("click", onClick));
    prevOptions = [];
    randPattern = [];
    fetch(`/Games/GetDifficulty?gameType=${encodeURIComponent("Dopasuj wzor")}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(
            data => {
                difficulty = data;
                if (difficulty == 1)
                    dif = 2
                else if (difficulty == 2)
                    dif = 3
                else
                    dif = 4
                let numCards = parseInt(dif);
                for (let i = 0; i < numCards; i++) {
                    randInt = getRandomInt(imgs.length);
                    while (randPattern.includes(randInt) || prevOptions.includes(randInt)) {
                        randInt = getRandomInt(imgs.length);
                    }
                    prevOptions.push(randInt);
                    randPattern.push(randInt);
                }

                randPattern.forEach(element => {
                    let div = document.createElement("div");
                    div.classList.add("memory-card");
                    let img = document.createElement("img");
                    img.src = imgs[element];
                    img.classList.add("front-face");
                    div.appendChild(img);
                    patternDiv.appendChild(div);
                });
                matchedCount = 0;
                document.querySelectorAll(".choose-card div").forEach(element => element.addEventListener("click", onClick));
                time = startTimer();
            })
}
getRandPattern();
