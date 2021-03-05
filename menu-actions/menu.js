const { app, Menu } = require('electron')
const actions = require('./actions')
const isMac = process.platform === 'darwin'


let io_proc = null;
let win = null;
let menu = null;

function createTemplate()
{
  return [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label: "New From Template...",
          accelerator: 'CommandOrControl+N',
          click: async () => { actions.newScore() }
        },
        {
          label: "Open...",
          accelerator: 'CommandOrControl+O',
          click: async () => { actions.open() }
        },
        {
          label: "Save as...",
          accelerator: 'CommandOrControl+Shift+S',
          click: async () => { actions.save() }
        },
        { 
          label: 'Load Defs...',
          click: async () => {
              actions.addDefsFromFolder();
          }
        },          
          { 
            label: 'Build Model Lookup...',
            click: async () => {
                actions.buildModelLookup();
            }
        },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
         // { role: 'delete' },
          { 
            label: 'Delete',
            accelerator: 'Backspace',
            click: async () => {
                actions.deleteSelected();
            }
          },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startspeaking' },
              { role: 'stopspeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { 
          label: 'Zoom/Scroll Reset', 
          accelerator: 'CommandOrControl+0',
          click: async () => {
            win.webContents.send('menu-call', 'zoomReset')
          }
        },
        { 
          label: 'Zoom In', 
          accelerator: 'CommandOrControl+=',
          click: async () => {
            win.webContents.send('menu-call', 'zoomIn')
          }
        },
        { 
          label: 'Zoom Out', 
          accelerator: 'CommandOrControl+-',
          click: async () => {
            win.webContents.send('menu-call', 'zoomOut')
          }
        },      
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]
}

function init(_io_proc, _win)
{
  io_proc = _io_proc;
  win = _win;
  actions.init(io_proc, win)

  let template = createTemplate();
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

module.exports = {
    init
}