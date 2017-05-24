require('electron-reload')(__dirname);
const electron     = require('electron');
const { ipcMain, dialog } = require('electron');

let resizeTimer;
let fullHistory   = null;
let paletteFile = 'palettes.js'

const Menubar = require('menubar');
const menubar = Menubar({
  width: 500,
  height: 900,
  icon: './images/octo-fav.png'
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
  })
});

ipcMain.on('palette', (event, data) => {
  // console.log('event', event, 'data', data);
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
