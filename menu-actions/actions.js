const {ipcMain, dialog} = require('electron')
const fs = require('fs')
const path = require('path')

function getFilesFromMenuFolderArray(folder)
{
    const fullpath = path.resolve('./', folder);

   // const folder = folderArray[0];
    console.log('loadUserFolder', fullpath);

    let files = [];

    fs.readdirSync(fullpath, 'utf-8').forEach( name => {
        files.push({
          name,
          type: name.split('.').pop()
        });
    });

    return {
        path: fullpath,
        files
    }
}


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
    dialog.showOpenDialog( {
      properties: ['openFile', 'openDirectory']
    }).then(result => {
      console.log(result.canceled)
      console.log(result.filePaths)

      if( !result.canceled )
      {

        win.webContents.send('menu-call', 'newScore');
        io_proc.send({
          key: "newScore"
        })

        let files = getFilesFromMenuFolderArray( result.filePaths[0] );

        console.log('newScore', files);
        
        win.webContents.send('menu-call', 'load-ui-defs', files );

        io_proc.send({
          key: "load-io-defs",
          val: files
        })
        
      }
      

    }).catch(err => {
      console.log(err)
    })




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

