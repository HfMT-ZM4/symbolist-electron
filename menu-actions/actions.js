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


module.exports = {
    init, // internal for initializing the module

    // actions:
    newScore,
    loadFiles,
    deleteSelected,
    buildModelLookup
}

