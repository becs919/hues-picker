const $            = require('jquery');
const electron     = require('electron');

const ipc          = electron.ipcRenderer;
const marked       = require('marked');
const remote       = electron.remote
const mainProcess  = remote.require('./main')
const colorPalette = require("colors-palette");


const $openFileButton = $('#open-file');

const $imgElement = $('#img-tag');

ipc.on('file-opened', function (event, file) {
  addToPage(file)
});

const addToPage = (img) => {
  imgElement.src = img;
  getPalette(img)
};
 
const getPalette = (img) => {
  colorPalette(img, 8, (err, colors) => {
    if(err) {
      console.log(err)
      return false;
    }
    console.log(colors)

  })
}

$openFileButton.on('click', () => {
  mainProcess.openFile();
});







