'use strict';

var pLine;

pLine = (function() {
  var Tool = function(painter, opctx, bctx, dctx) {
    this.painter = painter;
    this.opctx = opctx;
    this.bctx = bctx;
    this.dctx = dctx;
    this.isDown = false;
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
  }

  Tool.prototype.onMove = function(pos) {
    this.opctx.clear();
    if (this.isDown) {
      this.to = pos;
      this.bctx.clear();
      this.bctx.beginPath();
      this.bctx.moveTo(this.from.x, this.from.y);
      this.bctx.lineTo(this.to.x, this.to.y);
      this.bctx.stroke();
    }
  }

  Tool.prototype.onUp = function(pos) {
    if (this.isDown) {
      this.bctx.clear();
      this.dctx.beginPath();
      this.dctx.moveTo(this.from.x, this.from.y);
      this.dctx.lineTo(this.to.x, this.to.y);
      this.dctx.stroke();
      this.isDown = false;
    }
  }

  Tool.prototype.shiftDown = function() {
  }

  Tool.prototype.shiftUp = function() {
  }

  Tool.prototype.finish = function() {}

  return Tool;
})();
