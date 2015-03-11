'use strict';

var pPencil;

pPencil = (function() {
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
    this.bctx.beginPath();
    this.bctx.moveTo(pos.x, pos.y);
    this.dctx.beginPath();
    this.dctx.moveTo(pos.x, pos.y);
  }

  Tool.prototype.onMove = function(pos) {
    this.opctx.clear();
    if (this.isDown) {
      this.bctx.clear();
      this.bctx.lineTo(pos.x, pos.y);
      this.bctx.stroke();
      this.dctx.lineTo(pos.x, pos.y);
    }
  }

  Tool.prototype.onUp = function(pos) {
    if (this.isDown) {
      this.bctx.clear();
      this.dctx.lineTo(pos.x, pos.y);
      this.dctx.stroke();
      this.dctx.beginPath();
      this.isDown = false;
    }
  }

  Tool.prototype.shiftDown = function() {}
  Tool.prototype.shiftUp = function() {}

  Tool.prototype.finish = function() {}

  return Tool;
})();
