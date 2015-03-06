var bind = function(fn, self) {
  return function(){ return fn.apply(self, arguments); };
}

var Painter;

Painter = (function() {
  function Painter(opctx, dctx) {
    this.onUp = bind(this.onUp, this);
    this.onMove = bind(this.onMove, this);
    this.onDown = bind(this.onDown, this);
    this.tools = {};
    this.toolNow = "";
    this.opctx = opctx;
    this.oppos = getDOMpos(this.opctx.canvas);
    this.dctx = dctx;
    this.opctx.lineCap = "round";
    this.opctx.lineJoin = "round";
    this.dctx.lineCap = "round";
    this.dctx.lineJoin = "round";
    this.his = [];
  }

  Painter.prototype.onDown = function(e) {
    e.preventDefault();
    if (this.toolNow in this.tools) {
      return this.tools[this.toolNow].onDown(getMouseDOM(e, this.oppos));
    }
    else {
      return console.log("Tool", this.toolNow, "doens't exist");
    }
  };

  Painter.prototype.onMove = function(e) {
    e.preventDefault();
    if (this.toolNow in this.tools) {
      return this.tools[this.toolNow].onMove(getMouseDOM(e, this.oppos));
    }
    else {
      return console.log("Tool", this.toolNow, "doens't exist");
    }
  };

  Painter.prototype.onUp = function(e) {
    e.preventDefault();
    if (this.toolNow in this.tools) {
      return this.tools[this.toolNow].onUp(getMouseDOM(e, this.oppos));
    }
    else {
      return console.log("Tool", this.toolNow, "doens't exist");
    }
  };

  Painter.prototype.registerTool = function(toolname, tool) {
    return this.tools[toolname] = new tool(this.opctx, this.dctx);
  };

  Painter.prototype.changeTool = function(toolname) {
    if (toolname in this.tools) {
      this.toolNow = toolname;
    }
  };

  Painter.prototype.undo = function() {
  };

  return Painter;

})();
