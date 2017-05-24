const $            = require('jquery');
const electron     = require('electron');
const ipc          = electron.ipcRenderer;
const remote       = electron.remote;
const mainProcess  = remote.require('./main');
const colorPalette = require('colors-palette');
const clipboard    = electron.clipboard;

const $openFileButton = $('#open-file');
const $savePaletteBtn = $('.save-palette');
const $imgElement     = $('#img-tag');
const $content        = $('.content');

let currentPalette;

$content.on('click', '.btn-hex', function(){
  let colorContentSection = $(this).closest('.color-content').children();
  let hexCode = colorContentSection[1].innerHTML;
  clipboard.writeText(hexCode);
});

$content.on('click', '.btn-rgb', function(){
  let colorContentSection = $(this).closest('.color-content').children();
  let rgbCode = colorContentSection[2].innerHTML;
  clipboard.writeText(rgbCode);
});

ipc.on('file-opened', function (event, file) {
  $('.content').empty();
  addImageToPage(file);
});

const addImageToPage = (img) => {
  $('#error-msg').text('');
  $imgElement.attr('src', img);
  timeOut();
  getPalette(img);
};

const timeOut = () => {
  $content.hide();
  $('.spinner').show();

  setTimeout(hideAnimation, 3000);
};

const hideAnimation = () => {
  $content.show();
  $('.spinner').hide();
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

    if (palette.length === 0) {
      $('#error-msg').text('Error, cannot read colors');
    } else {
      $('#error-msg').text('');
      renderPalette(palette);
      currentPalette = palette;
    }
  });
};

const renderPalette = (palette) => {
  $('.save-palette').show();
  palette.forEach((color) => {
    $('.content').append(
      `<div class="color-content">
        <div class="color-div" style="background-color:#${color.hex}"></div>
        <p class="hex-code">#${color.hex}</p>
        <p class="rgb-code">${color.rgb}</p>
        <button class='btn btn-hex'>Copy Hex</button>
        <button class='btn btn-rgb'>Copy RGB</button>
      </div>`);
  });
};

$openFileButton.on('click', () => {
  mainProcess.openFile();
  submitPalette();
});

$savePaletteBtn.on('click', () => mainProcess.saveFile(JSON.stringify(currentPalette)));

const submitPalette = (palette) => {
  ipc.send('palette', palette);
};

//  DRAGGIN N DROPPIN

const $dropZone      = $('#drop-zone');
const $dropContainer = $('.container');
const $uploadButton  = $('#upload-another');

const handleDragEnter = () => {
  $dropZone.addClass('dragging');
  return false;
};

const handleDragLeave = () => {
  $dropZone.removeClass('dragging');
  return false;
};

const handleDropEvent = (e) => {
  $('.content').empty();

  e.preventDefault();

  $dropZone.removeClass('dragging');

  let dt    = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
  let files = e.target.files || (dt && dt.files);

  if (files) {
    let file = files[0];
    let imageType = /image.*/;

    if (file.type.match(imageType)) {
      let thisPic = files[0].path;
      addImageToPage(thisPic);
    } else {
      $('#error-msg').text('invalid file type!');
    }
  }
  $dropZone.hide();
  $uploadButton.show();
};

$uploadButton.on('click', () => $dropZone.show());

$dropZone
  .on('dragenter', handleDragEnter)
  .on('dragleave', handleDragLeave)
  .on('drop', handleDropEvent);

$(() => {
  window.addEventListener('dragover',(e) => {
    e = e || event;
    e.preventDefault();
  },false);
  window.addEventListener('drop', (e) => {
    e = e || event;
    e.preventDefault();
  },false);
});
