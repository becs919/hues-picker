const $            = require('jquery');
const electron     = require('electron');
const ipc          = electron.ipcRenderer;
const marked       = require('marked');
const remote       = electron.remote;
const mainProcess  = remote.require('./main');
const colorPalette = require('colors-palette');

const $openFileButton = $('#open-file');
const $imgElement     = $('#img-tag');

ipc.on('file-opened', function (event, file) {
  $('.content').empty();
  addImageToPage(file);
});

const addImageToPage = (img) => {
  $imgElement.attr('src', img);
  getPalette(img);
};

const getPalette = (img) => {
  colorPalette(img, 8, (err, colors) => {
    if (err) {
      // console.log(err);
      return false;
    }
    let palette = colors.result;
    submitPalette(palette);
     //writes to file eventually
    renderPalette(palette);
  });
};

const renderPalette = (palette) => {
  if (palette.length === 0) {
    $('#error-msg').text('Error, cannot read colors');
  } else {
    $('#error-msg').text('');
  }
  // loop over palette, render each RGB & HEX with a color swatch
  // also screen shot eventually
  palette.forEach((color) => {
    $('.content').append(
      `<div class="color-content">
        <div class="color-div" style="background-color:#${color.hex}"></div>
        <p class="hex-code">#${color.hex}</p>
        <p class="rgb-code">${color.rgb}</p>
      </div>`);
  });
};

$openFileButton.on('click', () => {
  mainProcess.openFile();
  submitPalette();
});

const submitPalette = (palette) => {
  //writes to file eventually in MAIN
  ipc.send('palette', palette);
};


//  DRAGGIN N DROPPIN

const $dropZone      = $('#drop-zone');
const $dropContainer = $('.container');
const $uploadButton  = $('#upload-another');

const handleDragEnter = (event) => {
  $dropZone.addClass('dragging');
  return false;
};

const handleDragLeave = (event) => {
  $dropZone.removeClass('dragging');
  return false;
};

const handleDropEvent = (e) => {
  $('.content').empty();

  e.preventDefault();

  $dropZone.removeClass('dragging');

  let dt = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
  let files = e.target.files || (dt && dt.files);
  if (files) {
    let thisPic = files[0].path;
    addImageToPage(thisPic);
  } else {
    console.log('no files');
  }
  $dropContainer.hide();
  $uploadButton.show();
};

$uploadButton.on('click', () => $dropContainer.show());

$dropZone
  .on('dragenter', handleDragEnter)
  .on('dragleave', handleDragLeave)
  .on('drop', handleDropEvent);

$(() => document.ondragover = document.onDrop = (ev) => ev.preventDefault());
