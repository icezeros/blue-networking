const characteristicUUIDs = ['fff0', 'fff1', 'fff2', 'fff3', 'fff4', 'fff5', 'fff6', 'fff7', 'fff8', 'ffff']

class BleController {
  constructor(props) {
    this.props = props;
    this.connect(props.peripheral);
    this.discoverServicesAndCharacteristics = this.discoverServicesAndCharacteristics.bind(this);
  }

  // 销毁interval、timer
  destructor() {
    this.timer && clearTimeout(this.timer);
    this.clearInterval && clearInterval(this.interval);
    this.timer = null;
    this.clearInterval = null;
  }

  connect(peripheral) {
    peripheral.connect(err => {
      console.log('========= connect ======== err = ', err);
      if (err) {
        throw new Error('connect error');
      }
      peripheral.discoverSomeServicesAndCharacteristics([], characteristicUUIDs, this.discoverServicesAndCharacteristics);
    });
  }

  // 发现所有的服务uuid与特征值uuid
  discoverServicesAndCharacteristics(error, services, characteristics) {
    const buffer = new Buffer([0x11]);
    this.interval && clearInterval(this.interval);
    // 开启定时器，不间断发送上升到记忆位置2指令。
    this.interval = setInterval(() => {
      characteristics[4].write(buffer, false, () => { });
    }, 200);
    this.timer && clearTimeout(this.timer);
    // 检测发送15s后断开连接
    this.timer = setTimeout(() => {
      this.disconnect();
    }, 15 * 1000);
  }

  disconnect() {
    this.props.peripheral.disconnect(err => {
      if (err) {
        throw new Error('disconnect exception');
      }
      this.destructor();
    });
  }
}

module.exports = BleController;