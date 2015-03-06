'use strict';

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

  var refreshButton = document.querySelector('#refresh-button');
  refreshButton.addEventListener("click", function(e) {
    painter.clear();
  });

  var undoButton = document.querySelector('#undo-button');
  undoButton.addEventListener("click", function(e) {
    painter.undo();
  });

  window.addEventListener("mousedown", painter.onDown);
  window.addEventListener("mousemove", painter.onMove);
  window.addEventListener("mouseup", painter.onUp);
});
