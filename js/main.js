document.addEventListener('DOMContentLoaded', function() {
  var ddom, opdom, painter;

  opdom = document.getElementById('oplayer');
  ddom = document.getElementById('layer1');
  opdom.width = parseInt(window.getComputedStyle(opdom).width);
  opdom.height = parseInt(window.getComputedStyle(opdom).height);
  ddom.width = parseInt(window.getComputedStyle(ddom).width);
  ddom.height = parseInt(window.getComputedStyle(ddom).height);

  painter = new Painter(opdom.getContext('2d'), ddom.getContext('2d'));

  painter.registerTool("pencil", Pencil);

  var tools = document.querySelectorAll('#tools .tool');
  tools = Array.prototype.slice.call(tools);

  function activeTool(dom) {
    for (var d of tools) {
      d.classList.remove('active');
    }
    d.classList.add('active');
  }

  for (var dom of tools) {
    dom.addEventListener('click', function(e) {
      activeTool(dom);
      painter.changeTool(dom.dataset.tool);
    });
  }

  opdom.addEventListener("mousedown", painter.onDown);
  opdom.addEventListener("mousemove", painter.onMove);
  opdom.addEventListener("mouseup", painter.onUp);
});
