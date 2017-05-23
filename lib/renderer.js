const electron     = require('electron');
const ipc          = electron.ipcRenderer;
const $            = require('jquery');
const marked       = require('marked');
const remote       = electron.remote
const mainProcess  = remote.require('./main')
const WebCamera    = require("webcamjs");
const colorPalette = require("colors-palette");

const $openFileButton = $('#open-file');
let enabled = false;
const imgElement = document.querySelector('.img-tag');

ipc.on('file-opened', function (event, file) {
  colorPalette(file, 8, function(err, colors){
    if(err){
      console.error(err);
      return false;
    }
    console.log(colors);
  });
  addToPage(file)
});

const addToPage = (img) => {
  imgElement.src = img;
};

$openFileButton.on('click', () => {
  mainProcess.openFile();
});

document.getElementById('start-camera').addEventListener('click', function () {
   if (!enabled) {
     enabled = true;
     WebCamera.attach('#camdemo');
   } else {
     enabled = false;
     WebCamera.reset();
   }
}, false);

document.getElementById('snap-picture').addEventListener('click', function () {
  WebCamera.snap( function(data_uri) {
      imgElement.src = data_uri;
  });
});
