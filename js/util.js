'use strict';

var Point = (function() {
  var Point = function(x1, y1) {
    this.x = x1;
    this.y = y1;
  }

  Point.prototype.add = function(p) {
    return new Point(this.x + p.x, this.y + p.y);
  }

  Point.prototype.subtract = function(p) {
    return new Point(this.x - p.x, this.y - p.y);
  }

  return Point;
})();

var addPoint = function(p, a, b) {
  p.x = a.x + b.x;
  p.y = a.y + b.y;
}

var subtractPoint = function(p, a, b) {
  p.x = a.x - b.x;
  p.y = a.y - b.y;
}

var getMouseDOM = function(e, dompos) {
  var dompos, x, y;
  x = e.clientX - dompos.x;
  y = e.clientY - dompos.y;
  return new Point(x, y);
};

var getDOMpos = function(dom) {
  var x, y;
  x = 0;
  y = 0;
  while (dom) {
    x = x + parseInt(dom.offsetLeft);
    y = y + parseInt(dom.offsetTop);
    dom = dom.offsetParent;
  }
  return new Point(x, y);
};

var getColor = function(color) {
  var rgb = color.RND.rgb;
  var sty = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' +
    color.alpha + ')';
  return sty;
}
