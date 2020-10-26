
const cluster = require('cluster');


const parseAsync = (obj_str) => {
  return Promise.resolve().then( () => {
    if( typeof obj_str == 'String' )
      return JSON.parse( obj_str )  // max sends a trailing comma for some reason
    else
    {
      let _str = obj_str.toString('utf8');
      return JSON.parse(_str.slice( 0, _str.lastIndexOf('}')+1 ));
    }/*
    else
    {
      return obj_str;
    }*/
  })
}

if( cluster.isMaster )
{
  const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron')
  const menu = require('./menu') // init after creating cluster and win

  const dgram = require('dgram');
  const server = dgram.createSocket('udp4');

  const controller_proc = cluster.fork();
  let win = null
  
  function createWindow () {
  
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      title: 'symbolist',
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    menu.init(controller_proc, win)

    globalShortcut.register('CommandOrControl+R', function() {
      console.log('CommandOrControl+R is pressed')
      win.reload()
    })
    
    // and load the index.html of the app.
    win.loadFile('index.html')
  
    console.log(win);
    
    // Open the DevTools.
   // win.webContents.openDevTools()
  }
  
  app.on('ready', () => {
    createWindow();

    win.webContents.on('did-finish-load', () => {
  //    console.log('test');
      /*
      win.webContents.send('draw-input', {
        key: 'svg',
        val: {
          new: 'rect',
          id: 'foo',
          x: 10,
          y: 10,
          width: 20,
          height: 20
        }
      })
      */

    dialog.showOpenDialog(win, {
      message: "Please select Symbolist JSON setup files",
      properties: ['openFile', 'multiSelections'],
      filters: [{ 
        name: "JSON", 
        extensions: ['json'] 
      }]
    }).then(result => {
      if( result.canceled )
      {
        console.log( 'selection canceled, now what?')
      }
      else
      {
        controller_proc.send({
          key: "loadInitFiles",
          val: result.filePaths
        })
      }
      //console.log(result.filePaths)
     
    }).catch(err => {
      console.log(err)
    })

      /*
      controller_proc.send({
        key: 'init'
      });
      */

    })
  })
      
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
  
  // UDP server
  
  server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });
  
  
  server.on('message', (msg, rinfo) => {    
    parseAsync(msg)
      .then( obj_ => {
        win.webContents.send('draw-input', obj_ )
      }).catch( err => {
        console.log(`parse error: ${err}\n for message ${msg}`) 
      })
  
  });
  
  server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });
  
  server.bind(8888);


  controller_proc.on('message', (msg)=> {
    if( msg.key == 'draw' )
    {
   //   console.log('main recieved and sending', JSON.stringify(msg.val, null, 2));

      win.webContents.send('draw-input', msg.val);
    }
    else if( msg.key == 'load-ui-file')
    {
      win.webContents.send('load-ui-file', msg.val);

    }
    else if( msg.key == 'signal-gui-script' )
    {
      win.webContents.send('signal-gui-script', msg.val);
    }

  //  console.log('main recieved', msg);
  });
  
 // controller_proc.send('ping');


  ipcMain.on('symbolist_event', (event, arg) => {
    controller_proc.send(arg)
    //event.sender.send('asynchronous-reply', 'pong')
  })
  
  ipcMain.on('click',  (event, arg) => {
    //event.sender.send('asynchronous-reply', 'pong')
    console.log(arg);
  })




}
else if (cluster.isWorker) 
{
  const sym_util = require('./utils.js')
  const controller = require('./symbolist_controller')

  process.on("message", (_msg) => {
    
    controller.input(_msg);

    //console.log('cluster received msg', _msg);

    /*
    parseAsync(_msg)
      .then(obj_ => {
        // let matrix = sym_util.matrixFromString('matrix(1 1 1 0 0 0)');
        console.log('cluster received', obj_);
      })
      .catch( err => console.log('parse err', err) )
    */
   
  });
}

