const electron      = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app           = electron.app;
const dialog        = electron.dialog;

let mainWindow = null;
let resizeTimer;
let fullHistory = null;

const Menubar = require('menubar');
const menubar = Menubar({
  width: 500,
  height: 600,
  icon: './images/icon.png'
})

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


exports.openFile = function () {
  let files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'svg', 'png'] }
    ]
  });

  if (!files) { return; }

  let file = files[0];

  menubar.window.webContents.send('file-opened', file);
};




