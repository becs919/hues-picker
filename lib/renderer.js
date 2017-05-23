const $            = require('jquery');
const electron     = require('electron');

const ipc          = electron.ipcRenderer;
const marked       = require('marked');
const remote       = electron.remote
const mainProcess  = remote.require('./main')
const colorPalette = require("colors-palette");

const $openFileButton = $('#open-file');

const imgElement = $('#img-tag');

ipc.on('file-opened', function (event, file) {
  console.log(file)
  addImageToPage(file)
});

const addImageToPage = (img) => {

  imgElement.attr('src', img)

  getPalette(img)
};
 
const getPalette = (img) => {
  colorPalette(img, 8, (err, colors) => {
    if(err) {
      console.log(err)
      return false;
    }
    let palette = colors.result;
    submitPalette(palette) //writes to file eventually
    // renderPalette(palette) renders yung palette
  })
}

const renderPalette = (palette) => {
  // loop over palette, render each RGB & HEX with a color swatch
  // also screen shot eventually 
}

$openFileButton.on('click', () => {
  mainProcess.openFile();
  submitPalette()

});

const submitPalette = (palette) => {
  //writes to file eventually in MAIN
  ipc.send('palette', palette)
}







