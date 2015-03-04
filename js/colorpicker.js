function createColorPicker(domid) {
  var self = this;
  var dom = document.getElementById(domid);
  dom.classList.add('cp-color-picker');
  self.dom.innerHTML = '<canvas class="cp-color-panel"></canvas>' + 
    '<canvas class="cp-color-hueline"></canvas>';
  self.panel = dom.querySelector('.cp-color-panel').getContext('2d');
  self.hueline = dom.querySelector('.cp-color-hueline').getContext('2d');
  var hue_height = self.hueline.canvas.height;
  var hue_width = self.hueline.canvas.width;
  var hue = self.hueline.createLinearGradient(0, 0, 0, hue_height);
  hue.addColorStop(0, 'rgb(255, 0, 0)');
  hue.addColorStop(1/3, 'rgb(0, 0, 255)');
  hue.addColorStop(2/3, 'rgb(0, 255, 0)');
  hue.addColorStop(1, 'rgb(255, 0, 0)');
  self.hueline.fillStyle = hue;
  self.hueline.fillRect(0, 0, hue_width, hue_height);
}



