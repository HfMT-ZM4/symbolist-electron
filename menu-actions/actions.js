const {ipcMain, dialog} = require('electron')


let controller_proc = null;
let win = null;

function init(_controller, _win)
{
    controller_proc = _controller;
    win = _win;
}

function loadFiles()
{
      dialog.showOpenDialog( {
        properties: ['openFile', 'openDirectory']
      }).then(result => {
        console.log(result.canceled)
        console.log(result.filePaths)
      }).catch(err => {
        console.log(err)
      })
}

function copyFromHTML()
{
   
}

function deleteSelected()
{
  win.webContents.send('menu-call', 'deleteSelected');
}


function buildModelLookup()
{
  controller_proc.send({
    key: 'symbolistEvent',
    val : {
      symbolistAction: 'buildModelLookup'
    }
  });
}

module.exports = {
    init,
    loadFiles,
    deleteSelected,
    buildModelLookup
}

