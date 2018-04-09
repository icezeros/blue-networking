const noble = require('noble');

const bleStatusManager = require('./BleStausManager');
const bleScanner = require('./BleScanner');

function connect({ serviceUUID = 'fff1', name }) {
  if (!name) {
    throw new Error('name is required');
  }
  bleScanner.scan({ serviceUUID, name });
}

connect({ name: 'Officewell#1000089' });
