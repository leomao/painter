var Pencil;

Pencil = (function() {
  Pencil = function(opctx, dctx) {
    this.opctx = opctx;
    this.dctx = dctx;
    this.lineWidth = 5;
    this.color = '#000000';
    this.isDown = false;
  }

  Pencil.prototype.onDown = function(pos) {
    this.dctx.strokeStyle = this.color;
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
    this.dctx.lineTo(pos.x, pos.y);
    this.dctx.stroke();
    this.isDown = false;
  }

  return Pencil;
})();
