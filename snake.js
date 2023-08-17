var canvas;
var ctx;
var speedText;
var scoreText;
var gameOverText;
var snakePosX = [10, 11, 12, 13, 14];
var snakePosY = [10, 10, 10, 10, 10];
var applePosX = 15;
var applePosY = 0;
var blockSize = 20;
var widthInBlocks = 600 / blockSize;
var heightInBlocks = 600 / blockSize;
var score = 0;
let level = 1;

let newDirection = "right";
let direction = "right";
var intervalId;
var speed = 4;
let eatedApple = false;
let directionChanged = false;
const appleImg = new Image();
const spriteImg = new Image();
appleImg.src = "assets/red-sprite.svg";
spriteImg.src = "assets/sprite.svg";
window.onload = function () {
  scoreText = document.querySelector(".game-score_value");
  speedText = document.querySelector(".game-speed_value");
  gameOverText = document.querySelector(".game-over-text");
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  intervalId = setInterval(gameLoop, 1000 / speed);
};
function resetGame() {
  gameOverText.style.display = "none";
  snakePosX = [10, 11, 12, 13, 14];
  snakePosY = [10, 10, 10, 10, 10];
  score = 0;
  level = 1;
  speed = 4;
  eatedApple = false;
  directionChanged = false;
  startGame();
}
function startGame(reset = false) {
  intervalId = setInterval(gameLoop, 1000 / speed);
}
function stopGame() {
  snakePosX = [];

  snakePosY = [];
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
    snakePosX.push(snakePosX.at(-1) + 1);
    snakePosY.push(snakePosY.at(-1));
  } else if (direction == "left") {
    snakePosX.push(snakePosX.at(-1) - 1);
    snakePosY.push(snakePosY.at(-1));
  } else if (direction == "up") {
    snakePosX.push(snakePosX.at(-1));
    snakePosY.push(snakePosY.at(-1) - 1);
  } else if (direction == "down") {
    snakePosX.push(snakePosX.at(-1));
    snakePosY.push(snakePosY.at(-1) + 1);
  }
  if (!eatedApple) {
    snakePosX.shift();
    snakePosY.shift();
  } else {
    eatedApple = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.strokeStyle = "green";
  for (let i = 0; i < snakePosX.length; i++) {
    ctx.drawImage(
      spriteImg,
      snakePosX[i] * blockSize,
      snakePosY[i] * blockSize,
      blockSize,
      blockSize
    );
  }
  ctx.drawImage(
    appleImg,
    applePosX * blockSize,
    applePosY * blockSize,
    blockSize,
    blockSize
  );
  scoreText.innerText = score;
  speedText.innerText = speed;
}

function checkCollision() {
  let headPosX = snakePosX.at(-1);
  let headPosY = snakePosY.at(-1);
  ///   COLLISION WITH WALLS    ///
  if (headPosX > widthInBlocks - 1) {
    snakePosX[snakePosX.length - 1] = 0;
  } else if (headPosX < 0) {
    snakePosX[snakePosX.length - 1] = widthInBlocks - 1;
  } else if (headPosY < 0) {
    snakePosY[snakePosY.length - 1] = heightInBlocks - 1;
  } else if (headPosY > heightInBlocks - 1) {
    snakePosY[snakePosY.length - 1] = 0;
  }
  ///  COLLISION WHITH ITSELFS   /////

  for (let i = 0; i < snakePosX.length - 1; i++) {
    if (snakePosX[i] === headPosX && snakePosY[i] === headPosY) stopGame();
  }

  ///  COLLISION WITH APPLE    /////
  if (snakePosX.at(-1) == applePosX && snakePosY.at(-1) == applePosY) {
    score += speed * 10;
    eatedApple = true;
    // ctx.drawImage(
    //   spriteImg,
    //   snakePosX.at(-1) * blockSize,
    //   snakePosY.at(-1) * blockSize,
    //   blockSize,
    //   blockSize
    // );
    spawnApple();
    if (score / (speed * 10) >= level * 5) {
      speed++;
      level++;
      console.log(speed);
    }
  }
}
// function eatApple() {
//   if (direction == "right") {
//     snakePosX.push(snakePosX.at(-1) + 1);
//     snakePosY.push(snakePosY.at(-1));
//   } else if (direction == "left") {
//     snakePosX.push(snakePosX.at(-1) - 1);
//     snakePosY.push(snakePosY.at(-1));
//   } else if (direction == "up") {
//     snakePosX.push(snakePosX.at(-1));
//     snakePosY.push(snakePosY.at(-1) - 1);
//   } else if (direction == "down") {
//     snakePosX.push(snakePosX.at(-1));
//     snakePosY.push(snakePosY.at(-1) + 1);
//   }
//   clearInterval(intervalId);
//   setTimeout(function () {
//     draw();
//   }, 1000 / speed);
//   setTimeout(function () {
//     intervalId = setInterval(gameLoop, 1000 / speed);
//   }, 1000 / speed);
// }

function spawnApple() {
  applePosX = Math.floor(Math.random() * widthInBlocks);
  applePosY = Math.floor(Math.random() * heightInBlocks);
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
