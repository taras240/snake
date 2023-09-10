import { Prefs, Game, playSound, ScreenElements } from "./game-pref.js";
var ctx;
var intervalId;
let eatedApple = false;
let directionChanged = false;
const appleImg = new Image();
const spriteImg = new Image();
const pathImg = new Image();

appleImg.src = "assets/red-sprite.svg";
spriteImg.src = "assets/snake-sprite.svg";
pathImg.src = "assets/path-sprite.svg";
pathImg.style.opacity = 0.5;
let prefs = new Prefs();
let game = new Game();
let screen = new ScreenElements();
window.onload = function () {
  ctx = screen.canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  intervalId = setInterval(gameLoop, 1000 / prefs.speed);
};
function resetGame() {
  screen.gameOverText.style.display = "none";
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
  clearInterval(intervalId);
  screen.gameOverText.style.display = "block";
}
function gameLoop() {
  moveSnake();
  checkCollision();
  draw();
}

function moveSnake() {
  game.direction = game.newDirection;
  if (game.direction == "right") {
    game.snake.posX.push(game.snake.posX.at(-1) + 1);
    game.snake.posY.push(game.snake.posY.at(-1));
  } else if (game.direction == "left") {
    game.snake.posX.push(game.snake.posX.at(-1) - 1);
    game.snake.posY.push(game.snake.posY.at(-1));
  } else if (game.direction == "up") {
    game.snake.posX.push(game.snake.posX.at(-1));
    game.snake.posY.push(game.snake.posY.at(-1) - 1);
  } else if (game.direction == "down") {
    game.snake.posX.push(game.snake.posX.at(-1));
    game.snake.posY.push(game.snake.posY.at(-1) + 1);
  }
  if (!eatedApple) {
    game.snake.posX.shift();
    game.snake.posY.shift();
  } else {
    eatedApple = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, screen.canvas.width, screen.canvas.height);

  ctx.fillStyle = "green";
  ctx.strokeStyle = "green";
  for (let i = 0; i < game.snake.posX.length; i++) {
    ctx.drawImage(
      spriteImg,
      game.snake.posX[i] * prefs.blockSize,
      game.snake.posY[i] * prefs.blockSize,
      prefs.blockSize,
      prefs.blockSize
    );
  }
  ///
  // switch (game.direction) {
  //   case "down":
  //     for (
  //       let i = game.snake.posY.at(-1) + 1, j = 0;
  //       i < prefs.heightInBlocks;
  //       i++, j++
  //     ) {
  //       for (
  //         let x = game.snake.posX.at(-1) - j;
  //         x <= game.snake.posX.at(-1) + j;
  //         x++
  //       ) {
  //         ctx.drawImage(
  //           pathImg,
  //           x * prefs.blockSize,
  //           i * prefs.blockSize,
  //           prefs.blockSize,
  //           prefs.blockSize
  //         );
  //       }
  //     }
  //     break;
  //   case "up":
  //     for (let y = game.snake.posY.at(-1) - 1, j = 0; y >= 0; y--, j++) {
  //       for (
  //         let x = game.snake.posX.at(-1) - j;
  //         x <= game.snake.posX.at(-1) + j;
  //         x++
  //       ) {
  //         ctx.drawImage(
  //           pathImg,
  //           x * prefs.blockSize,
  //           y * prefs.blockSize,
  //           prefs.blockSize,
  //           prefs.blockSize
  //         );
  //       }
  //     }
  //     break;
  //   case "left":
  //     for (let x = game.snake.posX.at(-1) - 1, j = 0; x >= 0; x--, j++) {
  //       for (
  //         let y = game.snake.posY.at(-1) - j;
  //         y <= game.snake.posY.at(-1) + j;
  //         y++
  //       ) {
  //         ctx.drawImage(
  //           pathImg,
  //           x * prefs.blockSize,
  //           y * prefs.blockSize,

  //           prefs.blockSize,
  //           prefs.blockSize
  //         );
  //       }
  //     }
  //     break;
  //   case "right":
  //     for (
  //       let x = game.snake.posX.at(-1) + 1, j = 0;
  //       x < prefs.widthInBlocks;
  //       x++, j++
  //     ) {
  //       for (
  //         let y = game.snake.posY.at(-1) - j;
  //         y <= game.snake.posY.at(-1) + j;
  //         y++
  //       ) {
  //         ctx.drawImage(
  //           pathImg,
  //           x * prefs.blockSize,
  //           y * prefs.blockSize,

  //           prefs.blockSize,
  //           prefs.blockSize
  //         );
  //       }
  //     }
  //     break;
  // }

  ctx.drawImage(
    appleImg,
    game.applePosX * prefs.blockSize,
    game.applePosY * prefs.blockSize,
    prefs.blockSize,
    prefs.blockSize
  );
  screen.scoreText.innerText = prefs.score;
  screen.speedText.innerText = prefs.speed;
}

function checkCollision() {
  let headPosX = game.snake.posX.at(-1);
  let headPosY = game.snake.posY.at(-1);
  ///   COLLISION WITH WALLS    ///
  if (headPosX > prefs.widthInBlocks - 1) {
    game.snake.posX[game.snake.posX.length - 1] = 0;
  } else if (headPosX < 0) {
    game.snake.posX[game.snake.posX.length - 1] = prefs.widthInBlocks - 1;
  } else if (headPosY < 0) {
    game.snake.posY[game.snake.posY.length - 1] = prefs.heightInBlocks - 1;
  } else if (headPosY > prefs.heightInBlocks - 1) {
    game.snake.posY[game.snake.posY.length - 1] = 0;
  }
  ///  COLLISION WHITH ITSELFS   /////

  for (let i = 0; i < game.snake.posX.length - 1; i++) {
    if (game.snake.posX[i] === headPosX && game.snake.posY[i] === headPosY)
      stopGame();
  }

  ///  COLLISION WITH APPLE    /////
  if (
    game.snake.posX.at(-1) == game.applePosX &&
    game.snake.posY.at(-1) == game.applePosY
  ) {
    prefs.score += prefs.speed * 10;
    eatedApple = true;
    playSound(500);

    spawnApple();
    if (prefs.score / (prefs.speed * 10) >= prefs.level * 5) {
      prefs.speed++;
      prefs.level++;
    }
  }
}

function spawnApple() {
  game.applePosX = Math.floor(Math.random() * prefs.widthInBlocks);
  game.applePosY = Math.floor(Math.random() * prefs.heightInBlocks);
}

document.addEventListener("keydown", function (event) {
  console.log(event.key);
  if (event.key == "ArrowRight" && game.direction != "left") {
    game.newDirection = "right";
  } else if (event.key == "ArrowLeft" && game.direction != "right") {
    game.newDirection = "left";
  } else if (event.key == "ArrowUp" && game.direction != "down") {
    game.newDirection = "up";
  } else if (event.key == "ArrowDown" && game.direction != "up") {
    game.newDirection = "down";
  } else if (event.key == "Enter") {
    stopGame();
    resetGame();
  }
});
