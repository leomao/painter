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
    this.lefttop = new Point(0, 0);
    this.rightbottom = new Point(0, 0);
    this.getPos = function(pos) {
      if (this.fixside) {
        var d = pos.subtract(this.from);
        var side = Math.abs(d.x) > Math.abs(d.y) ? Math.abs(d.x) : Math.abs(d.y);
        pos.x = this.from.x + side * d.x / Math.abs(d.x);
        pos.y = this.from.y + side * d.y / Math.abs(d.y);
      }
      return pos;
    }
    this.getPoint = function() {
      this.lefttop.x = Math.min(this.from.x, this.to.x);
      this.lefttop.y = Math.min(this.from.y, this.to.y);
      this.rightbottom.x = Math.max(this.from.x, this.to.x);
      this.rightbottom.y = Math.max(this.from.y, this.to.y);
      this.size = this.rightbottom.subtract(this.lefttop);
    }
    this.inSelect = function(pos) {
      var tw = Math.abs(this.lefttop.x - pos.x)
        + Math.abs(this.rightbottom.x - pos.x);
      var th = Math.abs(this.lefttop.y - pos.y)
        + Math.abs(this.rightbottom.y - pos.y);
      return (tw == this.size.x && th == this.size.y);
    }
    this.drawFrame = function(lefttop, size) {
      this.opctx.clear();
      this.opctx.strokeStyle = 'white';
      this.opctx.strokeRect(lefttop.x, lefttop.y,
                            size.x, size.y);
      this.opctx.strokeStyle = 'black';
      this.opctx.lineDashOffset = 10;
      this.opctx.strokeRect(lefttop.x, lefttop.y,
                            size.x, size.y);
      this.opctx.lineDashOffset = 0;
    }
  }

  Tool.prototype.init = function() {
    this.opctx.save();
    this.opctx.lineCap = "butt";
    this.opctx.lineJoin = "butt";
    this.opctx.lineWidth = 2;
    this.opctx.setLineDash([10, 10]);
  }

  Tool.prototype.onDown = function(pos) {
    if (this.isSelected && this.inSelect(pos)) {
      this.isDown = true;
      this.mfrom = pos;
      this.bctx.clear();
      this.bctx.putImageData(this.sdata, this.lefttop.x, this.lefttop.y);
      this.dctx.clearRect(this.lefttop.x, this.lefttop.y,
                          this.size.x, this.size.y);
    }
    else {
      this.opctx.clear();
      if (this.isSelected) {
        this.bctx.clear();
        this.dctx.putImageData(this.sdata, this.lefttop.x, this.lefttop.y);
      }
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
        var md = this.mto.subtract(this.mfrom);
        var lefttop = this.lefttop.add(md);
        this.drawFrame(lefttop, this.size);
        this.bctx.clear();
        this.bctx.putImageData(this.sdata, lefttop.x, lefttop.y);

      }
      else {
        this.to = this.getPos(pos);
        this.getPoint();
        this.drawFrame(this.lefttop, this.size);
      }
    }
  }

  Tool.prototype.onUp = function(pos) {
    if (this.isDown) {
      if (this.isSelected) {
        var md = this.mto.subtract(this.mfrom);
        addPoint(this.lefttop, this.lefttop, md);
        addPoint(this.rightbottom, this.lefttop, this.size);
        this.drawFrame(this.lefttop, this.size);
        this.bctx.clear();
        this.bctx.putImageData(this.sdata, this.lefttop.x, this.lefttop.y);
      }
      else {
        if (this.size.x == 0 || this.size.y == 0) {
          this.isSelected = false;
          return;
        }
        this.isSelected = true;
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
