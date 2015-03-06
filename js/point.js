var Point, getDOMpos, getMouseDOM;

Point = (function() {
  function Point(x1, y1) {
    this.x = x1;
    this.y = y1;
  }
  return Point;
})();

getMouseDOM = function(e, dompos) {
  var dompos, x, y;
  x = e.clientX - dompos.x;
  y = e.clientY - dompos.y;
  return new Point(x, y);
};

getDOMpos = function(dom) {
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
