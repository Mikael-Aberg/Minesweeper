const board = [];
const tileSize = 45;
const height = 20;
const width = 20;

const bombChance = 0.15;

const failedClick = { x: -1, y: -1 };

function setup() {
  createCanvas(height * tileSize, width * tileSize);
  generateBoard();
}

function generateBoard() {
  for (let x = 0; x < width; x++) {
    board[x] = [];
    for (let y = 0; y < height; y++) {
      board[x][y] = new Tile(x, y, Math.random() <= bombChance);
    }
  }

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

function mouseClicked() {
  var x = Math.floor(mouseX / tileSize);
  var y = Math.floor(mouseY / tileSize);

  if (x >= 0 && x < width && y >= 0 && y < height) {
    if (board[x][y].hasBomb) {
      failedClick.x = x;
      failedClick.y = y;
      showBoard();
      noLoop();
    }

    board[x][y].setVisible();
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
  drawBoard();
}
