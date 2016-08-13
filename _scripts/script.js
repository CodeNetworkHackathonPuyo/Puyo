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

  start: function() {
    game.over = false;
    game.message = null;
    game.score = 0;
    game.fps = 8;
    blob.init();
  },

  stop: function() {
    game.over = true;
    game.message = 'GAME OVER - PRESS SPACEBAR';
  },

  drawBox: function(x, y, size, color) {
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
  }

};

blob = {

  size: canvas.width / 6,
  x: null,
  y: null,
  color: '#0F0',

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

}

var requestAnimationFrame =  window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame;

function loop() {
  if (game.over == false) {
    game.resetCanvas();

    if (blob.y < canvas.height - blob.size/2) blob.y += blob.size/50;

    blob.draw();
  }
  setTimeout(function() {
    requestAnimationFrame(loop);
  }, 1000 / game.fps);
};

requestAnimationFrame(loop);

window.addEventListener('load', init);
