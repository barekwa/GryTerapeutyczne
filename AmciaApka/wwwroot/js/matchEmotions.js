import {
    getRandomInt,
    shuffleArray,
    startTimer,
    sendToController
} from './functions.js'

let emotions = ["Złość", "Zaskoczenie", "Radość", "Obrzydzenie", "Smutek", "Strach"];
let emotionsImg = ["../img/zlosc.png", "../img/zaskoczenie.png", "../img/radosc.png", "../img/obrzydzenie.png", "../img/smutek.png", "../img/strach.png"];
let div = document.querySelector(".chooseEmotion");
let difficulty;

let randInt = getRandomInt(emotionsImg.length);
let prevRand = randInt;
let randInt2;
let prevRand2;
let emotionToMatchDiv = document.querySelector(".emotionImg");
let emotionImg = document.querySelector(".emotionImg img");
emotionImg.src = emotionsImg[randInt];
emotionToMatchDiv.setAttribute("name", emotions[randInt]);
let time;
let mistakes = 0;

function startGame() {
    mistakes = 0;
    div.innerHTML = "";
    let randEmotions = [];
    let prevOptions = [randInt];
    let emotionToMatchDiv = document.querySelector(".emotionImg");
    fetch(`/Games/GetDifficulty?gameType=${encodeURIComponent("Dopasuj emocje")}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(
            data => {
                difficulty = data
                if (difficulty === 1) {
                    for (let i = 0; i < 2; i++) {
                        randInt2 = getRandomInt(emotions.length);
                        prevRand2 = randInt2;
                        while (randEmotions.includes(randInt2) || prevOptions.includes(randInt2)) {
                            randInt2 = getRandomInt(emotions.length);
                        }
                        prevOptions.push(randInt2);
                        randEmotions.push(randInt2);
                    }
                } else if (difficulty === 2) {
                    for (let i = 0; i < 3; i++) {
                        randInt2 = getRandomInt(emotions.length);
                        prevRand2 = randInt2;
                        while (randEmotions.includes(randInt2) || prevOptions.includes(randInt2)) {
                            randInt2 = getRandomInt(emotions.length);
                        }
                        prevOptions.push(randInt2);
                        randEmotions.push(randInt2);
                    }
                } else if (difficulty === 3) {
                    for (let i = 0; i < 5; i++) {
                        randInt2 = getRandomInt(emotions.length);
                        prevRand2 = randInt2;
                        while (randEmotions.includes(randInt2) || prevOptions.includes(randInt2)) {
                            randInt2 = getRandomInt(emotions.length);
                        }
                        prevOptions.push(randInt2);
                        randEmotions.push(randInt2);
                    }
                }
                randEmotions = shuffleArray([...randEmotions, randInt]);
                randEmotions.forEach(element => {
                    let p = document.createElement("p");
                    p.setAttribute("name", emotions[element]);
                    p.textContent = emotions[element];
                    div.appendChild(p);
                })
                time = startTimer();
                document.querySelectorAll(".chooseEmotion p").forEach(element => {
                    element.addEventListener("click", () => {
                        if (element.getAttribute("name") == emotionToMatchDiv.getAttribute("name")) {
                            const elapsedTime = time.stop();
                            sendToController("Dopasuj emocje", difficulty, mistakes, elapsedTime);
                            alert("Wygrałeś");
                            randInt = getRandomInt(emotionsImg.length);
                            while (randInt === prevRand) {
                                randInt = getRandomInt(emotionsImg.length);
                            }
                            prevRand = randInt;
                            let emotionToMatchDiv = document.querySelector(".emotionImg");
                            let emotionImg = document.querySelector(".emotionImg img");
                            emotionImg.src = emotionsImg[randInt];
                            emotionToMatchDiv.setAttribute("name", emotions[randInt]);
                            startGame();
                        }
                        else
                            mistakes++;
                    });
                });
            }
        );
}

startGame();