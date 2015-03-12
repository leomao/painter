'use strict';

var pSelect;

pSelect = (function() {
  var Tool = function(painter, opctx, bctx, dctx) {
    this.painter = painter;
    this.opctx = opctx;
    this.bctx = bctx;
    this.dctx = dctx;
    this.isDown = false;
    this.fixside = false;
    this.isSelected = false;
    this.getPos = function(pos) {
      if (this.fixside) {
        var d = pos.subtract(this.from);
        var side = Math.abs(d.x) > Math.abs(d.y) ? Math.abs(d.x) : Math.abs(d.y);
        pos.x = this.from.x + side * d.x / Math.abs(d.x);
        pos.y = this.from.y + side * d.y / Math.abs(d.y);
      }
      return pos;
    }
    this.inSelect = function(pos) {
      var w = this.opctx.canvas.width;
      var h = this.opctx.canvas.width;
      var tw = Math.abs(this.from.x - pos.x) + Math.abs(this.to.x - pos.x);
      var th = Math.abs(this.from.y - pos.y) + Math.abs(this.to.y - pos.y);
      return (tw <= w && th <= h);
    }  
  }

  Tool.prototype.init = function() {
    this.opctx.save();
    this.opctx.lineCap = "butt";
    this.opctx.lineJoin = "butt";
    this.opctx.lineWidth = 2;
  }

  Tool.prototype.onDown = function(pos) {
    if (this.isSelected && this.inSelect(pos)) {
      console.log("inside");
      this.isDown = true;
      this.mfrom = pos;
    }
    else {
      this.opctx.clear();
      this.isSelected = false;
      this.isDown = true;
      this.from = pos;
      this.to = pos;
    }
  }

  Tool.prototype.onMove = function(pos) {
    if (this.isDown) {
      if (this.isSelected) {
        this.mto = pos;
      }
      else {
        this.to = this.getPos(pos);
        this.opctx.clear();
        var d = this.to.subtract(this.from);
        this.opctx.strokeStyle = 'white';
        this.opctx.strokeRect(this.from.x, this.from.y, d.x, d.y);
        this.opctx.strokeStyle = 'black';
        this.opctx.strokeRect(this.from.x-2, this.from.y-2, d.x+4, d.y+4);
        this.opctx.strokeRect(this.from.x+2, this.from.y+2, d.x-4, d.y-4);
      }
    }
  }

  Tool.prototype.onUp = function(pos) {
    if (this.isDown) {
      if (this.isSelected) {

      }
      else {
        this.isSelected = true;
        var from = this.from;
        var to = this.to;
        this.from.x = Math.min(from.x, to.x);
        this.from.y = Math.min(from.y, to.y);
        this.to.x = Math.max(from.x, to.x);
        this.to.y = Math.max(from.y, to.y);
        this.size = this.to.subtract(this.from);
        this.sdata = this.dctx.getImageData(this.from.x, this.from.y,
                                            this.size.x, this.size.y);
      }
    }
  }

  Tool.prototype.shiftDown = function() {
    this.fixside = true;
  }

  Tool.prototype.shiftUp = function() {
    this.fixside = false;
  }

  Tool.prototype.finish = function() {
    this.opctx.restore();
  }

  return Tool;
})();
