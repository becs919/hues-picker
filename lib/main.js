require('electron-reload')(__dirname);

const { ipcMain, dialog } = require('electron');
const fs = require('fs');

let resizeTimer;
let fullHistory = null;
let paletteFile = 'palettes.js';

const Menubar = require('menubar');
const menubar = Menubar({
  width: 450,
  height: 900,
  icon: './images/icon.png'
});

menubar.on('ready', () => {
  console.log('Application is ready.');
});

menubar.on('after-create-window', function () {
  menubar.window.loadURL(`file://${__dirname}/index.html`);
  menubar.window.on('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      menubar.window.webContents.send('resized' , {data: fullHistory, bounds: menubar.window.getBounds()});
    }, 150);
  });
});

ipcMain.on('palette', (event, data) => {
  console.log('data', data);



  // yung sudo
  // write this to a palette file.
});

exports.openFile = function () {
  let files = dialog.showOpenDialog(menubar, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'svg', 'png'] }
    ]
  });

  if (!files) { return; }

  let file = files[0];

  menubar.window.webContents.send('file-opened', file);
};


// exports.saveFile = () => {

//   // dialog.showSaveDialog({properties: ['openFile', 'openDirectory', 'multiSelections']})



// }

exports.saveFile = (yungContent) => {
  const file = dialog.showSaveDialog({
    title: 'Save File',
    filters: [
      { name: 'Palette!', extensions: ['json'] }
    ]
  });
  if (!file) return;

  console.log(file)

  fs.writeFileSync(file, yungContent)
};











