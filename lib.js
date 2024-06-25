const canvas = document.querySelector(`canvas`);
const ctx = canvas.getContext(`2d`);

const $score = document.querySelector(`span`);

const left = document.querySelector(`#left`);
const right = document.querySelector(`#right`);
const down = document.querySelector(`#down`);
const rotate = document.querySelector(`#rotate`);

const blockSize = 20;
const boardWidth = 14;
const boardHeight = 30;

const moves = { left: 65, right: 68, down: 83, rotate: 76 };

let score = 0;

const board = createBoard(boardWidth, boardHeight);

function createBoard(width, height) {
  return Array(height)
    .fill()
    .map(() => Array(width).fill(0));
}

const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

const pieces = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
];

canvas.width = blockSize * boardWidth;
canvas.height = blockSize * boardHeight;

ctx.scale(blockSize, blockSize);

const draw = () => {
  ctx.fillStyle = `#000`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        ctx.fillStyle = `yellow`;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        ctx.fillStyle = `red`;
        ctx.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });

  $score.innerText = score;
};

document.addEventListener(`keydown`, (event) => {
  if (event.keyCode === moves.left) {
    piece.position.x--;

    if (collision()) {
      piece.position.x++;
    }
  }

  if (event.keyCode === moves.right) {
    piece.position.x++;

    if (collision()) {
      piece.position.x--;
    }
  }

  if (event.keyCode === moves.down) {
    piece.position.y++;

    if (collision()) {
      piece.position.y--;
      solidify();
      removeRows();
    }
  }

  if (event.keyCode === moves.rotate) {
    const rotated = [];

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];

      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }

      rotated.push(row);
    }

    const previousShape = piece.shape;
    piece.shape = rotated;

    if (collision()) {
      piece.shape = previousShape;
    }
  }
});

left.addEventListener(`click`, () => {
  piece.position.x--;

  if (collision()) {
    piece.position.x++;
  }
});

right.addEventListener(`click`, () => {
  piece.position.x++;

  if (collision()) {
    piece.position.x--;
  }
});

down.addEventListener(`click`, () => {
  piece.position.y++;

  if (collision()) {
    piece.position.y--;
    solidify();
    removeRows();
  }
});

rotate.addEventListener(`click`, () => {
  const rotated = [];

  for (let i = 0; i < piece.shape[0].length; i++) {
    const row = [];

    for (let j = piece.shape.length - 1; j >= 0; j--) {
      row.push(piece.shape[j][i]);
    }

    rotated.push(row);
  }

  const previousShape = piece.shape;
  piece.shape = rotated;

  if (collision()) {
    piece.shape = previousShape;
  }
});

const collision = () => {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0
      );
    });
  });
};

const solidify = () => {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });

  piece.shape = pieces[Math.floor(Math.random() * pieces.length)];

  piece.position.x = Math.floor(boardWidth / 2 - 2);
  piece.position.y = 0;

  if (collision()) {
    window.alert(`Game Over`);

    board.forEach((row) => row.fill(0));
  }
};

const removeRows = () => {
  const rowToRemove = [];

  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowToRemove.push(y);
    }
  });

  rowToRemove.forEach((y) => {
    board.splice(y, 1);

    const newRow = Array(boardWidth).fill(0);
    board.unshift(newRow);

    score++;
  });
};

let dropCounter = 0;
let lastTime = 0;

const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;

  if (dropCounter > 1000) {
    piece.position.y++;
    dropCounter = 0;

    if (collision()) {
      piece.position.y--;
      solidify();
      removeRows();
    }
  }

  draw();

  window.requestAnimationFrame(update);
};

const $section = document.querySelector(`section`);

$section.addEventListener(`click`, () => {
  update();

  $section.remove();
  const audio = new window.Audio(`music.mp3`);
  audio.volume = 0.5;
  audio.play();
});
