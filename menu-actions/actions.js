const {ipcMain, dialog} = require('electron')


let io_proc = null;
let win = null;

function init(_io_proc, _win)
{
  io_proc = _io_proc;
  win = _win;
}

async function loadFiles()
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

async function deleteSelected()
{
  win.webContents.send('menu-call', 'deleteSelected');
  // also delete in io_data
}


async function buildModelLookup()
{
  io_proc.send({
    key: 'symbolistEvent',
    val : {
      symbolistAction: 'buildModelLookup'
    }
  });
}


async function newScore()
{
    //send to io controller
    io_proc.send({
      key: "newScore"
    })

    win.webContents.send('menu-call', 'newScore');

}

async function save()
{

  dialog.showSaveDialog( {
    properties: ['showOverwriteConfirmation', 'createDirectory'],
    filters: [{
      name: 'JSON',
      extensions: ['json']
    }]
  }).then(result => {
    console.log(result.canceled)
    console.log(result.filePath)

    io_proc.send({
      key: "saveScore",
      val: result.filePath
    })

  }).catch(err => {
    console.error('save error', err)
  })

}

async function open()
{
  dialog.showOpenDialog( {
    properties: ['openFile'],
    filters: [{
      name: 'JSON',
      extensions: ['json']
    }]
  }).then(result => {
    console.log(result.canceled)
    console.log(result.filePaths)

    io_proc.send({
      key: "loadScore",
      val: result.filePaths[0]
    })

  }).catch(err => {
    console.log(err)
  })
}


module.exports = {
    init, // internal for initializing the module
    save,
    open,
    // actions:
    newScore,
    loadFiles,
    deleteSelected,
    buildModelLookup
}

