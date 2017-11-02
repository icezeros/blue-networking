// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');

function init() {
  console.log('========= init ========');
  ipcRenderer.on('scanForResult', (event, arg) => {
    console.log('======= scanForResult ======== ', arg);
    const blueName = document.getElementById('blueName');
    blueName.innerText += `${arg.localName}\n`;
    document.getElementById('font').color = 'blue';
  });
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
