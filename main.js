const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');
const noble = require('noble');
const _ = require('lodash');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let scanEvent;
let controlCharacteristic;
const blueList = [];
const blueNameList = [];

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

  ipcMain.on('moveUp', (event, arg) => {
    // event.sender.send('scanForResult', 'ping');
    console.log('====== moveUp ===== ', controlCharacteristic);
    if (controlCharacteristic.uuid === 'fff4') {
      const buffer = new Buffer([0x01]);
      controlCharacteristic.write(buffer, true, () => {});
    }
  });

  ipcMain.on('moveDown', (event, arg) => {
    // event.sender.send('scanForResult', 'ping');
    if (controlCharacteristic.uuid === 'fff4') {
      const buffer = new Buffer([0x02]);
      controlCharacteristic.write(buffer, true, () => {});
    }
  });

  noble.on('discover', peripheral => {
    const advertisement = peripheral.advertisement;
    /*  if (
      advertisement.localName === 'Officewell#1000089' &&
      advertisement.serviceUuids.length > 0
    ) {
      noble.stopScanning();
      console.log('======== advertisement ========== ', advertisement);
      scanEvent.sender.send('scanForResult', advertisement);
      peripheral.connect(() => {
        console.log('======= connect ======');
        peripheral.discoverServices([], (error, services) => {
          console.log('======== discoverServices ======== ', services);
          if (services[1].uuid === 'fff1') {
            services[1].discoverCharacteristics([], (err, characteristics) => {
              console.log(
                '======== discoverCharacteristics ====== ',
                characteristics,
              );
              controlCharacteristic = characteristics[4];
            });
          }
        });
      });
    } */
    if (blueNameList.indexOf(advertisement.localName) < 0) {
      const tmp = {
        blueNameList,
      };

      blueNameList.push(advertisement.localName);
      blueList.push(tmp);

      console.log('======== advertisement ========== ', advertisement);
      scanEvent.sender.send('scanForResult', advertisement);
      peripheral.connect(() => {
        console.log('======= connect ======');
        peripheral.discoverServices([], (error, services) => {
          console.log('======== discoverServices ======== ', services);
          if (services[1].uuid === 'fff1') {
            services[1].discoverCharacteristics([], (err, characteristics) => {
              console.log(
                '======== discoverCharacteristics ====== ',
                characteristics,
              );
              tmp.controlCharacteristic = characteristics[4];
              controlCharacteristic = characteristics[4];
            });
          }
        });
      });
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// function
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
