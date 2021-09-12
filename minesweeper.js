const FLIP_ANIMATION_DELAY = 2;
let currentFlipDuration = 0;
let isFlipping = false;
let tilesToFlip = [];

const board = [];
const tileSize = 45;
const height = 15;
const width = 20;

const numberOfBombs = 50;

const failedClick = { x: -1, y: -1 };

function setup() {
  createCanvas(width * tileSize, height * tileSize);
  generateBoard();
  placeBombs();
  setAdjecentBombNumber();
}

function generateBoard() {
  for (let x = 0; x < width; x++) {
    board[x] = [];
    for (let y = 0; y < height; y++) {
      board[x][y] = new Tile(x, y);
    }
  }
}

function placeBombs() {
  var placedBombs = 0;
  do {
    var x = Math.floor(random(width));
    var y = Math.floor(random(height));
    if (!board[x][y].hasBomb) {
      board[x][y].setBomb();
      placedBombs++;
    }
  } while (placedBombs < numberOfBombs);
}

function setAdjecentBombNumber() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      board[x][y].setBombNumber();
    }
  }
}

function drawHiddleTile(tile) {
  fill(150);
  rect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
}

function showBoard() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (board[x][y].hasBomb) {
        board[x][y].isVisible = true;
      }
    }
  }
}

function mouseClicked(event) {
  event.preventDefault();
  console.log(event);
  var x = Math.floor(mouseX / tileSize);
  var y = Math.floor(mouseY / tileSize);

  if (x >= 0 && x < width && y >= 0 && y < height && !isFlipping) {
    if (board[x][y].hasBomb) {
      failedClick.x = x;
      failedClick.y = y;
      showBoard();
      noLoop();
    } else {
      board[x][y].setVisible();
      tilesToFlip = board[x][y].getFlippableNeighbors();
      console.log(tilesToFlip);
      currentFlipDuration = 0;
      isFlipping = true;
    }
  }
}

function flipTiles() {
  let newTiles = [];
  for (const tile of tilesToFlip) {
    tile.setVisible();
  }

  for (const tile of tilesToFlip) {
    // TODO - Find a better way to do this..
    newTiles.push(...tile.getFlippableNeighbors().filter(x => newTiles.indexOf(x) === -1));
  }

  console.log(tilesToFlip.length);

  if (newTiles.length > 0) {
    tilesToFlip = newTiles;
    currentFlipDuration = 0;
  } else {
    isFlipping = false;
  }
}

function drawBoard() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      var tile = board[x][y];

      if (!tile.isVisible) {
        drawHiddleTile(tile);
      } else {
        fill(tile.x === failedClick.x && tile.y === failedClick.y ? 0 : 255);
        rect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
        if (tile.hasBomb) {
          fill(219, 33, 33);
          circle(
            tile.x * tileSize + tileSize / 2,
            tile.y * tileSize + tileSize / 2,
            tileSize / 2
          );
          continue;
        }
        if (tile.neighborsWithBombs !== 0) {
          fill(0);
          textSize(tileSize * 0.5);
          textAlign(CENTER, CENTER);
          text(
            tile.neighborsWithBombs,
            tile.x * tileSize + tileSize / 2,
            tile.y * tileSize + tileSize / 2
          );
        }
      }
    }
  }
}

function draw() {
  background(220);

  if (isFlipping) {
    currentFlipDuration++;
    if (currentFlipDuration >= FLIP_ANIMATION_DELAY) {
      flipTiles();
    }
  }

  drawBoard();
}
