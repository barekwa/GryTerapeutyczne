export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getRandomInt(num) {
    return Math.floor(Math.random() * num);
}

export function startTimer() {
    const startTime = Date.now();
    let elapsedTime = 0;

    const intervalId = setInterval(() => {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);

    return {
        stop: () => {
            clearInterval(intervalId);
            return elapsedTime;
        }
    };
}
export function sendToController(name, difficulty, mistakes, time) {
    const data = {
        GameType: String(name),
        Difficulty: parseInt(difficulty),
        Mistakes: parseInt(mistakes),
        Time: parseInt(time)
    };
    fetch('/Games/sendResults', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}



