
const cluster = require('cluster');
const utils = require('./lib/main_utils')


if( cluster.isMaster )
{
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
        nodeIntegration: true
      }
    })
  
    // pass menu class the io controller and window for communcations
    // note that the menu still runs in the main thread
    menu.init(io_controller_proc, win)
/*
    globalShortcut.register('CommandOrControl+R', function() {
      console.log('CommandOrControl+R is pressed')
      win.reload()
    })
  */  
    win.loadFile('index.html')
  
    console.log(win);
    
    // Open the DevTools.
   // win.webContents.openDevTools()
  }
  
  app.on('ready', () => {

    createWindow();

    // note: did-finish-load is called on browser refresh
    win.webContents.on('did-finish-load', () => {

      if( symbolist_config )
      {
        let files = utils.getFilesFromMenuFolderArray(symbolist_config['default-init-folder']);

        console.log('symbolist_config', files);
        //send to editor ui
        win.webContents.send('load-ui-defs', files );

        //send to io controller
        io_controller_proc.send({
          key: "load-io-defs",
          val: files
        })


      }
      else
      {
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
            win.webContents.send('load-ui-defs', files );
            // << later send to io controller for user lookup scripts
  
            io_controller_proc.send({
              key: "load-io-defs",
              val: result.filePaths
            })

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
   
    if( !Array.isArray(msg) )
      msg = [ msg ];

    msg.forEach( m => win.webContents.send('io-message', m ) )
      

  });
  
 
  /**
   * messages from ui to io controller
   */
  ipcMain.on('renderer-event', (event, arg) => {
    io_controller_proc.send(arg)
  })
/*
  ipcMain.handle('query-event', async (event, ...args) => {
    const result = await somePromise(...args)
    return result
  })
*/
}
else if (cluster.isWorker) 
{
  const io_controller = require('./io_controller')

  // messages from UI
  process.on("message", (_msg) => {  
    io_controller.input(_msg);
  });

  io_controller.initUDP();

}

