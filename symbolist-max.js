
/**
 * input from Max JSON dict
 * --> semantic data input
 *      this is sent to the IO controller, 
 *      and then relayed to UI def mapping, 
 *      which then updates the view param dict
 * 
 */



const Max = require('max-api');;

const io_controller = require('./io_controller');
//const ui_controller = require('./ui_controller');
const utils = require('./lib/main_utils')

const symbolist_config = require('./symbolist-config.json');

function ui_send(msg){
    Max.outlet({
        ui_controller: msg
    });
}

io_controller.init({
    post: Max.post,
    outlet: Max.outlet, // maybe tag these to differentiate in max?
    ui_send
});

ui_send({
    key: 'init',
    val: {
        max: true,
        dirname: __dirname
    }
});


if (symbolist_config) {
    let files = utils.getFilesFromMenuFolderArray(symbolist_config['default-init-folder']);

    ui_controller.input({
        key: 'load-ui-defs',
        val: files
    });

    //send to io controller
    io_controller.input({
        key: "load-io-defs",
        val: files
    })

}



/*
Max.addHandler("html_template", (args) => drawsocket.setTemplate(args) );
Max.addHandler("writecache", (filename, prefix) => drawsocket.writeCache(filename, prefix) );
Max.addHandler("importcache", (filename, prefix) => drawsocket.importCache(filename, prefix) );
Max.addHandler("ping", (...prefix) => drawsocket.ping(prefix) );
Max.addHandler("statereq", (...prefix) => drawsocket.stateReq(prefix) );
*/
Max.addHandler(Max.MESSAGE_TYPES.DICT, (dict) => io_controller.input(dict));





 //io_controller.startUDP();