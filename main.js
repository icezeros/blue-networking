const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');
const noble = require('noble');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let scanEvent;
let interval;
const blueList = [];
const blueNameList = [];
const characteristicsArr = [];

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );
  // mainWindow.loadURL('https://ali.demo.officewell.co')
  // mainWindow.loadURL('http://www.baidu.com');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  ipcMain.on('scan', (event, arg) => {
    scanEvent = event;
    noble.startScanning([], true);
  });

  ipcMain.on('connect', (event, arg) => {});

  ipcMain.on('moveUp', (event, arg) => {
    // event.sender.send('scanForResult', 'ping');
    moveUp();
  });

  ipcMain.on('moveDown', (event, arg) => {
    // event.sender.send('scanForResult', 'ping');
    moveDown();
  });

  ipcMain.on('moveStop', (event, arg) => {
    // event.sender.send('scanForResult', 'ping');
    moveStop();
  });

  noble.on('discover', peripheral => {
    const advertisement = peripheral.advertisement;
    const tmp = {
      advertisement,
      name: advertisement.name,
      connected: false,
      checked: false,
    };
    blueList.push(tmp);
    scanEvent.sender.send('scanForResult', blueList);
    // if (
    //   (advertisement.localName === 'Officewell#1000090' &&
    //     advertisement.serviceUuids.length > 0) ||
    //   (advertisement.localName === 'Officewell#1000089' &&
    //     advertisement.serviceUuids.length > 0) ||
    //   (advertisement.localName === 'Officewell#1000098' &&
    //     advertisement.serviceUuids.length > 0)
    // ) {
    //   // noble.stopScanning();
    //   console.log('======== advertisement ========== ');
    //   scanEvent.sender.send('scanForResult', advertisement);
    //   connect(peripheral);
    // }
  });
}

function moveUp() {
  console.log('====== moveUp ===== ', characteristicsArr);
  if (characteristicsArr.length === 0) {
    return;
  }
  const buffer = new Buffer([0x01]);
  interval && clearInterval(interval);
  interval = setInterval(() => {
    characteristicsArr.map(characteristic => {
      characteristic.write(buffer, true, () => {});
    });
  }, 200);
}

function moveDown() {
  if (characteristicsArr.length === 0) {
    return;
  }
  const buffer = new Buffer([0x02]);
  interval && clearInterval(interval);
  interval = setInterval(() => {
    characteristicsArr.map(characteristic => {
      characteristic.write(buffer, true, () => {});
    });
  }, 100);
}

function moveStop() {
  if (characteristicsArr.length === 0) {
    return;
  }
  const buffer = new Buffer([0x00]);
  interval && clearInterval(interval);
  characteristicsArr.map(characteristic => {
    characteristic.write(buffer, true, () => {});
  });
}

function connect(peripheral) {
  peripheral.connect(() => {
    console.log('======= connect ====== ', peripheral.advertisement.localName);
    peripheral.discoverServices([], (error, services) => {
      if (services[1].uuid === 'fff1') {
        services[1].discoverCharacteristics([], (err, characteristics) => {
          characteristicsArr.push(characteristics[4]);
        });
      }
    });
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
