var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var upKey = 38;
var downKey = 40;
var leftKey = 37;
var rightKey = 39;

game = {

  score: 0,
  fps: 8,
  over: false,
  message: null,
  board: null,

  start: function() {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 8;
    game.board = new Array(HEIGHT);
    for (var i = 0; i < HEIGHT; i++) {
      game.board[i] = new Array(WIDTH);
      for (var j = 0; j < WIDTH; j++) {
        game.board[i][j] = 0;
      }
    }
    blob.init();
  },

  stop: function() {
    game.over = true;
    game.message = 'GAME OVER - PRESS SPACEBAR';
  },

  drawBox: function(x, y, size, color) {
    console.log(x + " " + y + " " + color);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - (size / 2), y - (size / 2));
    ctx.lineTo(x + (size / 2), y - (size / 2));
    ctx.lineTo(x + (size / 2), y + (size / 2));
    ctx.lineTo(x - (size / 2), y + (size / 2));
    ctx.closePath();
    ctx.fill();
  },

  resetCanvas: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  draw: function() {
    for (var row = 0; row < 12; row++) {
      for (var col = 0; col < 6; col++) {
        if (game.board[row][col] != 0) {
          game.drawBox((col + 0.5) * canvas.width/6, (row + 0.5) * canvas.height/12, canvas.width/6,
            Object.keys(ColorsEnum)[game.board[row][col]]);
        }
      }
    }
  },

  /* This returns an int, based on how many cells of the same colour are adjacent
  * to the initial argument to this function. Seen represents already checked cells,
  * to prevent loops */
  checkConnect: function(row, column, seen=[]) {
    colour = board[row][column];
    if (colour == 0) {
      return 0;
    }
    seen.push((row, column));
    console.log(seen);
    sum = 1;
    var offsets = [-1, 1];
    for (var i = 0; i < 4; i++) {
      var rowMod = i < 2 ? offsets[i] : 0;
      var colMod = i < 2 ? 0 : offsets[i-2];
      if (board[row + rowMod][column + colMod] == colour && 
        !(seen.indexOf((row + rowMod, column + colMod)) > -1)) {
        sum += checkConnect(row + rowMod, column + colMod, seen);
      }
    }
    return sum;
  },

};

var ColorsEnum = Object.freeze({"empty": 0, "blue": 1, "red": 2, "green": 3, "yellow": 4, "purple": 5});

blob = {

  size: canvas.width / 6,
  x: null,
  y: null,
  color: '#0F0',
  colorEnum: ColorsEnum.green,

  init: function() {
    blob.x = canvas.width / 2 + blob.size / 2;
    blob.y = blob.size / 2;
  },

  move: function(e) {
    key = e.keyCode;
    console.log(key);

    if (key == leftKey && blob.x > blob.size) blob.x -= blob.size;
    else if (key == rightKey && blob.x < canvas.width - blob.size) blob.x += blob.size;
    else if (key == downKey && blob.y < canvas.height - blob.size/2) blob.y += blob.size/10;
  },

  draw: function() {
    game.drawBox(parseInt(blob.x), parseInt(blob.y), blob.size, blob.color);
  }
};


function init() {

    document.addEventListener('keydown', blob.move);

    game.start();
    blob.draw();
    game.draw();

}

var requestAnimationFrame =  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

/* Every tick, the block currently falling should
 * move one square further down and check for collision */
function loop() {
  if (game.over == false) {
    game.resetCanvas();
    if ((Math.floor(blob.y/(canvas.height/12) - 0.5) == 11 || 
      game.board[Math.floor(blob.y/(canvas.height/12) - 0.5) + 1][Math.floor(blob.x/(canvas.width/6))] == 0) && 
      blob.y < canvas.height - blob.size/2) {
      // There is nothing below the blob
      blob.y += blob.size/50;
    } else {
      // Add the location to the board
      game.board[Math.floor(blob.y/(canvas.height/12))][Math.floor(blob.x/(canvas.width/6))] = blob.colorEnum;
      // drop a new block
      console.log("Resetting");
      blob.init();
    }

    blob.draw();
    game.draw();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
};


window.addEventListener('load', init);

requestAnimationFrame(loop);