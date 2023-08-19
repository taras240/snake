import { Prefs, Game } from "./game-pref.js";
var canvas;
var ctx;
var speedText;
var scoreText;
var gameOverText;
var applePosX = 15;
var applePosY = 0;
let newDirection = "right";
let direction = "right";
var intervalId;
let eatedApple = false;
let directionChanged = false;
const appleImg = new Image();
const spriteImg = new Image();
appleImg.src = "assets/red-sprite.svg";
spriteImg.src = "assets/sprite.svg";
let prefs = new Prefs();
let game = new Game();
window.onload = function () {
  scoreText = document.querySelector(".game-score_value");
  speedText = document.querySelector(".game-speed_value");
  gameOverText = document.querySelector(".game-over-text");
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  intervalId = setInterval(gameLoop, 1000 / prefs.speed);
};
function resetGame() {
  gameOverText.style.display = "none";
  prefs = new Prefs();
  game = new Game();
  eatedApple = false;
  directionChanged = false;
  startGame();
}
function startGame(reset = false) {
  intervalId = setInterval(gameLoop, 1000 / prefs.speed);
}
function stopGame() {
  game.snakePosX = [];

  game.snakePosY = [];
  clearInterval(intervalId);
  gameOverText.style.display = "block";
}
function gameLoop() {
  moveSnake();
  checkCollision();
  draw();
}

function moveSnake() {
  direction = newDirection;
  if (direction == "right") {
    game.snakePosX.push(game.snakePosX.at(-1) + 1);
    game.snakePosY.push(game.snakePosY.at(-1));
  } else if (direction == "left") {
    game.snakePosX.push(game.snakePosX.at(-1) - 1);
    game.snakePosY.push(game.snakePosY.at(-1));
  } else if (direction == "up") {
    game.snakePosX.push(game.snakePosX.at(-1));
    game.snakePosY.push(game.snakePosY.at(-1) - 1);
  } else if (direction == "down") {
    game.snakePosX.push(game.snakePosX.at(-1));
    game.snakePosY.push(game.snakePosY.at(-1) + 1);
  }
  if (!eatedApple) {
    game.snakePosX.shift();
    game.snakePosY.shift();
  } else {
    eatedApple = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.strokeStyle = "green";
  for (let i = 0; i < game.snakePosX.length; i++) {
    ctx.drawImage(
      spriteImg,
      game.snakePosX[i] * prefs.blockSize,
      game.snakePosY[i] * prefs.blockSize,
      prefs.blockSize,
      prefs.blockSize
    );
  }
  ctx.drawImage(
    appleImg,
    applePosX * prefs.blockSize,
    applePosY * prefs.blockSize,
    prefs.blockSize,
    prefs.blockSize
  );
  scoreText.innerText = prefs.score;
  speedText.innerText = prefs.speed;
}

function checkCollision() {
  let headPosX = game.snakePosX.at(-1);
  let headPosY = game.snakePosY.at(-1);
  ///   COLLISION WITH WALLS    ///
  if (headPosX > prefs.widthInBlocks - 1) {
    game.snakePosX[game.snakePosX.length - 1] = 0;
  } else if (headPosX < 0) {
    game.snakePosX[game.snakePosX.length - 1] = prefs.widthInBlocks - 1;
  } else if (headPosY < 0) {
    game.snakePosY[game.snakePosY.length - 1] = prefs.heightInBlocks - 1;
  } else if (headPosY > prefs.heightInBlocks - 1) {
    game.snakePosY[game.snakePosY.length - 1] = 0;
  }
  ///  COLLISION WHITH ITSELFS   /////

  for (let i = 0; i < game.snakePosX.length - 1; i++) {
    if (game.snakePosX[i] === headPosX && game.snakePosY[i] === headPosY)
      stopGame();
  }

  ///  COLLISION WITH APPLE    /////
  if (
    game.snakePosX.at(-1) == applePosX &&
    game.snakePosY.at(-1) == applePosY
  ) {
    prefs.score += prefs.speed * 10;
    eatedApple = true;

    spawnApple();
    if (prefs.score / (prefs.speed * 10) >= prefs.level * 5) {
      prefs.speed++;
      prefs.level++;
      console.log(speed);
    }
  }
}

function spawnApple() {
  applePosX = Math.floor(Math.random() * prefs.widthInBlocks);
  applePosY = Math.floor(Math.random() * prefs.heightInBlocks);
}

document.addEventListener("keydown", function (event) {
  console.log(event.key);
  if (event.key == "ArrowRight" && direction != "left") {
    newDirection = "right";
  } else if (event.key == "ArrowLeft" && direction != "right") {
    newDirection = "left";
  } else if (event.key == "ArrowUp" && direction != "down") {
    newDirection = "up";
  } else if (event.key == "ArrowDown" && direction != "up") {
    newDirection = "down";
  } else if (event.key == "Enter") {
    stopGame();
    resetGame();
  }
});
