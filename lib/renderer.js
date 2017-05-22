const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
const marked = require('marked');

ipc.on('file-opened', function (event, file, content) {
  addToPage(file)
});

const addToPage = (img) => {
  const imgElement = document.querySelector('.img-tag');

  imgElement.src = img;

};
