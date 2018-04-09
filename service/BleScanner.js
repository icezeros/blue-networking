const noble = require('noble');
const _ = require('lodash');
const bleStatusManager = require('./BleStausManager');
const BleController = require('./BleController');

class BleScanner {
  constructor() {
    this.time = 10;
    this.serviceUUID = '';
    this.scaningStatus = false;
    this.peripheralList = []; //扫描出所有的蓝牙设备集合
    this.nameList = []; //需要连接的蓝牙设备集合
    this.interval = setInterval(() => {
      if (this.time === 0) {
        console.log('========= startScanning ========');
        this.scaningStatus = true;
        noble.startScanning([this.serviceUUID], false);
      } else if (this.time > 10 && this.scaningStatus) {
        console.log('========= stopScanning ========');
        noble.stopScanning();
        this.scaningStatus = false;
        this.nameList = [];
      }
      this.time++;
    }, 1000);
    noble.on('discover', peripheral => {
      const advertisement = peripheral.advertisement;
      const tmp = {
        peripheral,
        name: advertisement.localName,
        connected: false,
        checked: false,
      };
      console.log('========= discover ========', tmp);
      const status = _.findIndex(this.peripheralList, o => o.name === tmp.name);
      if (status === -1) {
        this.peripheralList.push(tmp);
      }
      console.log('========= discover2 ========', this.nameList[0], tmp.name, this.nameList[0] === tmp.name);
      if (this.nameList[0] === tmp.name) {
        const bleController = new BleController(tmp);
      }
    });
  }

  scan({ serviceUUID = 'fff1', name }) {
    console.log('========= scan ========');
    this.time = 0;
    this.serviceUUID = serviceUUID;
    this.nameList.push(name);
  }
}

module.exports = new BleScanner();