const $            = require('jquery');
const electron     = require('electron');

const ipc          = electron.ipcRenderer;
const marked       = require('marked');
const remote       = electron.remote;
const mainProcess  = remote.require('./main');
const colorPalette = require("colors-palette");

const $openFileButton = $('#open-file');

const imgElement = $('#img-tag');

ipc.on('file-opened', function (event, file) {
  $('.content').empty();
  addImageToPage(file);
});

const addImageToPage = (img) => {
  imgElement.attr('src', img);
  getPalette(img);
};

const getPalette = (img) => {
  colorPalette(img, 8, (err, colors) => {
    if (err) {
      console.log(err);
      return false;
    }
    let palette = colors.result;
    submitPalette(palette);
     //writes to file eventually
    renderPalette(palette);
  })
};

const renderPalette = (palette) => {
  // loop over palette, render each RGB & HEX with a color swatch
  // also screen shot eventually
  palette.forEach((color) => {
    $('.content').append(
      `<div class="color-div" style="background-color:#${color.hex}"></div>
      <p class="hex-code">${color.hex}</p>
      <p class="rgb-code">${color.rgb}</p>`)
  })
};

$openFileButton.on('click', () => {
  mainProcess.openFile();
  submitPalette();

});

const submitPalette = (palette) => {
  //writes to file eventually in MAIN
  ipc.send('palette', palette);
};
