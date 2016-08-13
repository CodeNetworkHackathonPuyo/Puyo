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
    game.board = new Array(6);
    for (var i = 0; i < 6; i++) {
      game.board[i] = new Array(12);
      for (var j = 0; j < 12; j++) {
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
    ctx.fillStyle = color;
    ctx.fillRect(x,y, size, size);
  },

  resetCanvas: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  draw: function() {
    for (var col = 0; col < 6; col++) {
      for (var row = 0; row < 12; row++) {
        if (game.board[col][row] != 0) {
          game.drawBox(col * blob.size, row * blob.size, blob.size,
            colorArray[game.board[col][row]]);
        }
      }
    }
  },

  /* This returns an int, based on how many cells of the same colour are adjacent
  * to the initial argument to this function. Seen represents already checked cells,
  * to prevent loops */
  checkConnect: function(row, column, seen=[]) {
    colour = game.board[column][row];
    if (colour == 0) {
      return 0;
    }
    seen.push({"row": row, "col": column});
    console.log(seen);
    sum = 1;
    var offsets = [-1, 1];
    for (var i = 0; i < 4; i++) {
      var rowMod = i < 2 ? offsets[i] : 0;
      var colMod = i < 2 ? 0 : offsets[i-2];
      if (row + rowMod > 11 || row + rowMod < 0 || column + colMod > 5 || column + colMod < 0) {
      	continue;
      }
      if (game.board[column + colMod][row + rowMod] == colour &&
        seen.filter(function(e) {return e.row == row + rowMod && e.col == column + colMod;}).length == 0) {
        sum += game.checkConnect(row + rowMod, column + colMod, seen);
      }
    }
    return sum;
  },

  deleteChain: function(row, col) {
    colour = game.board[col][row];
    game.board[col][row] = 0;
  	var offsets = [-1, 1];
    for (var i = 0; i < 4; i++) {
      var rowMod = i < 2 ? offsets[i] : 0;
      var colMod = i < 2 ? 0 : offsets[i-2];
      if (row + rowMod > 11 || row + rowMod < 0 || col + colMod > 5 || col + colMod < 0) {
      	continue;
      }
      if (game.board[col + colMod][row + rowMod] == colour) {
      	game.deleteChain(row + rowMod, col + colMod);
      }
    }
  },

};

var colorArray = ['empty', 'blue', 'red', 'green', 'yellow', 'purple'];

blob = {

  size: canvas.width / 6,
  x: null,
  y: null,
  color: colorArray[Math.floor(Math.random() * colorArray.length)],

  init: function() {
    blob.color = colorArray[Math.floor(Math.random() * (colorArray.length-1)) + 1];
    blob.x = canvas.width / 2;
    blob.y = 0;
  },

  move: function(e) {
    key = e.keyCode;
    console.log(key);

    var row = Math.ceil(blob.y/blob.size);
    var col = Math.floor(blob.x/blob.size);

    console.log(row + " " + col);
    if (key == leftKey && blob.x >= blob.size && game.board[col - 1][row] == 0) blob.x -= blob.size;
    else if (key == rightKey && blob.x < canvas.width - blob.size && game.board[col + 1][row] == 0) blob.x += blob.size;
    else if (key == downKey && blob.y < canvas.height - blob.size) blob.y += blob.size/10;
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
    var row = Math.floor(blob.y/blob.size);
    var col = Math.floor(blob.x/blob.size);
    if ((row == 11 ||
      game.board[col][row + 1] == 0) &&
      blob.y < canvas.height - blob.size) {
      // There is nothing below the blob
      blob.y += blob.size/50;
    } else {
      // Add the location to the board
      console.log(col + " " + row + " " + colorArray.indexOf(blob.color));
      game.board[col][row] = colorArray.indexOf(blob.color);
      // Check whether a chain is complete
      if (game.checkConnect(row, col) >= 4) {
      	// Chain is complete
      	game.deleteChain(row, col);
      }
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
