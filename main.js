const electron = require('electron');
const _ = require('lodash');
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
const characteristicsFFF4Arr = [];

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

  ipcMain.on('connect', (event, arg) => {
    console.log('======= conncet to ===== ', arg);
    const filterData = _.filter(blueList, item => {
      if (arg.indexOf(item.name) > -1) {
        return true;
      }
    });
    filterData.forEach(item => {
      connect(item.peripheral);
    });
  });

  ipcMain.on('connect', (event, arg) => {
    console.log('======= conncet to ===== ', arg);
    const filterData = _.filter(blueList, item => {
      if (arg.indexOf(item.name) > -1) {
        return true;
      }
    });
    filterData.forEach(item => {
      connect(item.peripheral);
    });
  });

  ipcMain.on('moveUp', (event, arg) => {
    moveUp();
  });

  ipcMain.on('moveDown', (event, arg) => {
    moveDown();
  });

  ipcMain.on('moveStop', (event, arg) => {
    moveStop();
  });

  ipcMain.on('stopScan', (event, arg) => {
    noble.stopScanning();
  });

  noble.on('discover', peripheral => {
    const advertisement = peripheral.advertisement;
    const tmp = {
      peripheral,
      name: advertisement.localName,
      connected: false,
      checked: false,
    };

    if (blueNameList.indexOf(tmp.name) < 0) {
      blueList.push(tmp);
      blueNameList.push(tmp.name);
      scanEvent.sender.send('scanForResult', blueNameList);
    }
  });
}

function moveUp() {
  console.log('====== moveUp ===== ', characteristicsFFF4Arr);
  if (characteristicsFFF4Arr.length === 0) {
    return;
  }
  const buffer = new Buffer([0x01]);
  interval && clearInterval(interval);
  interval = setInterval(() => {
    characteristicsFFF4Arr.map(characteristic => {
      characteristic.write(buffer, true, () => {});
    });
  }, 200);
}

function moveDown() {
  if (characteristicsFFF4Arr.length === 0) {
    return;
  }
  const buffer = new Buffer([0x02]);
  interval && clearInterval(interval);
  interval = setInterval(() => {
    characteristicsFFF4Arr.map(characteristic => {
      characteristic.write(buffer, true, () => {});
    });
  }, 100);
}

function moveStop() {
  if (characteristicsFFF4Arr.length === 0) {
    return;
  }
  const buffer = new Buffer([0x00]);
  interval && clearInterval(interval);
  characteristicsFFF4Arr.map(characteristic => {
    characteristic.write(buffer, true, () => {});
  });
}

function connect(peripheral) {
  peripheral.connect(() => {
    console.log(
      '======= connected ====== ',
      peripheral.advertisement.localName,
    );
    peripheral.discoverServices([], (error, services) => {
      if (services[1].uuid === 'fff1') {
        services[1].discoverCharacteristics([], (err, characteristics) => {
          characteristicsFFF4Arr.push(characteristics[4]);
        });
      }
    });
  });
}

function disconnect(peripheral) {
  peripheral.disconnect(() => {
    console.log(
      '======= disconnected ====== ',
      peripheral.advertisement.localName,
    );
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
