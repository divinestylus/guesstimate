let mainWrapper = document.querySelector('.wrapper'),
    startRestartBtn, numbers, randomNum, luckyNumber,
    livesRemaining, livesEle, feedbackEle, progressTracker,
    rewardMsg, randomQuote, author, score, data, timerDisplay, startPage,
    clickAudio = new Audio('./assets/click.mp3'), applauseAudio = new Audio('./assets/applause.mp3'),
    failureAudio = new Audio('./assets/failure.mp3'), gameStarted;



// Display game with call to action for player
function loadGame() {
    gameStarted = false;
    keyEvent();
    mainWrapper.innerHTML = `
    <section class="start">
        <div class="hero">
            <img src="./assets/logo.png" alt="Game Logo" class="start-logo">
            <button class="start-restart">Start Game</button>
        </div>
    </section>
    `;
    startRestartBtn = document.querySelector('.start-restart');
    startPage = document.querySelector('.start');
    startRestartBtn.addEventListener('click', startGame);
}
loadGame();



// Display numbers for player
function startGame() {
    clickAudio.play();
    applauseAudio.pause();
    livesRemaining = 10;
    score = 100;
    localStorage.setItem('lives', livesRemaining);
    localStorage.setItem('score', score);
    mainWrapper.innerHTML = `
    <section class="game">
    <nav class="nav-bar">
    <img src="./assets/logo.png" alt="Game Logo" class="game-logo logo-one">
    </nav>
    
    <div class="nav-options">
    
    <div class="progress-timer">
    <div class="progress">
    <div class="lives">Lives</div>
    <div class="progress-bar">
    <div class="progress-tracker"></div>
    </div>
    </div>
    <img src="./assets/logo.png" alt="Game Logo" class="game-logo logo-two">
    <div class="progress">
    <div class="lives">Timer</div>
    <div class="progress-bar">
    <div class="progress-tracker timer">00:59</div>
    </div>
    </div>
    </div>  
    
    <div class="feedback">
    <p></p>
    </div>
    
    </div>
    
    <div class="number-options"></div>
    </section>
    `;
    generateRandomNumbers(document.querySelector('.number-options'));
    timerDisplay = document.querySelector('.timer')
    feedbackEle = document.querySelector('.feedback p');
    feedbackEle.innerText = "Guess the lucky number between 0 - 24";
    progressTracker = document.querySelector('.progress-tracker');
    progressTracker.innerText = `${localStorage.getItem('lives')}`;
    progressTracker.style.width = `${localStorage.getItem('score')}%`;
    gameStarted = true;
}



// Display player result
function displayResult(win) {
    if (win) {
        applauseAudio.play();
        mainWrapper.innerHTML = `
        <section class="reward">
            <div class="modal">
            <h1 class="reward-msg">Congrats!</h1>
            <blockquote class="random-quote">
            <p></p>
            </blockquote>
            <cite class="author"></cite>
            <button class="start-restart">Restart Game</button>
            <img src="./assets/logo.png" alt="Game Logo" class="reward-logo">
            </div>
        </section>
        `;
    }
    else {
        failureAudio.play();
        mainWrapper.innerHTML = `
        <section class="reward">
            <div class="modal">
                <h1 class="reward-msg">Try Again.</h1>
            <blockquote class="random-quote">
                <p></p>
            </blockquote>
            <cite class="author"></cite>
            <button class="start-restart">Restart Game</button>
            <img src="./assets/logo.png" alt="Game Logo" class="reward-logo">
            </div>
        </section>
        `;
    }
    rewardMsg = document.querySelector('.reward-msg');
    randomQuote = document.querySelector('.random-quote p');
    author = document.querySelector('.author');
    getData(randomQuote, author);
    gameStarted = false;
    keyEvent();
    startRestartBtn = document.querySelector('.start-restart');
    startRestartBtn.addEventListener('click', startGame);
}



// Start and restart game on key events
function keyEvent() {
    document.addEventListener('keypress', function handleKeyPress(event) {
        if (event.key === 'Enter' || event.code === 'Space') {
            if (!gameStarted) {
                startGame();
                document.removeEventListener('keypress', handleKeyPress);
            }
        }
    });
}



// Generate random numbers as options for player to choose
function generateRandomNumbers(numbersContainer) {
    let randomNumbers = [];
    for (let i = 1; i < 25; i++) {
        let randomDisplay;
        do {
            randomDisplay = Math.floor(Math.random() * 25);
            luckyNumber = Math.floor(Math.random() * 25)
        } while (randomNumbers.includes(randomDisplay));
        randomNumbers.push(randomDisplay);
        numbersContainer.innerHTML += `<button class="random-numbers">${randomDisplay}</button>`;
    }
    numbers = document.querySelectorAll('.random-numbers');
    countdown(numbers);
    numbers.forEach(number => {
        number.addEventListener('click', (event) => {
            checkGuess(Number(event.currentTarget.innerText), number);
            event.currentTarget.disabled = true;
        })
    });
}



// Validate player guesses
function checkGuess(playerGuess, number) {
    let failAudio = new Audio('./assets/fail.wav'), passAudio = new Audio('./assets/pass.mp3');
    if (Number(localStorage.getItem('lives')) !== 0) {
        if (playerGuess > luckyNumber) {
            feedbackEle.innerText = "Too high";
            failAudio.play();
            number.style.backgroundColor = "#E57C79";
            number.style.color = "#ffffff";
            number.style.border = "0";
            reduceLives();
        }
        else if (playerGuess < luckyNumber) {
            feedbackEle.innerText = "Too low";
            failAudio.play();
            number.style.backgroundColor = "#E57C79";
            number.style.color = "#ffffff";
            number.style.border = "0";

            reduceLives();
        }
        else if (playerGuess === luckyNumber) {
            feedbackEle.innerText = "You won!";
            passAudio.play();
            clearInterval(timer);
            timeLeft = 59;
            number.style.backgroundColor = "#27C492";
            number.style.color = "#ffffff";
            number.style.border = "0";
            numbers.forEach(number => {
                number.disabled = true;
            });
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
    if (Number(localStorage.getItem('lives')) === 0) {
        clearInterval(timer);
        timeLeft = 59;
        feedbackEle.innerText = "You lost!";
        progressTracker.innerText = "";
        setTimeout(() => {
            displayResult(false);
        }, 2000);
    }
}



// Count-down timer when page loads

let timeLeft = 59;
let timer;
function countdown(numbers) {
    timer = setInterval(function () {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.innerText = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        timeLeft--;

        if (Number(timeLeft) === 0) {
            clearInterval(timer);
            timeLeft = 59;
            feedbackEle.innerText = "Times up!";
            timerDisplay.innerText = "00:00";
            numbers.forEach(number => {
                number.disabled = true;
            })
            setTimeout(() => {
                displayResult(false);
            }, 3000);
        }
    }, 1000);
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
