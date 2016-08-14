var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 270;
canvas.height = canvas.width*2;

var upKey = 38;
var downKey = 40;
var leftKey = 37;
var rightKey = 39;
var spacebar = 32;

var square1;
var square2;

var dev = 0;
var colorArray = ['empty', 'blue', 'red', 'green', 'yellow', 'purple'];


game = {
  score: 0,
  fps: 8,
  over: false,
  message: null,
  board: null,
  startTime: null,
  time: null,

  start: function() {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 8;
    game.board = new Array(6);
    game.startTime = new Date().getTime();

    for (var i = 0; i < 6; i++) {
      game.board[i] = new Array(12);
      for (var j = 0; j < 12; j++) {
        game.board[i][j] = 0;
      }
    }


    $(document).keydown(square1.move);
    square1.init();
  },

  stop: function() {
    game.over = true;
    $(document).off('keydown', square1.move);

    game.message = 'GAME OVER - ' + game.score + ' points';
    $('h1').html(game.message);
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
          game.drawBox(col * square1.size, row * square1.size, square1.size,
            colorArray[game.board[col][row]]);
        }
      }
    }
  },

  updateTimer: function() {
      game.time = parseInt((new Date().getTime()-game.startTime)/1000, 10);
      $('h1').html(game.time + 's | ' + game.score + ' points');
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
    if (dev) {
        console.log("checking " + row + " " + column);
        for (var i = 0; i < seen.length; i++) {
        	console.log(seen[i]);
        }
    }
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
    game.score+= 1/4;
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

  fall: function() {
  	for (var x = 0; x < 6; x++) {
  		var found = false;
  		var y = 0;
  		while (y < 12) {
  			if (game.board[x][y] != 0) {
  				found = true;
  			} else if (found) {
  				var start = y;
  				while (game.board[x][y] == 0 && y < 12) {
  					y++;
  				}
  				game.board[x].splice(start, y - start);
  				for (var i = 0; i < y - start; i++) {
  					game.board[x].unshift(0);
  				}
  			}
  			y++;
  		}
  	}
  	// Trigger a new deletion
  	var triggered = false;
  	for (var x = 0; x < 6; x++) {
  		for (var y = 0; y < 12; y++) {
  			if (game.checkConnect(y, x) >= 4) {
  				game.deleteChain(y, x);
  				triggered = true;
  			}
  		}
  	}
  	if (triggered) {
  		game.fall();
  	}
  }

};

var Blob = function blob() {

  this.size: canvas.width / 6;
  this.x: null;
  this.y: null;
  this.color: colorArray[Math.floor(Math.random() * colorArray.length)];
  var self = this;

  this.init: function() {
    self.color = colorArray[Math.floor(Math.random() * (colorArray.length-1)) + 1];
    self.x = canvas.width / 2;
    self.y = 0;
  };

  this.move: function(e) {
    key = e.keyCode;
    console.log(key);

    var row = Math.ceil(self.y/self.size);
    var col = Math.floor(self.x/self.size);

    if (dev) console.log(row + " " + col);
    if (key == leftKey && self.x >= self.size && game.board[col - 1][row] == 0) self.x -= self.size;
    else if (key == rightKey && self.x < canvas.width - self.size && game.board[col + 1][row] == 0) self.x += self.size;
    else if (key == downKey && self.y < canvas.height - self.size) self.y += self.size/10;
    else if (key == spacebar) self.drop();
  };

  this.draw: function() {
    game.drawBox(parseInt(self.x), parseInt(self.y), self.size, self.color);
  };

  this.drop: function() {
  	var col = Math.floor(self.x/self.size);
  	for (var i = 0; i < 13; i++) {
  		if (i == 12 || game.board[col][i] != 0) {
  			game.board[col][i-1] = colorArray.indexOf(self.color);
			// Check whether a chain is complete
			if (game.checkConnect(i-1, col) >= 4) {
				// Chain is complete
				game.deleteChain(i-1, col);
				game.fall();
			}
			// drop a new block
			self.init();
			return;
  		}
  	}
  };
};

function init() {
    var square1 = new Blob();
    var square2 = new Blob();
    // $(".retry").click(game.start);
    game.start();
    requestAnimationFrame(loop);

    game.draw();
    blob.draw();
}

var requestAnimationFrame =  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

/* Every tick, the block currently falling should
 * move one square further down and check for collision */
function loop() {
  if (game.over == false) {
    game.resetCanvas();
    game.updateTimer();
    var row = Math.floor(square1.y/square1.size);
    var col = Math.floor(square1.x/square1.size);
    if ((row == 11 ||
      game.board[col][row + 1] == 0) &&
      square1.y < canvas.height - square1.size) {
      // There is nothing below the blob
      square1.y += square1.size/10;
    } else {
      // Add the location to the board
      if (dev) console.log(col + " " + row + " " + colorArray.indexOf(square1.color));
      game.board[col][row] = colorArray.indexOf(square1.color);
      // Check whether a chain is complete
      if (game.checkConnect(row, col) >= 4) {
      	// Chain is complete
      	game.deleteChain(row, col);
      	game.fall();
      }

      if (row == 0) {
          game.stop();
          console.log(game.over);
          return;
      }
      // drop a new block
      square1.init();
    }

    square1.draw();
    game.draw();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
};

$( document ).ready(init);
