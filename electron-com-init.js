
const { ipcRenderer } = require('electron');


ipcRenderer.on('io-message', (event, obj) => {
    symbolist.input(obj);
});

symbolist.init({
    io_send: (msg) => ipcRenderer.send('renderer-event', msg)
})    
