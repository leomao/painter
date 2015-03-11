'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var opdom = document.getElementById('oplayer'); // operation
  var bdom = document.getElementById('blayer'); // buffer
  var ddom = document.getElementById('dlayer'); // draw
  opdom.width = parseInt(window.getComputedStyle(opdom).width);
  opdom.height = parseInt(window.getComputedStyle(opdom).height);
  bdom.width = parseInt(window.getComputedStyle(bdom).width);
  bdom.height = parseInt(window.getComputedStyle(bdom).height);
  ddom.width = parseInt(window.getComputedStyle(ddom).width);
  ddom.height = parseInt(window.getComputedStyle(ddom).height);

  var painter = new Painter(opdom.getContext('2d'), bdom.getContext('2d'),
                            ddom.getContext('2d'));

  painter.registerTool("pencil", Pencil);
  painter.registerTool("line", Line);
  painter.registerTool("rect", Rect);
  painter.registerTool("ellipse", Ellipse);
  painter.registerTool("paintbucket", PaintBucket);

  var tools = document.querySelectorAll('#tools .tool');
  tools = Array.prototype.slice.call(tools);

  function activeTool(dom) {
    for (var d of tools) {
      d.classList.remove('active');
    }
    dom.classList.add('active');
  }

  for (var dom of tools) {
    dom.addEventListener('click', function(e) {
      activeTool(this);
      painter.changeTool(this.dataset.tool);
    });
  }

  var refreshButton = document.querySelector('#refresh-button');
  refreshButton.addEventListener("click", function(e) {
    painter.addHis();
    painter.clear();
  });

  var undoButton = document.querySelector('#undo-button');
  undoButton.addEventListener("click", function(e) {
    painter.undo();
  });

  var widthrange = document.getElementById('line-width-range');
  var widthnumber = document.getElementById('line-width-number');

  widthrange.addEventListener('input', function(e) {
    widthnumber.value = widthrange.value;
    painter.getStyle();
  });
  widthnumber.addEventListener('change', function(e) {
    var value = parseInt(widthnumber.value);
    if (isNaN(value))
      widthnumber.value = widthrange.value;
    else if (value > widthrange.max)
      widthnumber.value = widthrange.value =  widthrange.max;
    else if (value < widthrange.min)
      widthnumber.value = widthrange.value =  widthrange.min;
    else
      widthrange.value = widthnumber.value;
    painter.getStyle();
  });

  $('.colorpicker.front').colorPicker({
    color: '#000',
    GPU: true, // use transform: translate3d
    renderCallback: function($elm, toggled) {
      painter.getStyle();
    },
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
    renderCallback: function($elm, toggled) {
      painter.getStyle();
    },
    buidCallback: function($elm) {}, // this === instance; $elm: the UI
    scrollResize: true, // toggle for reposition colorPicker on window.resize/scroll
    gap: 4, // gap to right and bottom edge of view port if repositioned to fit
    preventFocus: false, // prevents default on focus of input fields (e.g. no keyboard on mobile)
    body: document.body, // the element where the events are attached to (touchstart, mousedown, pointerdown, focus, click, change)
  });

  painter.getStyle = function() {
    var width = parseInt(widthrange.value);
    var fcolor = document.querySelector('.colorpicker.front').style.backgroundColor;
    var bcolor = document.querySelector('.colorpicker.back').style.backgroundColor;
    this.setLineWidth(width);
    this.setFrontColor(fcolor);
    this.setBackColor(bcolor);
  }

  var container = document.getElementById('container'); // operation
  container.addEventListener("mousedown", painter.onDown);
  container.addEventListener("mouseup", painter.onUp);
  window.addEventListener("keydown", function(e) {
    if (e.shiftKey)
      painter.shiftDown();
  });
  window.addEventListener("keyup", function(e) {
    if (!e.shiftKey)
      painter.shiftUp();
  });

});
