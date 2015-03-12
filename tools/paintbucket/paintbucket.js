'use strict';

var pPaintBucket;

pPaintBucket = (function() {
  var Tool = function(painter, opctx, bctx, dctx) {
    this.painter = painter;
    this.opctx = opctx;
    this.bctx = bctx;
    this.dctx = dctx;
    this.isDown = false;
    this.fixside = false;
    this.fillAround = function(img, pos) {
      var w = this.dctx.canvas.width;
      var h = this.dctx.canvas.height;
      var MAX = 4 * w * h;
      var x = pos.x;
      var y = pos.y
      var i = (x + y * w) * 4;
      var c = new Colors();
      c.setColor(this.dctx.strokeStyle);
      var rgba = {
        r: c.colors.RND.rgb.r,
        g: c.colors.RND.rgb.g,
        b: c.colors.RND.rgb.b,
        a: Math.round(c.colors.alpha * 255)
      };
      var origin = {
        r: img.data[i],
        g: img.data[i+1],
        b: img.data[i+2],
        a: img.data[i+3]
      };
      if (origin.r == rgba.r && origin.g == rgba.g && origin.b == rgba.b
          && origin.a == rgba.a) {
        return;
      }
      img.data[i] = rgba.r;
      img.data[i+1] = rgba.g;
      img.data[i+2] = rgba.b;
      img.data[i+3] = rgba.a;
      var que = [i];
      var pointer = 0;
      while (que.length >= pointer) {
        i = que[pointer];
        if (i - 4*w > 0 && 
            img.data[i-4*w] == origin.r && img.data[i-4*w+1] == origin.g &&
            img.data[i-4*w+2] == origin.b && img.data[i-4*w+3] == origin.a) {
          img.data[i-4*w] = rgba.r;
          img.data[i-4*w+1] = rgba.g;
          img.data[i-4*w+2] = rgba.b;
          img.data[i-4*w+3] = rgba.a;
          que.push(i-4*w);
        }
        if (i + 4*w < MAX && 
            img.data[i+4*w] == origin.r && img.data[i+4*w+1] == origin.g &&
            img.data[i+4*w+2] == origin.b && img.data[i+4*w+3] == origin.a) {
          img.data[i+4*w] = rgba.r;
          img.data[i+4*w+1] = rgba.g;
          img.data[i+4*w+2] = rgba.b;
          img.data[i+4*w+3] = rgba.a;
          que.push(i+4*w);
        }
        if (Math.floor(i / 4) % w > 0 && 
            img.data[i-4] == origin.r && img.data[i-3] == origin.g &&
            img.data[i-2] == origin.b && img.data[i-1] == origin.a) {
          img.data[i-4] = rgba.r;
          img.data[i-4+1] = rgba.g;
          img.data[i-4+2] = rgba.b;
          img.data[i-4+3] = rgba.a;
          que.push(i-4);
        }
        if (Math.floor(i / 4) % w < w - 1 && 
            img.data[i+4] == origin.r && img.data[i+5] == origin.g &&
            img.data[i+6] == origin.b && img.data[i+7] == origin.a) {
          img.data[i+4] = rgba.r;
          img.data[i+4+1] = rgba.g;
          img.data[i+4+2] = rgba.b;
          img.data[i+4+3] = rgba.a;
          que.push(i+4);
        }
        pointer++;
      }
    }
  }

  Tool.prototype.init = function() {
  }

  Tool.prototype.onDown = function(pos) {
    this.isDown = true;
  }

  Tool.prototype.onMove = function(pos) {
  }

  Tool.prototype.onUp = function(pos) {
    if (this.isDown) {
      this.painter.addHis();
      var img = this.dctx.getImageData(0, 0, this.dctx.canvas.width,
                                        this.dctx.canvas.height);
      this.fillAround(img, pos);
      this.dctx.putImageData(img, 0, 0);
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
