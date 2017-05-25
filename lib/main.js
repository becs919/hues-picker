require('electron-reload')(__dirname);
const { dialog } = require('electron');
const fs         = require('fs');

const Menubar = require('menubar');
const menubar = Menubar({
  width: 450,
  height: 900,
  icon: './images/icon.png'
});

let fullHistory = null;
let resizeTimer;

menubar.on('ready', () => {
  /* eslint-disable no-console */
  console.log('Application is ready.');
});

menubar.on('after-create-window', () => {
  menubar.window.loadURL(`file://${__dirname}/index.html`);
  menubar.window.on('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      menubar.window.webContents.send('resized', { data: fullHistory, bounds: menubar.window.getBounds() });
    }, 150);
  });
});

exports.openFile = () => {
  let files = dialog.showOpenDialog(menubar, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'svg', 'png'] }
    ]
  });
  if (!files) {
    return;
  }
  let file = files[0];
  menubar.window.webContents.send('file-opened', file);
};

exports.saveFile = (yungContent) => {
  const file = dialog.showSaveDialog({
    title: 'Save File',
    filters: [
      { name: 'Palette!', extensions: ['txt'] }
    ]
  });
  if (!file) return;
  fs.writeFileSync(file, yungContent);
};