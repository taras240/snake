export function test() {
  console.log("export");
}
export class Prefs {
  blockSize = 20;
  widthInBlocks;
  heightInBlocks;
  startScore = 0;
  score;
  level = 1;
  speed;
  constructor() {
    this.blockSize = 20;
    this.widthInBlocks = 600 / this.blockSize;
    this.heightInBlocks = 600 / this.blockSize;
    this.score = this.startScore;
    this.level = 1;
    this.speed = 4;
  }
}
export class Game {
  startSnakePosX = [10, 11, 12, 13, 14];
  startSnakePosY = [10, 10, 10, 10, 10];
  snake = new Snake();
  applePosX = 15;
  applePosY = 0;
  direction = "right";
  newDirection = "right";
}
class Snake {
  posX = [10, 11, 12, 13, 14];
  posY = [10, 10, 10, 10, 10];
}
export function playSound(frequency) {
  var context = new AudioContext();
  var oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = 440;
  oscillator.connect(context.destination);
  oscillator.start();
  // Beep for 500 milliseconds
  setTimeout(function () {
    oscillator.stop();
  }, 150);
}
export class ScreenElements {
  speedText = document.querySelector(".game-speed_value");
  scoreText = document.querySelector(".game-score_value");
  gameOverText = document.querySelector(".game-over-text");
  canvas = document.getElementById("gameCanvas");
}
