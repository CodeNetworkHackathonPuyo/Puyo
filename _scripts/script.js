var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 270;
canvas.height = canvas.width*2;

var upKey = 38;
var downKey = 40;
var leftKey = 37;
var rightKey = 39;
var spacebar = 32;
var pauseKeys = [27, 80];
var rotateCw = 68;
var rotateCcw = 83;
var spriteSwitch = [49, 50, 51];

var requestAnimationFrame =  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

var square1;
var square2;
var spriteArray = ['boxes', 'puyo', 'sonic'];
var sprite = spriteArray[0];
var dev = 0;
var colorArray = ['empty', 'blue', 'red', 'green', 'yellow', 'purple'];


game = {
  score: 0,
  fps: 8,
  over: false,
  paused: false,
  message: null,
  board: null,
  startTime: null,
  time: null,

  start: function() {
    game.over = false;
    game.paused = false;
    game.message = null;
    game.score = 0;
    game.chains = 0;
    game.fps = 8;
    game.board = new Array(6);
    game.startTime = new Date().getTime();

    for (var i = 0; i < 6; i++) {
      game.board[i] = new Array(12);
      for (var j = 0; j < 12; j++) {
        game.board[i][j] = 0;
      }
    }


    $(document).keydown(move);
    $('#canvas').on('touchstart', touch);
    square1.init(1);
  },

  stop: function() {
    game.over = true;
    $(document).off('keydown', square1.move);

    game.message = 'GAME OVER - ' + game.score + ' points';
    $('h1').html(game.message);
  },

  pause: function() {
      game.paused = !game.paused;
      game.message = 'PAUSED - Press esc or p key to continue';
      $('h1').html(game.message);
  },

  drawSprite: function(x, y, size, color) {
    var sx = 60, sy = 223;
    var sw = 65, sh = 65;

    switch (sprite) {
        case 'boxes':
            ctx.fillStyle = color;
            ctx.fillRect(x, y, size, size);
            break;

        case 'puyo':
            var puyoImg = $('#puyo')[0];

            switch (color) {
                case 'red':
                    sx = 60 + sw*0 + 5;
                    break;
                case 'green':
                    sx = 60 + sw*1 + 3;
                    break;
                case 'blue':
                    sx = 60 + sw*2 + 4;
                    break;
                case 'yellow':
                    sx = 60 + sw*3 + 1;
                    break;
                case 'purple':
                    sx = 60 + sw*4;
                    break;
                default:
            }
            ctx.drawImage(puyoImg, sx, sy, sw, sh, x, y, size, size);
            break;

        case 'sonic':
            var sonicImg = $('#sonic')[0];

            switch (color) {
                case 'red':
                    sx = 60 + sw*0;
                    break;
                case 'green':
                    sx = 60 + sw*1 + 2;
                    break;
                case 'blue':
                    sx = 60 + sw*2 + 2;
                    break;
                case 'yellow':
                    sx = 60 + sw*3 + 1;
                    break;
                case 'purple':
                    sx = 60 + sw*4;
                    break;
                default:
            }
            ctx.drawImage(sonicImg, sx, sy, sw, sh, x, y, size, size);
            break;

        default:
    }

  },

  resetCanvas: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },

  draw: function() {
    for (var col = 0; col < 6; col++) {
      for (var row = 0; row < 12; row++) {
        if (game.board[col][row] != 0) {
          game.drawSprite(col * square1.size, row * square1.size, square1.size,
            colorArray[game.board[col][row]]);
        }
      }
    }
  },

  updateTimer: function() {
      game.time = parseInt((new Date().getTime()-game.startTime)/1000, 10);
      $('h1').html(game.time + 's | ' + game.score + ' points | ' + game.chains + ' current combo');
  },

  /* Check for connections, and delete if greater than 4.
   * Returns true is items were deleted */
  checkDelete: function(row, col) {
    var blobsConnected = game.checkConnect(row, col);
    if (blobsConnected >= 4) {
        game.score += (blobsConnected - 3);
        // Chain is complete
        game.deleteChain(row, col);
        return true;
    } else {
        return false;
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
                game.chains += 1;
  			}
  		}
  	}
  	if (triggered) {
  		game.fall();
  	}
  }

};

var Blob = function blob() {

  this.size = canvas.width / 6;
  this.speed = (this.size + game.time)/10;
  this.x = null;
  this.y = null;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.type = null;
  var self = this;

  this.init = function(type) {
    self.color = colorArray[Math.floor(Math.random() * (colorArray.length-1)) + 1];
    if (type == 1) {
    	self.x = canvas.width / 2;
    } else if (type == 2) {
    	self.x = canvas.width / 2 - self.size;
    }
    self.type = type;
    self.y = -self.size;
  };

  this.draw = function() {
    if (sprite == 'sonic') self.speed = (this.size + game.time)/5;
    else self.speed = (this.size + game.time)/10;

    game.drawSprite(parseInt(self.x), parseInt(self.y), self.size, self.color);
  };

  this.drop = function() {
  	var col = Math.floor(self.x/self.size);
  	for (var i = 0; i < 13; i++) {
  		if (i == 12 || game.board[col][i] != 0) {
  			game.board[col][i-1] = colorArray.indexOf(self.color);
            return i-1;
        }
  	}
  };
};

function init() {
    square1 = new Blob();
    square2 = new Blob();
    square1.init(1)
    square2.init(2);
    // $(".retry").click(game.start);
    game.start();
    requestAnimationFrame(loop);

    game.draw();
    square1.draw();
    square2.draw();
};

function move(e) {
	key = e.keyCode;
	console.log(key);

	if (canMove("left", key)) {
        square1.x -= square1.size;
        square2.x -= square1.size;
    } else if (canMove("right", key)) {
        square1.x += square1.size;
        square2.x += square2.size;
    } else if (canMove("down", key)) {
        square1.y += square1.speed*4;
        square2.y += square2.speed*4;
    } else if (key == spacebar) {
        if (square1.y > square2.y) {
            var loc1 = square1.drop();
            var col = square1.x/square1.size;
            var loc2 = square2.drop();
            var col2 = square2.x/square2.size;
            var wasDeleted = game.checkDelete(loc1, col);
            wasDeleted |= game.checkDelete(loc2, col2);
            // Wrap the following lines in a setTimeout()
            var time = wasDeleted ? 500 : 0;
            // drop a new block
            square1.init(square1.type);
            square2.init(square2.type);
            game.resetCanvas();
            game.draw();
            game.pause();
            setTimeout(function() {
                game.fall();
                game.pause();
            }, time);
        } else {
            var loc1 = square2.drop();
            var col = square2.x/square2.size;
            var loc2 = square1.drop();
            var col2 = square1.x/square1.size;
            var wasDeleted = game.checkDelete(loc1, col);
            wasDeleted |= game.checkDelete(loc2, col2);
            var time = wasDeleted ? 500 : 0;
            // drop a new block
            square1.init(square1.type);
            square2.init(square2.type);
            game.resetCanvas();
            game.draw();
            game.pause();
            setTimeout(function() {
                game.fall();
                game.pause();
            }, time);
        }
    } else if (pauseKeys.indexOf(key) > -1) {
        game.pause();
    } else if (key == rotateCw) {
        rotate("cw");
    } else if (key == rotateCcw) {
        rotate("ccw");
    } else if (spriteSwitch.indexOf(key) > -1) {
        console.log(spriteSwitch.indexOf(key));
        sprite = spriteArray[spriteSwitch.indexOf(key)];
    }
};

function touch(e) {
  console.log(e);
  if (e.pageX > canvas.width/2) {
    move(rightKey);
  } else {
    move(leftKey);
  }
}

function rotate(direction) {
    var row = Math.ceil(square1.y/square1.size);
    var row2 = Math.ceil(square2.y/square2.size);
    var col = Math.floor(square1.x/square1.size);
    var col2 = Math.floor(square2.x/square2.size);
    // Determine orientation
    if (row == row2 && col2 > col) {
        // sq1 sq2
        if (direction == "cw" &&
            row < 11 &&
            game.board[col][row + 1] == 0) {
            square2.x -= square2.size;
            square2.y += square2.size;
        } else if (direction == "ccw") {
            square2.x -= square2.size;
            square2.y -= square2.size;
        }
    } else if (row == row2 && col2 < col) {
        // sq2 sq1
        if (direction == "cw") {
            square2.x += square2.size;
            square2.y -= square2.size;
        } else if (direction == "ccw" &&
            row < 11 &&
            game.board[col][row + 1] == 0) {
            square2.x += square2.size;
            square2.y += square2.size;
        }
    } else if (col == col2 && row2 > row) {
        // sq1
        // sq2
        if (direction == "cw" &&
            col != 0 &&
            game.board[col - 1][row] == 0) {
            square2.x -= square2.size;
            square2.y -= square2.size;
        } else if (direction == "ccw" &&
            col != 5 &&
            game.board[col + 1][row] == 0) {
            square2.x += square2.size;
            square2.y -= square2.size;
        }
    } else if (col == col2 && row2 < row) {
        // sq2
        // sq1
        if (direction == "cw" &&
            col != 5 &&
            game.board[col + 1][row] == 0) {
            square2.x += square2.size;
            square2.y += square2.size;
        } else if (direction == "ccw" &&
            col != 0 &&
            game.board[col - 1][row] == 0) {
            square2.x -= square2.size;
            square2.y += square2.size;
        }
    }
};

function canMove(direction, key) {
	var row = Math.ceil(square1.y/square1.size);
	var row2 = Math.ceil(square2.y/square2.size);
    var col = Math.floor(square1.x/square1.size);
    var col2 = Math.floor(square2.x/square2.size);
    if (direction == "left" && key == leftKey) {
    	if (row == row2) {
    		return Math.min(col, col2) > 0 && game.board[Math.min(col, col2) - 1][row] == 0;
    	} else {
    		return col > 0 && game.board[col - 1][row] == 0 && game.board[col - 1][row2] == 0;
    	}
    } else if (direction == "right" && key == rightKey) {
    	if (row == row2) {
    		return Math.max(col, col2) < 5 && game.board[Math.max(col, col2) + 1][row] == 0;
    	} else {
    		return col < 5 && game.board[col + 1][row] == 0 && game.board[col + 1][row2] == 0;
    	}
    } else if (direction == "down" && key == downKey) {
    	return Math.max(row, row2) < 11;
    }
    return false;
}

/* Every tick, the block currently falling should
 * move one square further down and check for collision */
function loop() {
  if (game.over == false && game.paused == false) {
    game.resetCanvas();
    game.updateTimer();
    var row = Math.floor(square1.y/square1.size);
    var row2 = Math.floor(square2.y/square2.size);
    var col = Math.floor(square1.x/square1.size);
    var col2 = Math.floor(square2.x/square2.size);
    if ((Math.max(row, row2) == 11 ||
    	(col == col2 && game.board[col][Math.max(row, row2) + 1] == 0) ||
    	col != col2 && game.board[col][row + 1] == 0 && game.board[col2][row2 + 1] == 0) &&
      Math.max(square1.y, square2.y) < canvas.height - square1.size) {
      // There is nothing below the blob
      square1.y += square1.speed;
      square2.y += square2.speed;
    } else {
        // Add the location to the board
        if (dev) console.log(col + " " + row + " " + colorArray.indexOf(square1.color));
        if (col == col2) {
            game.board[col][row] = colorArray.indexOf(square1.color);
            game.board[col2][row2] = colorArray.indexOf(square2.color);
        } else if (game.board[col][row + 1] != 0) {
            game.board[col][row] = colorArray.indexOf(square1.color);
            square2.drop();
        } else if (game.board[col2][row2 + 1] != 0) {
            game.board[col2][row2] = colorArray.indexOf(square2.color);
            square1.drop();
        }
        var wasDeleted = game.checkDelete(row, col);
        wasDeleted |= game.checkDelete(row2, col2);
        // Wrap the following lines in a setTimeout()
        var time = wasDeleted ? 200 : 0;
        // drop a new block
        game.resetCanvas();
        game.draw();
        game.pause();
        setTimeout(function() {
            game.fall();
            game.pause();
        }, time);

        if (row == 0) {
            game.stop();
            console.log(game.over);
            return;
        }
        // drop a new block
        square1.init(1);
        square2.init(2);
    }

    square1.draw();
    square2.draw();
    game.draw();
    game.chains = 0;
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
};

$( document ).ready(init);
