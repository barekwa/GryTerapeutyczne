import {
    getRandomInt,
    shuffleArray,
    startTimer,
    sendToController
} from './functions.js'
let time;
let mistakes = 0;
let dif;


const values = ["droga", "pies", "kuchnia", "kwiatek", "deszcz", "sypialnia", "toaleta"]
const imgs = ["../img/droga.jpg", "../img/pies.webp", "../img/kuchnia.webp", "../img/kwiatek.png", "../img/deszcz.jpg", "../img/sypialnia.jpg", "../img/toaleta.jpg"];
let imgsToMatch = ["../img/auto.jpg", "../img/pies1.jpg", "../img/kuchnia1.jpg", "../img/kwiatek1.jpg", "../img/deszcz1.jpg", "../img/sypialnia1.jpg", "../img/toaleta.jpeg"];
let difficulty;
const div = document.querySelector(".choose");
let randInt2;
let randInt = getRandomInt(imgs.length);
let prevRand = randInt;
let img = document.querySelector(".toMatch img");
img.src = imgs[randInt];
img.setAttribute("name", values[randInt]);
function onClick(){
    if (this.getAttribute("name") == img.getAttribute("name")) {
        const elapsedTime = time.stop();
        sendToController("Quiz", difficulty, mistakes, elapsedTime);
        alert("Wygrałeś");
        randInt = getRandomInt(imgs.length);
        while (randInt === prevRand) {
            randInt = getRandomInt(imgs.length);
        }
        prevRand = randInt;
        let img = document.querySelector(".toMatch img");
        img.src = imgs[randInt];
        img.setAttribute("name", values[randInt]);
        startGame();
    }
    else
        mistakes++;
}
function startGame() {
    mistakes = 0;
    div.innerHTML = "";
    document.querySelectorAll(".choose img").forEach(element => element.removeEventListener("click", onClick))
    let randOptions = [];
    img = document.querySelector(".toMatch img");
    let prevOptions = [randInt];
    fetch(`/Games/GetDifficulty?gameType=${encodeURIComponent("Quiz")}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(
            data => {
                difficulty = data;
                let dif;
                if (difficulty == 1)
                    dif = 2
                else if (difficulty == 2)
                    dif = 3
                else
                    dif = 4
                let numCards = parseInt(dif);
                for (let i = 0; i < numCards; i++) {
                    randInt2 = getRandomInt(imgs.length);
                    while (randOptions.includes(randInt2) || prevOptions.includes(randInt2)) {
                        randInt2 = getRandomInt(imgs.length);
                    }
                    prevOptions.push(randInt2);
                    randOptions.push(randInt2);
                }
                prevRand = randInt;
                randOptions = shuffleArray([...randOptions, randInt]);
                randOptions.forEach(element => {
                    let img = document.createElement("img");
                    img.setAttribute("name", values[element]);
                    img.src = imgsToMatch[element];
                    div.appendChild(img);
                })
                document.querySelectorAll(".choose img").forEach(element => {
                    element.addEventListener("click", onClick)
                })
                time = startTimer();
            })
}
startGame();




