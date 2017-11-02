
// global.$ = $;
const {ipcRenderer} = require('electron')
//监听mian process里发出的message

function init() {
    window.G = {};
    G.setting = {};

    ipcRenderer.on('import_file', (event, arg) => {
        // alert("web2" + arg);// prints "pong"  在electron中web page里的console方法不起作用，因此使用alert作为测试方法
        if (arg && arg.res) {
            console.log(arg.data)
            show_file(arg.data)
        }
    });
    ipcRenderer.on('get_default_setting', (event, arg) => {
        // alert("web2" + arg);// prints "pong"  在electron中web page里的console方法不起作用，因此使用alert作为测试方法
        if (arg && arg.outPath) {
            G.setting = arg.setting;
            let default_export_file = document.getElementById('default_export_file')
            default_export_file.innerText = arg.outPath;
            console.log(G.setting)
        }
    });


    ipcRenderer.on('show_progress', (event, arg) => {

        // alert("web2" + arg);// prints "pong"  在electron中web page里的console方法不起作用，因此使用alert作为测试方法
        if (arg) {
            console.log(arg.num)
            let p3 = document.getElementById('p3');
            console.log(p3)

            if (arg.finish) {
                document.getElementById('export-finish').innerText = '导出完成';
            } else {
                p3.style.display = 'block';
                let rr = "总数：" + arg.total + "<br />"
                    + "   word完成：" + arg.word + "&#12288;&#12288;&#32;" + arg.wordPath + "<br />"
                    + "   pdf完成：" + arg.pdf + "&#12288;&#12288;&#12288;" + arg.pdfPath + "<br />"
                    + "   jpeg完成：" + arg.jpeg + "&#12288;&#12288;&#32;&#32;&#32;&#160;" + arg.jpegPath;
                p3.innerHTML = rr;
            }
            // document.querySelector('#p3').MaterialProgress.setBuffer((arg.num * 100 / arg.total) + 16);

        }
    });

    ipcRenderer.on('alert_message', (event, message) => {
        console.log(message)
        alert(message)

    });
    ipcRenderer.on('default_message', (event, message) => {
        console.log(message)
        document.getElementById('tem-folder').innerText = '模板文件请放在：   ' + message + '  下';

    });


    ipcRenderer.send('get_default_setting', '');



}
// init();
function show_file(file) {
    console.log("---====---==--")
    var holder = document.getElementById('drag-file');
    var filePath = document.getElementById('file-path');



    // for (let f of e.dataTransfer.files) {

    filePath.innerText = file;

    // console.log('File(s) you dragged here: ', e.dataTransfer.files[0].path)
    // }

}




function open_file() {
    //在web page里向main process发出message
    ipcRenderer.send('open_file', 'ping111') // prints "pong"   
    // ipcRenderer.sendSync('synchronous-message', 'ping') // prints "pong"   
    // alert("web1" + 'ping');

}
function export_file() {
    //在web page里向main process发出message
    let p3 = document.getElementById('p3');
    p3.innerText = "";
    ipcRenderer.send('export_file', 'ping111') // prints "pong"   
    // ipcRenderer.sendSync('synchronous-message', 'ping') // prints "pong"   
    // alert("web1" + 'ping');

}
function set_open() {
    //在web page里向main process发出message
    ipcRenderer.send('set_open', 'ping111') // prints "pong"   
    // ipcRenderer.sendSync('synchronous-message', 'ping') // prints "pong"   
    // alert("web1" + 'ping');

}

function set_export() {
    ipcRenderer.send('set_export', 'ping111')


}

