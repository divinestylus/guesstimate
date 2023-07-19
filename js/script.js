let mainWrapper = document.querySelector('.wrapper'),
    startRestartBtn, quitBtn, numbers, randomNum, luckyNumber,
    livesRemaining, livesEle, feedbackEle, progressTracker,
    rewardMsg, randomQuote, author, score, data;


// Display game with call to action for player
function loadGame() {
    mainWrapper.innerHTML = `
    <section class="start">
        <div class="hero">
            <img src="./assets/logo.png" alt="Game Logo" class="start-logo">
            <button class="start-restart">Start Game</button>
        </div>
    </section>
    `;
    startRestartBtn = document.querySelector('.start-restart');
    startRestartBtn.addEventListener('click', startGame);
}
loadGame();


// Display numbers for player
function startGame() {
    livesRemaining = 10;
    score = 100;
    localStorage.setItem('lives', livesRemaining);
    localStorage.setItem('score', score);
    mainWrapper.innerHTML = `
    <section class="game">
        <nav class="nav-bar">
            <img src="./assets/logo.png" alt="Game Logo" class="game-logo">
            <div class="nav-options">
                
                <div class="progress-feedback">
                    <div class="progress">
                        <div class="lives">Lives</div>
                        <div class="progress-bar">
                            <div class="progress-tracker">5</div>
                        </div>
                    </div>

                    <div class="feedback">
                        <p></p>
                    </div>
                </div>

                <button class="quit-btn">Quit Game</button>

            </div>
        </nav>
        <div class="number-options"></div>
    </section>
    `;
    quitBtn = document.querySelector('.quit-btn');
    quitBtn.addEventListener('click', quitGame);
    generateRandomNumbers(document.querySelector('.number-options'));
    feedbackEle = document.querySelector('.feedback p');
    feedbackEle.innerText = "Let's Play!";
    progressTracker = document.querySelector('.progress-tracker');
    progressTracker.innerText = `${localStorage.getItem('lives')}`;
    progressTracker.style.width = `${localStorage.getItem('score')}%`;
}


// Display player result
function displayResult(win) {
    if (win) {
        mainWrapper.innerHTML = `
        <section class="reward">
            <div class="modal">
                <img src="./assets/logo.png" alt="Game Logo" class="reward-logo">
                <h1 class="reward-msg">Congratulations!</h1>
                <blockquote class="random-quote">
                    <p></p>
                </blockquote>
                <cite class="author"></cite>
                <button class="start-restart">Restart Game</button>
            </div>
        </section>
        `;
    }
    else {
        mainWrapper.innerHTML = `
        <section class="reward">
            <div class="modal">
                <img src="./assets/logo.png" alt="Game Logo" class="reward-logo">
                <h1 class="reward-msg">You Lost, Try Again.</h1>
                <blockquote class="random-quote">
                    <p></p>
                </blockquote>
                <cite class="author"></cite>
                <button class="start-restart">Restart Game</button>
            </div>
        </section>
        `;
    }
    rewardMsg = document.querySelector('.reward-msg');
    randomQuote = document.querySelector('.random-quote p');
    author = document.querySelector('.author');
    startRestartBtn = document.querySelector('.start-restart');
    startRestartBtn.addEventListener('click', startGame);
    getData(randomQuote, author);
}


// Generate random numbers as options for player to choose
function generateRandomNumbers(numbersContainer) {
    let randomNumbers = [];
    for (let i = 1; i < 33; i++) {
        let randomDisplay;
        do {
            randomDisplay = Math.floor(Math.random() * 33);
            luckyNumber = Math.floor(Math.random() * 33)
        } while (randomNumbers.includes(randomDisplay));

        randomNumbers.push(randomDisplay);
        numbersContainer.innerHTML += `<button class="random-numbers">${randomDisplay}</button>`;
    }
    numbers = document.querySelectorAll('.random-numbers');
    numbers.forEach(number => {
        number.addEventListener('click', (event) => {
            checkGuess(Number(event.currentTarget.innerText), number);
            event.currentTarget.disabled = true;
        })
    });
}


// Validate player guesses
function checkGuess(playerGuess, number) {
    let failAudio = new Audio('./assets/fail.mp3'), passAudio = new Audio('./assets/pass.mp3');
    if (Number(localStorage.getItem('lives')) !== 0) {
        if (playerGuess > luckyNumber) {
            feedbackEle.innerText = "Too High";
            failAudio.play();
            number.style.backgroundColor = "#E57C79";
            number.style.color = "#ffffff";
            number.style.border = "0";
            reduceLives();
        }
        else if (playerGuess < luckyNumber) {
            feedbackEle.innerText = "Too Low";
            failAudio.play();
            number.style.backgroundColor = "#E57C79";
            number.style.color = "#ffffff";
            number.style.border = "0";

            reduceLives();
        }
        else if (playerGuess === luckyNumber) {
            feedbackEle.innerText = "You Won";
            passAudio.play();
            number.style.backgroundColor = "#27C492";
            number.style.color = "#ffffff";
            number.style.border = "0";
            setTimeout(() => {
                displayResult(true);
            }, 2000);
        }
    }
}


// Reduce the live when player misses display remaining lives to players...
function reduceLives() {
    livesRemaining--;
    localStorage.setItem('lives', livesRemaining);
    progressTracker.innerText = `${localStorage.getItem('lives')}`;
    score -= 10;
    localStorage.setItem('score', score);
    progressTracker.style.width = `${localStorage.getItem('score')}%`;
    if (localStorage.getItem('lives') <= 5) {
        progressTracker.style.backgroundColor = "#E57C79";
    }
    if (Number(localStorage.getItem('lives')) === 0) {
        feedbackEle.innerText = "You Lost";
        progressTracker.innerText = "";
        setTimeout(() => {
            displayResult(false);
        }, 2000);
    }
}


// Allow player to quit game
function quitGame() {
    loadGame();
}


// Get quotes from API
function getData(randomQuote, author) {
    fetch('https://type.fit/api/quotes')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let i = Math.floor(Math.random() * 1640);
            randomQuote.innerText = `${data[i].text}`;
            author.innerText = `- ${data[i].author}`;
        })
        .catch(error => {
            console.error(error);
        })
}
