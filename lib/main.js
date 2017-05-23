const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const dialog = electron.dialog;

let mainWindow = null;

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 900,
  });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

function selectDirectory() {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
}

exports.openFile = function () {
  let files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'svg', 'png'] }
    ]
  });

  if (!files) { return; }

  let file = files[0];

  mainWindow.webContents.send('file-opened', file);
};
