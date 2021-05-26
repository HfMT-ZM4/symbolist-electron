
const { ipcRenderer, contextBridge } = require('electron');

/*
let receive_msg_cb = (msg) => { console.log('not set yet!'); };

contextBridge.exposeInMainWorld(
    'electron',
    {
        io_send: (msg) => ipcRenderer.send('renderer-event', msg),
        set_receiver_fn: (cb) => { receive_msg_cb = cb } // symbolist.input
    }
)

ipcRenderer.on('io-message', (event, obj) => {
    receive_msg_cb(obj);
});
*/
console.log("preload config");

contextBridge.exposeInMainWorld('electron', {
    io_send: (data) => ipcRenderer.send("renderer-event", data ),
    set_receiver_fn: (fn) => {
      const saferFn = (event, ...args) => fn(...args)
      // Deliberately strip event as it includes `sender` 
      ipcRenderer.on('io-message', saferFn);
      return saferFn; // Return the newly created function so the user can store it somewhere and later remove it.
    }
  });