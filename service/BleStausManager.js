const noble = require('noble');

class BleStatusManager {
  constructor() {
    this.hardwareStatus = false;
    noble.on('stateChange', state => {
      console.log('========= stateChange ========', state);
      switch (state) {
        case 'poweredOn':
          this.hardwareStatus = true;
          break;
        case 'poweredOff':
          this.hardwareStatus = false;
          break;
        default:
          break;
      }
    });
  }

  hardware() {
    return this.hardwareStatus;
  }
}

module.exports = new BleStatusManager();