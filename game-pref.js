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
  snakePosX = [10, 11, 12, 13, 14];
  snakePosY = [10, 10, 10, 10, 10];
}
