const $            = require('jquery');
const electron     = require('electron');
const ipc          = electron.ipcRenderer;
const remote       = electron.remote;
const mainProcess  = remote.require('./main');
const colorPalette = require('colors-palette');
const base64Img    = require('base64-img');
const clipboard    = electron.clipboard;

const $openFileButton = $('#open-file');
const $savePaletteBtn = $('.save-palette');
const $imgElement     = $('#img-tag');
const $content        = $('.content');

let currentPalette;

// ================================================
// COLOR DROPPER===================================

let img = document.querySelector('.photo img');
let canvas = document.getElementById('cs');
let result = document.querySelector('.result');
let photoBorder = document.querySelector('.photo');
let x;
let y;

// Add event listener to grab x and y coordinates from image on click
img.addEventListener('click', function(e){
  if (e.offsetX) {
    x = e.offsetX;
    y = e.offsetY;
  } else if (e.layerX) {
    x = e.layerX;
    y = e.layerY;
  }
  // useCanvas to draw image to canvase
  useCanvas(canvas, img, function(){
  // return a data image object representing the underlying pixel data for the canvas
    let ctx = canvas.getContext('2d')
  .getImageData(x, y, 1, 1).data;
  //render result in hex and rgb to DOM for display
    result.innerHTML = '<span>'+rgbToHex(ctx[0],ctx[1],ctx[2])+ ' ' + '||' + '</span>'+
   '<span>'+ ' ' +
    ctx[0]+','+
    ctx[1]+','+
    ctx[2]+'</span>';
  //change border color around photo image
    photoBorder.style.background =rgbToHex(ctx[0],ctx[1],ctx[2]);
  });
}, false);

const useCanvas = (canvas, image, callback) => {
  // set height and width
  canvas.width = image.width;
  canvas.height = image.height;
  // draw image to canvas
  canvas.getContext('2d')
  .drawImage(image, 0, 0, image.width, image.height);
  return callback();
};

// change rgb values to hex code
const rgbToHex = (r, g, b) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

// =====================================
//  ==========CLIPBOARD FOR COLOR PALETTE

$content.on('click', '.btn-hex', function(){
  let colorContentSection = $(this).closest('.color-content').children();
  let hexCode = colorContentSection[1].innerHTML;
  clipboard.writeText(hexCode);
});

$content.on('click', '.btn-rgb', function(){
  let colorContentSection = $(this).closest('.color-content').children();
  let rgbCode = colorContentSection[3].innerHTML;
  clipboard.writeText(rgbCode);
});

ipc.on('file-opened', function (event, file) {
  $('.content').empty();
  addImageToPage(file);
});

const addImageToPage = (img) => {
  base64Img.base64(img, function(err, data) {
    if (err)
      console.log(err)
    else
    $('#er  ror-msg').text('');
    $imgElement.attr('src', data);
    timeOut();
    getPalette(img);
  });
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
      return false;
    }
    let palette = colors.result;

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
          <button class='btn btn-hex'>Copy Hex</button>
          <p class="rgb-code">${color.rgb}</p>
          <button class='btn btn-rgb'>Copy RGB</button>
        </div>`);
  });
};

$openFileButton.on('click', () => {
  mainProcess.openFile();
});

$savePaletteBtn.on('click', () => mainProcess.saveFile(JSON.stringify(currentPalette)));

//  DRAGGIN N DROPPIN

const $dropZone      = $('#drop-zone');
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
