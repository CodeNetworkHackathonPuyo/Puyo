var Input = function input() {
  this.pressedKeys = {
    u: false,
    d: false,
    l: false,
    r: false,
    s: false,
  }

  this.mouseX = -1;
  this.mouseY = -1;

  this.windowHeight = window.innerHeight;
  this.windowWidth = window.innerWidth;

  this.keyArray = this._keyMap();

  var self = this;
  this._onKeyDown = function(event){ self._keyChange(event, true); };
  this._onKeyUp = function(event){ self._keyChange(event, false); };
  this._onMouseDown = function(event){ self._mouseChange(event, true); };
  this._onMouseUp = function(event){ self._mouseChange(event, false); };
  this._onMouseMove = function(event){ self._mouseMove(event); };

  window.addEventListener('keydown', this._onKeyDown, false);
  window.addEventListener('keyup', this._onKeyUp, false);
};

Input.prototype._keyChange = function(event, pressed) {
  this.pressedKeys[this.keyArray[event.keyCode]] = pressed;
};

Input.prototype._keyMap = function(){
  var keyMap = [];

  // Key map, index is keyCode, value is json key in this.pressedKeys
  keyMap[32] = "s";
  keyMap[37] = "l";
  keyMap[39] = "r";
  keyMap[40] = "d";
  keyMap[38] = "u";

  return keyMap
}

// Use for local gameloop input
Input.prototype.getInput = function(){
  return this.pressedKeys;
}

var input = new Input();

console.log(input.getInput());
