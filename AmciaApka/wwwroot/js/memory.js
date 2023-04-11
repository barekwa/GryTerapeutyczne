import {
    startTimer,
    sendToController
} from './functions.js'
let difficulty;
const cardsContainer = document.querySelector(".memory-game");
const cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let time;


function startGame(numOfCards) {
    resetBoard();
    cardsContainer.innerHTML = "";
    cards.length = 0;

    const images = [
        "../img/ember.svg",
        "../img/aurelia.svg",
        "../img/vue.svg",
        "../img/angular.svg",
        "../img/backbone.svg",
        "../img/react.svg"
    ];

    for (let i = 0; i < numOfCards / 2; i++) {
        cards.push(createCard(images[i]));
        cards.push(createCard(images[i]));
    }

    shuffle(cards);

    cards.forEach(card => {
        cardsContainer.appendChild(card);
    });
    cardsContainer.style.visibility = "visible";
    time = startTimer();
}

function createCard(imageSrc) {
    const card = document.createElement("div");
    card.classList.add("memory-card");

    const frontFace = document.createElement("img");
    frontFace.classList.add("front-face");
    frontFace.src = imageSrc;

    const backFace = document.createElement("img");
    backFace.classList.add("back-face");
    backFace.src = "../img/js-badge.svg";

    card.appendChild(frontFace);
    card.appendChild(backFace);
    card.addEventListener("click", flipCard);

    return card;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.querySelector(".front-face").src === secondCard.querySelector(".front-face").src;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    if (document.querySelectorAll(".memory-card:not(.flip)").length === 0) {
        setTimeout(() => {
            const elapsedTime = time.stop();
            sendToController("Memory", difficulty, 0, elapsedTime);
            alert("Wygrałeś");
            resetGame();
        }, 1500);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();
function resetGame() {
        resetBoard();
        cardsContainer.innerHTML = "";
    fetch(`/Games/GetDifficulty?gameType=${encodeURIComponent("Memory")}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(
            data => {
                difficulty = data;
                if (difficulty == 1) {
                    startGame(8);
                } else if (difficulty == 2) {
                    startGame(10);
                } else {
                    startGame(12);
                }
            }
        )
}
resetGame();