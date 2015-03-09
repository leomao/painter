'use strict';

var Pencil;

Pencil = (function() {
  Pencil = function(painter, opctx, dctx) {
    this.painter = painter;
    this.opctx = opctx;
    this.dctx = dctx;
    this.lineWidth = 5;
    this.isDown = false;
  }

  Pencil.prototype.onDown = function(pos) {
    this.painter.addHis();
    this.dctx.lineWidth = this.lineWidth;
    this.isDown = true;
    this.dctx.beginPath();
    this.dctx.moveTo(pos.x, pos.y);
    this.dctx.stroke();
  }

  Pencil.prototype.onMove = function(pos) {
    if (this.isDown) {
      this.dctx.lineTo(pos.x, pos.y);
      this.dctx.stroke();
    }
  }

  Pencil.prototype.onUp = function(pos) {
    if (this.isDown) {
      this.dctx.lineTo(pos.x, pos.y);
      this.dctx.stroke();
      this.isDown = false;
    }
  }

  return Pencil;
})();
