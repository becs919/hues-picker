const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
const marked = require('marked');
const remote = electron.remote
const mainProcess = remote.require('./main')
const WebCamera = require("webcamjs");

const $openFileButton = $('#open-file')
let enabled = false;

ipc.on('file-opened', function (event, file) {
  addToPage(file)
});

const addToPage = (img) => {
  const imgElement = document.querySelector('.img-tag');

  imgElement.src = img;
};

$openFileButton.on('click', () => {
  mainProcess.openFile();
});

document.getElementById("start-camera").addEventListener('click', function () {
   if (!enabled) {
     enabled = true;
     WebCamera.attach('#camdemo');
   } else {
     enabled = false;
     WebCamera.reset();
   }
}, false);
