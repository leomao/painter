'use strict';

var bind = function(fn, self) {
  return function(){ return fn.apply(self, arguments); };
}

var Painter;

Painter = (function() {
  function Painter(opctx, bctx, dctx) {
    this.onMove = bind(this.onMove, this);
    this.onDown = bind(this.onDown, this);
    this.onUp = bind(this.onUp, this);
    this.shiftDown = bind(this.shiftDown, this);
    this.shiftUp = bind(this.shiftUp, this);
    this.tools = {};
    this.toolNow = "";
    this.opctx = opctx;
    this.bctx = bctx;
    this.dctx = dctx;
    var clear = function() {
      this.clearRect(0, 0,
                     this.canvas.width, this.canvas.height);
    }
    this.opctx.clear = clear;
    this.bctx.clear = clear;
    this.dctx.clear = clear;
    this.dctx.fillStyle = '#FFF';
    this.bctx.fillStyle = '#FFF';
    this.his = new Array();
    this.setLineWidth(5);
  }

  Painter.prototype.onDown = function(e) {
    this.oppos = getDOMpos(this.opctx.canvas);
    if (this.toolNow in this.tools) {
      if (e.target == this.opctx.canvas) {
        e.preventDefault();
        this.tools[this.toolNow].onDown(getMouseDOM(e, this.oppos));
        window.addEventListener("mousemove", this.onMove);
      }
    }
  };

  Painter.prototype.onMove = function(e) {
    this.oppos = getDOMpos(this.opctx.canvas);
    e.preventDefault();
    if (this.toolNow in this.tools) {
      this.tools[this.toolNow].onMove(getMouseDOM(e, this.oppos));
    }
  };

  Painter.prototype.onUp = function(e) {
    this.oppos = getDOMpos(this.opctx.canvas);
    if (this.toolNow in this.tools) {
      e.preventDefault();
      this.tools[this.toolNow].onUp(getMouseDOM(e, this.oppos));
      window.removeEventListener("mousemove", this.onMove);
    }
  };

  Painter.prototype.shiftDown = function() {
    console.log("shift down");
    if (this.toolNow in this.tools) {
      this.tools[this.toolNow].shiftDown();
    }
  }

  Painter.prototype.shiftUp = function() {
    console.log("shift up");
    if (this.toolNow in this.tools) {
      this.tools[this.toolNow].shiftUp();
    }
  }

  Painter.prototype.registerTool = function(toolname, tool) {
    return this.tools[toolname] = new tool(this, this.opctx, this.bctx,
                                           this.dctx);
  };

  Painter.prototype.changeTool = function(toolname) {
    if (toolname in this.tools) {
      if (this.tools[this.toolNow])
        this.tools[this.toolNow].finish();
      this.toolNow = toolname;
      this.tools[toolname].init();
    }
    else {
      console.log("Tool doesn't exist");
    }
  };

  Painter.prototype.getStyle = function() {
    // implement by user
  }

  Painter.prototype.setFrontColor = function(color) {
    this.dctx.strokeStyle = color;
    this.bctx.strokeStyle = color;
  };

  Painter.prototype.setBackColor = function(color) {
    this.dctx.fillStyle = color;
    this.bctx.fillStyle = color;
  };

  Painter.prototype.setLineWidth = function(width) {
    this.dctx.lineWidth = width;
    this.bctx.lineWidth = width;
  }

  Painter.prototype.undo = function() {
    if (this.his.length) {
      this.dctx.putImageData(this.his.pop(), 0, 0);
    }
  };

  Painter.prototype.addHis = function() {
    if (this.his.length >= 50)
      this.his.shift();
    var image = this.dctx.getImageData(0, 0, this.dctx.canvas.width,
                                       this.dctx.canvas.height);
    this.his.push(image);
  };

  Painter.prototype.clear = function() {
    this.dctx.clearRect(0, 0,
                        this.dctx.canvas.width, this.dctx.canvas.height);
  };

  return Painter;

})();
