const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;
const dialog = electron.dialog;

let mainWindow = null;

app.on('ready', function () {
  mainWindow = new BrowserWindow();

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  openFile();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

const openFile = function () {
  let files = dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['jpg', 'jpeg', 'svg', 'png'] }
    ]
  });

  if (!files) { return; }

  let file = files[0];

  // let content = fs.readFileSync(file);

  mainWindow.webContents.send('file-opened', file);
};
