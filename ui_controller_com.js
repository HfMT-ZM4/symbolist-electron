
/* global drawsocket:readonly  */

/**
 * symbolist renderer view module -- exported functions are at the the bottom
 */

const { ipcRenderer } = require('electron')


/**
 * 
 * @param {Object} obj input to drawsocket
 */
function drawsocketInput(obj){
    drawsocket.input(obj)
}

/**
 * handler for special commands from menu that require info about state of view/selection
 */
ipcRenderer.on('menu-call', (event, ...args) => {
    console.log(`menu call received ${args}`);

    let arg = args[0];
    switch(arg) {
        case 'deleteSelected':
            removeSelected();
            break;
        case 'zoomIn':
            symbolist_zoom(default_zoom_step);
            break;
        case 'zoomOut':
            symbolist_zoom(-default_zoom_step);
            break;
        case 'zoomReset':
            symbolist_zoomReset()
            break;
        case 'newScore':
            symbolist_newScore();
            break;
        case 'load-ui-defs':
            loadUIDefs(args[1]);
            break;

    }
})

/**
 * routes message from the io controller
 */
ipcRenderer.on('io-message', (event, obj) => {
    switch(obj.key){
        case 'data':
            iterateScore(obj.val);
            break;
        case 'model':
           // parseDataModelFromServer(obj.val);
            break;
        case 'score':
            console.log('score');
            symbolist_newScore();
            iterateScore(obj.val);
            break;
        case 'call':
            callFromIO(obj.val);
            break;
        case 'drawsocket':
            drawsocketInput(obj.val)
            break;
        default:
            break;
    }
})

ipcRenderer.on('load-ui-defs', (event, folder) => {
//    console.log('called from main.js?');
    loadUIDefs(folder);
})

ipcRenderer.on('set-dirname', (event, args) => {
    window.__symbolist_dirname = args;
});


function io_out(msg)
{
    sendToServer({
        key: 'io_out',
        val: {
            'return/ui' : msg
        }
    })
}


function symbolist_send(obj)
{
    ipcRenderer.send('symbolist_event', obj);
}


/**
 * 
 * @param {Object} obj object to send to controller
 */
function sendToServer(obj)
{
    ipcRenderer.send('renderer-event', obj);

}

/*
// not used now but could be useful if we want to deal with the lookup system from the gui
async function getDataForID(id)
{
    return ipcRenderer.invoke('query-event', id);
}

function asyncQuery(id, query, calllbackFn)
{
    ipcRenderer.once(`${id}-reply`, (event, args) => {
        calllbackFn(args) 
    })

    ipcRenderer.send('query', {
        id,
        query
    });
}
*/



module.exports = { 
    drawsocketInput,
    sendToServer, // renderer-event
    send: symbolist_send,
    io_out
 }