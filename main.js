
const cluster = require('cluster');
const utils = require('./lib/main_utils')

if( cluster.isMaster )
{
  const path = require('path');
  const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require('electron')
  const menu = require('./menu-actions/menu') // init after creating cluster and win

  const symbolist_config = require('./symbolist-config.json');

  const io_controller_proc = cluster.fork();
  let win = null
  
  function createWindow () 
  {
  
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      title: 'symbolist',
      backgroundColor: `rgb(50, 50, 50)`,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, './electron-com-init.js')        
      }
      
    })
  
    // pass menu class the io controller and window for communcations
    // note that the menu still runs in the main thread
    menu.init(io_controller_proc, win)

    win.loadFile('index.html')
  
    console.log(win);
    
    // Open the DevTools.
   // win.webContents.openDevTools()
  }
  
  app.on('ready', () => {

    createWindow();

    // note: did-finish-load is called on browser refresh
    win.webContents.on('did-finish-load', () => {

     // win.webContents.send( "set-dirname", __dirname );
/*
// don't need this anymore since the defs are bundled
      win.webContents.send('io-message', {
        key: 'set-dirname', 
        val: __dirname
      });
*/
      if( symbolist_config )
      {

        io_controller_proc.send({
          key: "import-io-def-bundle",
          val: symbolist_config['io_defs']
        });

        win.webContents.send('io-message', {
          key: 'load-ui-defs', 
          val: {}//files
        });

      }
      else
      {
        // this won't work anymore now with the new bundle version
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
          
            let files = utils.getFilesFromMenuFolderArray(result.filePaths[0]);

            io_controller_proc.send({
              key: "load-io-defs",
              val: result.filePaths
            })

            win.webContents.send('io-message', {
              key: 'load-ui-defs', 
              val: files
            });

          }
        
        }).catch(err => {
          console.log(err)
        })
      }
      
      console.log();

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
   * (currently assumes all messages are meant for the ui controller)
   */
  io_controller_proc.on('message', (msg)=> {
   
    console.log("received msg", msg);
    if( !Array.isArray(msg) )
      msg = [ msg ];

    msg.forEach( m => win.webContents.send('io-message', m ) )
      

  });
  
 
  /**
   * messages from ui to io controller
   */
  ipcMain.on('renderer-event', (event, arg) => {
    console.log(arg);
    io_controller_proc.send(arg)
  })

}
else if (cluster.isWorker) 
{
  const io_controller = require('./io_controller')

  io_controller.init({
    ui_send: (msg) => process.send(msg),
    enable_udp: true,
    udp_listen_port: 9999,
    udp_send_port: 7777,
    udp_send_ip: "127.0.0.1"
  })

  // messages from UI
  process.on("message", (_msg) => {  
    io_controller.input(_msg);
  });

  io_controller.startUDP();

}

