
const {ipcRenderer} = require('electron')



function init() {
    window.G = {};
    G.setting = {}
    G.template = '<div class="mdl-grid pd-none"> ' +
        '<div class="mdl-cell mdl-cell--3-col mg-none"> ' +
        '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"> ' +
        '<label class="mdl-textfield__label" id={{template_file_id}} >{{template_file}}</label> ' +
        '</div> ' +
        '</div> ' +
        '<div class="mdl-cell mdl-cell--5-col mg-none"> ' +
        '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"> ' +
        '<input type="text" class="mdl-textfield__input" for="{{id}}" oninput="text_change({{template_file_id}},this)" value="{{file_value}}"/> ' +
        '</div> ' +
        '</div> ' +
        '<div class="mdl-cell mdl-cell--3-col mg-none pd-v-sm "> ' +
        '</div> ' +
        '</div>';


    ipcRenderer.on('get_default_setting', (event, arg) => {
        // alert("web2" + arg);// prints "pong"  在electron中web page里的console方法不起作用，因此使用alert作为测试方法
        if (arg && arg.outPath) {
            G.setting = arg.setting;
            G.templateFiles = arg.templateFiles;
            // let default_export_file = document.getElementById('default_export_file')
            // default_export_file.innerText = arg.outPath;
            // console.log(G.setting)
            let template_options = "";
            console.log(G)
            G.templateFiles.forEach(function (e) {
                console.log(e)
                template_options += '<option>' + e + '</option>';
            })
            console.log(template_options)
            // G.template.replace('template_options', template_options);

            let temArr = [];
            G.templateFiles.forEach(function (v, k) {
                let tmpTemplate = G.template;
                tmpTemplate = tmpTemplate.replace(/^\s*/, '').replace(/\s*$/, '');

                let fileName = "";
                G.setting.templates.forEach(function (dd) {
                    console.log(dd.name, v)
                    if (dd.name === v) {
                        fileName = dd.fileName;
                    }
                });
                tmpTemplate = tmpTemplate.replace('{{template_file}}', v).replace('{{file_value}}', fileName).replace('{{template_file_id}}', v).replace('{{template_file_id}}', "'" + v + "'");
                temArr.push(tmpTemplate)
            })
            console.log(temArr);
            let box = document.getElementById('_js-template-box');
            box.innerHTML = temArr.join('');
            let select = document.getElementsByClassName('_js-select-box')
        }
    });

    ipcRenderer.on('get_default_setting', (event, arg) => {
        // alert("web2" + arg);// prints "pong"  在electron中web page里的console方法不起作用，因此使用alert作为测试方法
        if (arg && arg.outPath) {
            G.setting = arg.setting;
            let default_export_file = document.getElementById('pdf')
            default_export_file.value = arg.outPath;

            document.getElementById('word').value = G.setting.wordPath;
            document.getElementById('pdf').value = G.setting.pdfPath;
            document.getElementById('jpeg').value = G.setting.jpegPath;
            console.log("=====", G.setting)
        }
    });



    ipcRenderer.send('get_default_setting', '');


}

function set_export(e) {
    console.log(e);

    ipcRenderer.send('set_export', e)
}

function text_change(txt, e) {
    console.log(txt, e.value)
    ipcRenderer.send('set_outFile_name', {
        name: txt,
        fileName: e.value
    })
}



function render2(template) {
    var temArr = [];
    var obj = {
        template: {
            word: true,
            pdf: true,
            jpeg: true
        },
        arr: [
            { value: 12345 },
            { value: 12345 },
            { value: 12345 },
            { value: 12345 },
            { value: 12345 }
        ]
    }
    var box = document.getElementById('_js-template-box');

    var string = template.replace(/^\s*/, '').replace(/\s*$/, '');
    obj.arr.forEach(function (result, key) {
        temArr.push(string.replace('{{urlId}}', 'urlId' + key).replace('{{id}}', 'id' + key).replace(/{{key}}/g, key))
    });
    box.innerHTML = temArr.join('');
    var select = document.getElementsByClassName('_js-select-box')
    document.getElementById('word').setAttribute('checked', 'true');
    document.getElementById('pdf').checked = obj.template.pdf;
    console.log(obj.template.jpeg)
    document.getElementById('jpeg').checked = true;

}


function render(obj) {
    var temArr = [];
    var box = document.getElementById('_js-template-box');
    var template = '<div class="mdl-grid pd-none"> ' +
        '<div class="mdl-cell mdl-cell--4-col mg-none"> ' +
        '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"> ' +
        '<select class="mdl-textfield__input _js-select-box"  id="sample7"> ' +
        '<option value="1"></option> ' +
        '<option>选项一</option> ' +
        '</select> ' +
        '<label class="mdl-textfield__label" for="sample7">标题</label> ' +
        '</div> ' +
        '</div> ' +
        '<div class="mdl-cell mdl-cell--5-col mg-none"> ' +
        '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label"> ' +
        '<input type="text" class="mdl-textfield__input" id="{{id}}"/> ' +
        '<label class="mdl-textfield__label" for="{{id}}">标题</label> ' +
        '</div> ' +
        '</div> ' +
        '<div class="mdl-cell mdl-cell--3-col mg-none pd-v-sm "> ' +
        '<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onclick="pushOrSplice(\'push\',{{key}})">添加 ' +
        '</button> ' +
        '<button class="mdl-button mdl-js-button mdl-button--raised" onclick="pushOrSplice(\'splice\',{{key}})">删除 </button> ' +
        '</div> ' +
        '</div>';
    var string = template.replace(/^\s*/, '').replace(/\s*$/, '');
    obj.arr.forEach(function (result, key) {
        temArr.push(string.replace('{{urlId}}', 'urlId' + key).replace('{{id}}', 'id' + key).replace(/{{key}}/g, key))
    });
    box.innerHTML = temArr.join('');
    var select = document.getElementsByClassName('_js-select-box')
    document.getElementById('word').setAttribute('checked', 'true');
    document.getElementById('pdf').checked = obj.template.pdf;
    console.log(obj.template.jpeg)
    document.getElementById('jpeg').checked = true;
}
// var obj
// window.onload = function bbb() {
//     obj = {
//         template: {
//             word: true,
//             pdf: true,
//             jpeg: true
//         },
//         arr: [
//             { value: 12345 },
//             { value: 12345 },
//             { value: 12345 },
//             { value: 12345 },
//             { value: 12345 }
//         ]
//     }
//     render(obj)

// };
function pushOrSplice(judge, key) {
    if (judge == 'push') {
        obj.arr.push({})
    } else {
        obj.arr.splice(key, 1)
    }
    render(obj)
}
