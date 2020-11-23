
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
  const menu = require('./menu-actions/menu') // init after creating cluster and win

  const io_controller_proc = cluster.fork();
  let win = null
  
  function createWindow () 
  {
  
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      title: 'symbolist',
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    // pass menu class the io controller and window for communcations
    // note that the menu still runs in the main thread
    menu.init(io_controller_proc, win)

    globalShortcut.register('CommandOrControl+R', function() {
      console.log('CommandOrControl+R is pressed')
      win.reload()
    })
    
    win.loadFile('index.html')
  
    console.log(win);
    
    // Open the DevTools.
   // win.webContents.openDevTools()
  }
  
  app.on('ready', () => {

    createWindow();

    // note: did-finish-load is called on browser refresh
    win.webContents.on('did-finish-load', () => {

      dialog.showOpenDialog(win, {
        message: "Please select Symbolist init folder",
        properties: ['openDirectory', ]//, //'openFile', 'multiSelections'
        /*filters: [{ 
          name: "JavaScript", 
          extensions: ['js'] 
        }]*/
      }).then(result => {
        if( result.canceled )
        {
          console.log( 'selection canceled, now what?')
        }
        else
        {
        // console.log('result', result)
        
          // could send directly to renderer here also
          win.webContents.send('load-ui-defs', result.filePaths);

          io_controller_proc.send({
            key: "loadInitFiles",
            val: result.filePaths
          })
        }
      
      }).catch(err => {
        console.log(err)
      })

      /*
      io_controller_proc.send({
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
  

  /**
   * messages from io_controller
   */
  io_controller_proc.on('message', (msg)=> {

    // remove this draw thing
    if( msg.key == 'draw' )
    {
   //   console.log('main recieved and sending', JSON.stringify(msg.val, null, 2));

      win.webContents.send('draw-input', msg.val);
    }
    else
    {
      // general catch all
      
      // maybe better to wrap array in object rather than iterated in main thread
      if( !Array.isArray(msg) )
        msg = [ msg ];

      msg.forEach( m => win.webContents.send(m.key, m.val) )
      

    }
    

  //  console.log('main recieved', msg);
  });
  
 
  /**
   * messages from ui to io controller (menu events are )
   */

  ipcMain.on('renderer-event', (event, arg) => {
    io_controller_proc.send(arg)
  })

  ipcMain.handle('query-event', async (event, ...args) => {
    const result = await somePromise(...args)
    return result
  })

}
else if (cluster.isWorker) 
{
  const io_controller = require('./io_controller')

  const osc = require('osc')

  /**
   * UDP I/O
   */
  const dgram = require('dgram');
  const server = dgram.createSocket('udp4');
    
  server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
  });


  server.on('message', (msg, rinfo) => {    
    parseAsync(msg)
      .then( obj_ => {
        console.log(`parsed message ${obj_}`) 
       // win.webContents.send('draw-input', obj_ )
      }).catch( err => {
        console.log(`parse error: ${err}\n for message ${msg}`) 
      })

  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
  });

  server.bind(8888);

  const client = dgram.createSocket('udp4');

  let buffer = osc.writePacket({
      timeTag: osc.timeTag(0),

      packets: [
          {
              address: "/carrier/frequency",
              args: [
                  {
                      type: "f",
                      value: 440
                  }
              ]
          },
          {
              address: "/carrier/amplitude",
              args: [
                  {
                      type: "f",
                      value: 0.5
                  }
              ]
          }
      ]
  });

  client.send(buffer, 7777, (err) => {
    console.error('send err', err);
  });
  
  io_controller.setUDP(server);

  // messages from UI
  process.on("message", (_msg) => {
    
    io_controller.input(_msg);
   
  });



}

