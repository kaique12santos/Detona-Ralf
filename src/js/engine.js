const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        curretTime: 60,
        initialLives: 3,  
        numberJogador:1
    },
    actions: {
        timeId: null,
        countDownTimeId: null,
    },
};

function triggerGameOverAnimation() {
    const gameOverImage = document.createElement("img");
    gameOverImage.src = "./src/images/game-over.png";
    gameOverImage.id = "game-over";
    gameOverImage.style.position = "fixed";
    gameOverImage.style.top = "-100px"; // Começa fora da tela
    gameOverImage.style.left = "50%";
    gameOverImage.style.transform = "translateX(-50%, -50%)";
    gameOverImage.style.zIndex = "1000";
    gameOverImage.style.width = "450px";
    gameOverImage.style.height = "auto";
    gameOverImage.style.transition = "top 2s ease-in-out";

    document.body.appendChild(gameOverImage);

    setTimeout(() => {
        gameOverImage.style.left = "35%";
        gameOverImage.style.top = "25%"; 
    }, 100);
    playSound("game-over-som");
}

function storeScoreInRank() {
    const rankList = document.getElementById("rank-list");
    const playerScore = state.values.result;
    const playerName = `Jogador ${state.values.numberJogador}`;

    const newRankItem = document.createElement("li");
    newRankItem.textContent = `${playerName}: ${playerScore} pontos`;
    
    rankList.appendChild(newRankItem);
    state.values.numberJogador++;
}

function handleSquareClick() {
    state.view.squares.forEach((square) => {
        square.addEventListener("click", () => {
            if (square.id === state.values.hitPosition) {
                // Acerto
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null; 
                playSound("hit");
            } else if (state.values.hitPosition !== null) { 
                
                const livesElement = document.querySelector("#lives");
                let lives = parseInt(livesElement.textContent.replace("x", ""));
                lives--;

                if (lives >= 0) { 
                    livesElement.textContent = `x${lives}`;
                    if (lives === 0) {
                        storeScoreInRank();
                        triggerGameOverAnimation();
                        setTimeout(resetGame, 5000);
                    }
                }

            }
        });
    });
}

function countDown() {
    state.values.curretTime--;
    state.view.timeLeft.textContent = state.values.curretTime;

    if (state.values.curretTime <= 0) {
        clearInterval(state.actions.countDownTimeId);
        clearInterval(state.actions.timeId);

        storeScoreInRank(); 
        alert("Tempo Acabou! O seu resultado foi: " + state.values.result);
        setTimeout(resetGame, 5000);
    }
}


function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });
    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
    state.actions.timeId = setInterval(randomSquare, state.values.gameVelocity);
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            }
        });
    });
}

function init() {
    moveEnemy();
    handleSquareClick();
}

function resetGame() {
    
    clearInterval(state.actions.countDownTimeId);
    clearInterval(state.actions.timeId);

    const startButton = document.querySelector("#botaoIniciar");
    startButton.style.display = "block"; 
    startButton.style.position = "absolute";
    startButton.style.top = "50%"; 
    startButton.style.left = "50%";
    startButton.style.transform = "translate(-50%, -50%)";

    state.values.curretTime = 60;
    state.values.result = 0;
    state.view.timeLeft.textContent = state.values.curretTime;
    state.view.score.textContent = state.values.result;


    const livesElement = document.querySelector("#lives");
    livesElement.textContent = `x${state.values.initialLives}`;

    const gameOverImage = document.querySelector("#game-over");
    if (gameOverImage) {
        gameOverImage.remove();
    }

    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });
}

function startGame() {
   const startButton = document.querySelector("#botaoIniciar");
   
    startButton.addEventListener("click", () => {
        startButton.style.display = "none";

        state.values.curretTime = 60;
        state.values.result = 0;
        state.view.timeLeft.textContent = state.values.curretTime;
        state.view.score.textContent = state.values.result;

        
        state.actions.countDownTimeId = setInterval(countDown, 1000);
        init(); 
    });
}

startGame();
