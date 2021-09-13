const FLIP_ANIMATION_DELAY = 2;
let currentFlipDuration = 0;
let isFlipping = false;
let tilesToFlip = [];

const board = [];
const tileSize = 45;
const height = 15;
const width = 20;

const numberOfBombs = 50;

const shadowHeight = 7;

const failedClick = {
    x: -1,
    y: -1
};

function setup() {
    createCanvas(width * tileSize, height * tileSize);
    generateBoard();
    placeBombs();
    setAdjacentBombNumber();
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

function setAdjacentBombNumber() {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            board[x][y].setBombNumber();
        }
    }
}

function drawHiddenTile(tile) {
    fill('#c0c0c0');
    // Draw center of tile
    rect((tile.x * tileSize) + shadowHeight, (tile.y * tileSize) + shadowHeight, tileSize - shadowHeight * 2, tileSize - shadowHeight * 2);

    // Draw edges of tile
    strokeWeight(1);
    fill("#f5f5f5");
    stroke('#a6a6a6');
    drawTileTopEdge(tile);
    drawTileLeftEdge(tile);
    stroke('#706f6f');
    fill("#808080");
    drawTileRightEdge(tile);
    drawTileBottomEdge(tile);

}

function drawTileTopEdge(tile) {
    beginShape();
    vertex((tile.x * tileSize), (tile.y * tileSize));
    vertex((tile.x * tileSize) + tileSize, (tile.y * tileSize));
    vertex((tile.x * tileSize) + tileSize - shadowHeight, (tile.y * tileSize) + shadowHeight);
    vertex((tile.x * tileSize) + shadowHeight, (tile.y * tileSize) + shadowHeight);
    endShape(CLOSE);
}

function drawTileLeftEdge(tile) {
    beginShape();
    vertex((tile.x * tileSize), (tile.y * tileSize));
    vertex((tile.x * tileSize), (tile.y * tileSize) + tileSize);
    vertex((tile.x * tileSize) + shadowHeight, (tile.y * tileSize) + tileSize - shadowHeight);
    vertex((tile.x * tileSize) + shadowHeight, (tile.y * tileSize) + shadowHeight);
    endShape(CLOSE);
}

function drawTileBottomEdge(tile) {
    beginShape();
    vertex((tile.x * tileSize), (tile.y * tileSize) + tileSize);
    vertex((tile.x * tileSize) + tileSize, (tile.y * tileSize) + tileSize);
    vertex((tile.x * tileSize) + tileSize - shadowHeight, (tile.y * tileSize) + tileSize - shadowHeight);
    vertex((tile.x * tileSize) + shadowHeight, (tile.y * tileSize) + tileSize - shadowHeight);
    endShape(CLOSE);
}

function drawTileRightEdge(tile) {
    beginShape();
    vertex((tile.x * tileSize) + tileSize, (tile.y * tileSize));
    vertex((tile.x * tileSize) + tileSize - shadowHeight, (tile.y * tileSize) + shadowHeight);
    vertex((tile.x * tileSize) + tileSize - shadowHeight, (tile.y * tileSize) - shadowHeight + tileSize);
    vertex((tile.x * tileSize) + tileSize, (tile.y * tileSize) + tileSize);
    endShape(CLOSE);
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
                drawHiddenTile(tile);
            } else {
                fill(tile.x === failedClick.x && tile.y === failedClick.y ? 0 : 255);
                strokeWeight(2);
                stroke('#474747');
                rect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
                if (tile.hasBomb) {
                    strokeWeight(0);
                    fill(219, 33, 33);
                    circle(
                        tile.x * tileSize + tileSize / 2,
                        tile.y * tileSize + tileSize / 2,
                        tileSize / 2
                    );
                    continue;
                }
                if (tile.neighborsWithBombs !== 0) {
                    strokeWeight(0);
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
    background(100);

    if (isFlipping) {
        currentFlipDuration++;
        if (currentFlipDuration >= FLIP_ANIMATION_DELAY) {
            flipTiles();
        }
    }

    drawBoard();
}