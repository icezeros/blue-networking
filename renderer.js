// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');

function init() {
  console.log('========= init ========');
  ipcRenderer.on('scanForResult', (event, arg) => {
    console.log('======= scanForResult ======== ', arg);
    document.getElementById('font').color = 'blue';
    const p3 = document.getElementById('p3');
    let inht = '';
    arg.forEach((item, index) => {
      inht += `<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-${index}">
      <input type="checkbox" id="checkbox-${index}" class="mdl-checkbox__input" name=${item} >
      <span class="mdl-checkbox__label">${item}</span>
    </label>`;
    });
    p3.innerHTML = inht;
  });
}

function setText() {
  ipcRenderer.on('setText', (event, arg) => {
    console.log('======= scanForResult ======== ', arg);
    document.getElementById('font').color = 'blue';
  });
}
function connect() {
  const checkboxs = document.getElementsByClassName('mdl-checkbox__input');
  console.log(checkboxs.length);

  const result = [];
  for (let i = 0; i < checkboxs.length; i++) {
    const tmp = checkboxs[i];
    if (tmp.checked) {
      result.push(tmp.name);
    }
  }
  ipcRenderer.send('connect', result);
}

function scan() {
  console.log('===== scan ======');
  ipcRenderer.send('scan', 'arg');
}

function moveUp() {
  ipcRenderer.send('moveUp', 'arg');
}

function moveDown() {
  ipcRenderer.send('moveDown', 'arg');
}

function moveStop() {
  ipcRenderer.send('moveStop', 'arg');
}
