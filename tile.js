const NEIGHBOR_OPTIONS = [
  { x: 0, y: -1 }, // UP
  { x: 1, y: -1 }, // UP RIGHT
  { x: 1, y: 0 }, // RIGHT
  { x: 1, y: 1 }, // RIGHT DOWN
  { x: 0, y: 1 }, // DOWN
  { x: -1, y: 1 }, // LEFT DOWN
  { x: -1, y: 0 }, // LEFT
  { x: -1, y: -1 }, // LEFT UP
];

class Tile {
  x;
  y;
  hasBomb;
  isVisible = false;
  neighborsWithBombs = 0;

  constructor(x, y, hasBomb) {
    this.x = x;
    this.y = y;
    this.hasBomb = hasBomb;
  }

  setVisible() {
    this.isVisible = true;
    if (!this.hasBomb && this.neighborsWithBombs === 0) {
      for (const pos of this.getNeighbors()) {
        if (!board[pos.x][pos.y].isVisible && !board[pos.x][pos.y].hasBomb) {
          board[pos.x][pos.y].setVisible();
        }
      }
    }
  }

  getNeighbors() {
    const n = [];
    for (const option of NEIGHBOR_OPTIONS) {
      const pos = { x: this.x + option.x, y: this.y + option.y };
      if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
        continue;
      }
      n.push(pos);
    }
    return n;
  }

  setBombNumber() {
    for (const pos of this.getNeighbors()) {
      if (board[pos.x][pos.y].hasBomb) {
        this.neighborsWithBombs++;
      }
    }
  }
}
