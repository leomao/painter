'use strict';

var pRect;

pRect = (function() {
  var Tool = function(painter, opctx, bctx, dctx) {
    this.painter = painter;
    this.opctx = opctx;
    this.bctx = bctx;
    this.dctx = dctx;
    this.getPos = function(pos) {
      if (this.fixside) {
        var d = pos.subtract(this.from);
        var side = Math.abs(d.x) > Math.abs(d.y) ? Math.abs(d.x) : Math.abs(d.y);
        pos.x = this.from.x + side * d.x / Math.abs(d.x);
        pos.y = this.from.y + side * d.y / Math.abs(d.y);
      }
      return pos;
    }
  }

  Tool.prototype.init = function() {
    this.opctx.lineCap = "butt";
    this.opctx.lineJoin = "round";
    this.bctx.lineCap = "butt";
    this.bctx.lineJoin = "square";
    this.dctx.lineCap = "butt";
    this.dctx.lineJoin = "square";
    this.isDown = false;
    this.fixside = false;
  }

  Tool.prototype.onDown = function(pos) {
    this.painter.addHis();
    this.isDown = true;
    this.from = pos;
    this.to = pos;
  }

  Tool.prototype.onMove = function(pos) {
    this.opctx.clear();
    if (this.isDown) {
      this.to = this.getPos(pos);
      this.bctx.clear();
      var d = this.to.subtract(this.from);
      this.bctx.fillRect(this.from.x, this.from.y, d.x, d.y);
      this.bctx.strokeRect(this.from.x, this.from.y, d.x, d.y);
    }
  }

  Tool.prototype.onUp = function(pos) {
    if (this.isDown) {
      this.bctx.clear();
      var d = this.to.subtract(this.from);
      this.dctx.fillRect(this.from.x, this.from.y, d.x, d.y);
      this.dctx.strokeRect(this.from.x, this.from.y, d.x, d.y);
      this.isDown = false;
    }
  }

  Tool.prototype.shiftDown = function() {
    this.fixside = true;
  }

  Tool.prototype.shiftUp = function() {
    this.fixside = false;
  }

  Tool.prototype.finish = function() {}

  return Tool;
})();
