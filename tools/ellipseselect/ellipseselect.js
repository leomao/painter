'use strict';

var pEllipseSelect;

pEllipseSelect = (function() {
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
    this.getPoint = function() {
      this.center.x = (this.from.x + this.to.x) / 2;
      this.center.y = (this.from.y + this.to.y) / 2;
      this.rx = Math.abs(this.from.x - this.center.x);
      this.ry = Math.abs(this.from.y - this.center.y);
    }
    this.inSelect = function(pos) {
      var dx = Math.abs(pos.x - this.center.x) / this.rx;
      var dy = Math.abs(pos.y - this.center.y) / this.ry;
      return (dx*dx + dy*dy <= 1);
    }
    this.drawFrame = function(center) {
      this.opctx.clear();
      this.opctx.beginPath();
      this.opctx.ellipse(center.x, center.y,
                         this.rx, this.ry, 0, 0, 2 * Math.PI);
      this.opctx.strokeStyle = 'white';
      this.opctx.lineDashOffset = 0;
      this.opctx.stroke();
      this.opctx.strokeStyle = 'black';
      this.opctx.lineDashOffset = 10;
      this.opctx.stroke();
    }
    this.genClip = function(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(this.center.x, this.center.y,
                  this.rx, this.ry, 0, 0, 2 * Math.PI);
      ctx.clip();
      return function() {
        ctx.restore();
      };
    }
    this.putDown = function() {
      this.dctx.drawImage(this.bctx.canvas, 0, 0);
      this.bctx.clear();
    }
    this.getUp = function() {
      this.bctx.clear();
      var restore = this.genClip(this.bctx);
      this.bctx.drawImage(this.dctx.canvas, 0, 0);
      restore();
      this.sdata = this.bctx.getImageData(this.from.x, this.from.y,
                                         this.rx * 2, this.ry * 2);
    }
  }

  Tool.prototype.init = function() {
    this.opctx.save();
    this.opctx.lineCap = "butt";
    this.opctx.lineJoin = "butt";
    this.opctx.lineWidth = 2;
    this.opctx.setLineDash([10, 10]);
    this.isDown = false;
    this.fixside = false;
    this.isSelected = false;
    this.from = new Point(0, 0);
    this.to = new Point(0, 0);
    this.isMoved = false;
    this.center = new Point(0, 0);
    this.rx = 0;
    this.ry = 0;
  }

  Tool.prototype.onDown = function(pos) {
    if (this.isSelected && this.inSelect(pos)) {
      this.isDown = true;
      this.mfrom = pos;
      if (!this.isMoved) {
        this.isMoved = true;
        this.getUp();
        this.painter.addHis();
        var restore = this.genClip(this.dctx);
        this.dctx.clear();
        restore();
      }
      this.bctx.clear();
      var restore = this.genClip(this.bctx);
      this.bctx.putImageData(this.sdata, this.from.x, this.from.y);
      restore();
    }
    else {
      this.opctx.clear();
      if (this.isSelected) {
        this.putDown();
      }
      this.isSelected = false;
      this.isMoved = false;
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
        var lefttop = this.from.add(md);
        this.drawFrame(new Point(lefttop.x + this.rx, lefttop.y + this.ry));
        this.bctx.clear();
        this.bctx.putImageData(this.sdata, lefttop.x, lefttop.y);
      }
      else {
        this.to = this.getPos(pos);
        this.getPoint();
        this.drawFrame(this.center);
      }
    }
  }

  Tool.prototype.onUp = function(pos) {
    if (this.isDown) {
      if (this.isSelected) {
        var md = this.mto.subtract(this.mfrom);
        addPoint(this.from, this.from, md);
        addPoint(this.to, this.to, md);
        this.getPoint();
        this.drawFrame(this.center);
        this.bctx.clear();
        this.bctx.putImageData(this.sdata, this.from.x, this.from.y);
      }
      else {
        if (this.rx == 0 || this.ry == 0) {
          this.isSelected = false;
          return;
        }
        this.isSelected = true;
        var mx = Math.min(this.from.x, this.to.x);
        var my = Math.min(this.from.y, this.to.y);
        var Mx = Math.max(this.from.x, this.to.x);
        var My = Math.max(this.from.y, this.to.y);
        this.from.x = mx;
        this.from.y = my;
        this.to.x = Mx;
        this.to.y = My;
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
    this.putDown();
    this.opctx.restore();
    this.bctx.restore();
  }

  return Tool;
})();
