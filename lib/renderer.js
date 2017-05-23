const electron = require('electron');
const ipc = electron.ipcRenderer;
const $ = require('jquery');
const marked = require('marked');
const remote = electron.remote
const mainProcess = remote.require('./main')


const $openFileButton = $('#open-file')

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
