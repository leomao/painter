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

  $('.colorpicker.front').colorPicker({
    color: '#000',
    GPU: true, // use transform: translate3d
    // opacity: true, // enable / disable alpha slider
    renderCallback: function($elm, toggled) {
      painter.setFrontColor(this.color.colors);
    }, // this === instance; $elm: the input field;toggle === true -> just appeared; false -> opposite; else -> is rendering on pointer move
    // toggled true/false can for example be used to check if the $elm has a certain className and then hide alpha,...
    buidCallback: function($elm) {}, // this === instance; $elm: the UI
    scrollResize: true, // toggle for reposition colorPicker on window.resize/scroll
    gap: 4, // gap to right and bottom edge of view port if repositioned to fit
    preventFocus: false, // prevents default on focus of input fields (e.g. no keyboard on mobile)
    body: document.body, // the element where the events are attached to (touchstart, mousedown, pointerdown, focus, click, change)
  });

  $('.colorpicker.back').colorPicker({
    color: '#FFF',
    GPU: true, // use transform: translate3d
    // opacity: true, // enable / disable alpha slider
    renderCallback: function($elm, toggled) {
      painter.setBackColor(this.color.colors);
    }, // this === instance; $elm: the input field;toggle === true -> just appeared; false -> opposite; else -> is rendering on pointer move
    // toggled true/false can for example be used to check if the $elm has a certain className and then hide alpha,...
    buidCallback: function($elm) {}, // this === instance; $elm: the UI
    scrollResize: true, // toggle for reposition colorPicker on window.resize/scroll
    gap: 4, // gap to right and bottom edge of view port if repositioned to fit
    preventFocus: false, // prevents default on focus of input fields (e.g. no keyboard on mobile)
    body: document.body, // the element where the events are attached to (touchstart, mousedown, pointerdown, focus, click, change)
  });

});
