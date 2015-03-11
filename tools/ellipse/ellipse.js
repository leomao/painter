'use strict';

var Ellipse;

Ellipse = (function() {
  var Tool = function(painter, opctx, bctx, dctx) {
    this.painter = painter;
    this.opctx = opctx;
    this.bctx = bctx;
    this.dctx = dctx;
    this.isDown = false;
    this.fixside = false;
    this.getPos = function(pos) {
      if (this.fixside) {
        var d = pos.subtract(this.from);
        var side = Math.abs(d.x) > Math.abs(d.y) ? Math.abs(d.x) : Math.abs(d.y);
        pos.x = this.from.x + side * d.x / Math.abs(d.x);
        pos.y = this.from.y + side * d.y / Math.abs(d.y);
      }
      return pos;
    }
    this.center = new Point(0, 0);
    this.rx = 0;
    this.ry = 0;
    this.calParam = function() {
      this.center.x = (this.from.x + this.to.x) / 2;
      this.center.y = (this.from.y + this.to.y) / 2;
      this.rx = Math.abs(this.from.x - this.center.x);
      this.ry = Math.abs(this.from.y - this.center.y);
    }
  }

  Tool.prototype.init = function() {
    this.opctx.lineCap = "round";
    this.opctx.lineJoin = "round";
    this.bctx.lineCap = "round";
    this.bctx.lineJoin = "round";
    this.dctx.lineCap = "round";
    this.dctx.lineJoin = "round";
  }

  Tool.prototype.onDown = function(pos) {
    this.painter.addHis();
    this.isDown = true;
    this.from = pos;
    this.to = pos;
    this.calParam();
  }

  Tool.prototype.onMove = function(pos) {
    this.opctx.clear();
    if (this.isDown) {
      this.to = this.getPos(pos);
      this.calParam();
      this.bctx.clear();
      this.bctx.beginPath();
      this.bctx.ellipse(this.center.x, this.center.y, this.rx, this.ry,
                       0, 0, 2 * Math.PI);
      this.bctx.fill();
      this.bctx.stroke();
    }
  }

  Tool.prototype.onUp = function(pos) {
    if (this.isDown) {
      this.bctx.clear();
      this.dctx.beginPath();
      this.dctx.ellipse(this.center.x, this.center.y, this.rx, this.ry,
                       0, 0, 2 * Math.PI);
      this.dctx.fill();
      this.dctx.stroke();
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
