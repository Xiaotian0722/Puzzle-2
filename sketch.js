let state = 'start'; // states: 'start', 'game', 'success'
let img, puz;
let pieces = [];
let board = [];
let pieceSize;
let draggingPiece = null;
let offsetX, offsetY;
let nextPageURL = 'https://xiaotian0722.github.io/Puzzle-3/';
let startButton, nextButton, cueButton;
let showCue = false;

function preload() {
  img = loadImage('pic/bg.png');
  puz = loadImage('pic/puzzle1.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pieceSize = min(width / 5, height / 5); // adjust the scale of every piece

  for (let i = 0; i < 9; i++) {
    pieces.push(new Piece(i % 3, Math.floor(i / 3)));
    board.push(null);
  }

  startButton = createButton('Start');
  startButton.position(width / 2 - 50, height / 2 + 200);
  startButton.size(100, 50);
  startButton.mousePressed(startGame);

  nextButton = createButton('Next🧩');
  nextButton.position(width / 2 - 50, pieceSize * 3 + 100);
  nextButton.size(100, 50);
  nextButton.mousePressed(goToNextPage);
  nextButton.hide(); // Initially hide the next button

  cueButton = createButton('Cue');
  cueButton.position(width - 100, 50);
  cueButton.size(50, 25);
  cueButton.mousePressed(toggleCue);
  cueButton.hide(); // Initially hide the cue button
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pieceSize = min(width / 5, height / 5); // adjust the scale of every piece
  startButton.position(width / 2 - 50, height / 2 + 100);
  nextButton.position(width / 2 - 50, height - 75);
  cueButton.position(width - 100, 50);
}

function startGame() {
  state = 'game';
  startButton.hide();
  cueButton.show();
}

function goToNextPage() {
  window.location.href = nextPageURL;
}

function toggleCue() {
  showCue = !showCue;
}

function draw() {
  background(255);
  if (state === 'start') {
    image(img, 100, height / 2, 300, 300);
    textSize(24);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Two more pieces to get!', width / 2, height / 2 -50);
    text('Drag the pieces and release with mouse.', width / 2, height / 2 + 25);
    text('Time is unlimited. You can enjoy solving all the mysteries!', width / 2, height / 2 + 100);
  } else if (state === 'game') {
    if (showCue) {
      image(puz, width / 2 - pieceSize * 1.5, height / 2 - pieceSize * 1.5, pieceSize * 3, pieceSize * 3);
    }
    drawBoard();
    drawPieces();
  } else if (state === 'success') {
    image(puz, width / 2 - pieceSize * 1.5, 0, pieceSize * 3, pieceSize * 3);
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('You found one of the lost pieces！', width / 2, pieceSize * 3 + 50);
    nextButton.show(); // Show the next button
    cueButton.hide(); // Hide the cue button
  }
}

function drawBoard() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      noFill();
      stroke(0);
      rect(i * pieceSize, j * pieceSize, pieceSize, pieceSize);
    }
  }
}

function drawPieces() {
  for (let piece of pieces) {
    if (piece !== draggingPiece) {
      piece.show();
    }
  }
  if (draggingPiece) {
    draggingPiece.show(mouseX - offsetX, mouseY - offsetY);
  }
}

function mousePressed() {
  if (state === 'game') {
    for (let piece of pieces) {
      if (piece.contains(mouseX, mouseY)) {
        draggingPiece = piece;
        offsetX = mouseX - piece.x;
        offsetY = mouseY - piece.y;

        // clear current location info of the dragged piece
        let x = Math.floor(piece.x / pieceSize);
        let y = Math.floor(piece.y / pieceSize);
        let index = x + y * 3;
        if (x >= 0 && x < 3 && y >= 0 && y < 3 && board[index] === piece) {
          board[index] = null;
        }

        break;
      }
    }
  }
}

function mouseReleased() {
  if (draggingPiece) {
    let x = Math.floor(mouseX / pieceSize);
    let y = Math.floor(mouseY / pieceSize);
    let index = x + y * 3;

    if (x >= 0 && x < 3 && y >= 0 && y < 3 && !board[index]) {
      draggingPiece.snap(x, y);
      board[index] = draggingPiece;
    } else {
      draggingPiece.reset();
    }

    draggingPiece = null;

    if (checkSuccess()) {
      state = 'success';
    }
  }
}

function checkSuccess() {
  for (let i = 0; i < 9; i++) {
    if (!board[i] || board[i].index !== i) {
      return false;
    }
  }
  return true;
}

class Piece {
  constructor(i, j) {
    this.correctX = i * pieceSize;
    this.correctY = j * pieceSize;
    this.index = i + j * 3;
    this.reset();
  }

  contains(px, py) {
    return px > this.x && px < this.x + pieceSize && py > this.y && py < this.y + pieceSize;
  }

  show(nx = this.x, ny = this.y) {
    image(puz, nx, ny, pieceSize, pieceSize, this.correctX, this.correctY, pieceSize, pieceSize);
    this.x = nx;
    this.y = ny;
  }

  snap(i, j) {
    this.x = i * pieceSize;
    this.y = j * pieceSize;
  }

  reset() {
    this.x = random(width / 2, width - pieceSize);
    this.y = random(0, height - pieceSize);
  }
}
