import {
    getRandomInt,
    shuffleArray,
    startTimer,
    sendToController
} from './functions.js'

let emotions = ["../img/emotionsMatch/zlosc.jpg", "../img/emotionsMatch/zaskoczenie.png", "../img/emotionsMatch/radosc.png", "../img/emotionsMatch/obrzydzenie.png", "../img/emotionsMatch/smutek.png", "../img/emotionsMatch/strach.png"];
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
                    let img = document.createElement("img");
                    img.src = emotions[element];
                    img.setAttribute("name", emotions[element]);
                    div.appendChild(img);
                })
                time = startTimer();
                document.querySelectorAll(".chooseEmotion img").forEach(element => {
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