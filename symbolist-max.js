
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
const utils = require('./lib/main_utils')

const symbolist_config = require('./symbolist-config.json');

function ui_send(msg){
    Max.outlet({
        ui_controller: msg
    });
}

function io_outlet(msg) {
    Max.outlet({
        io_out: msg
    });
}

io_controller.init({
    post: Max.post,
    outlet: (msg) => io_outlet(msg),
    ui_send
});

ui_send({
    key: 'init',
    val: {
        max: true,
        dirname: __dirname
    }
});


function init()
{
    if (symbolist_config) {

        io_controller.input({
            key: "import-io-def-bundle",
            val: symbolist_config['io_defs']
        });
    
        ui_send({
            key: 'load-ui-defs',
            val: ''
        });
    
    }
    
}



/*
Max.addHandler("html_template", (args) => drawsocket.setTemplate(args) );
Max.addHandler("writecache", (filename, prefix) => drawsocket.writeCache(filename, prefix) );
Max.addHandler("importcache", (filename, prefix) => drawsocket.importCache(filename, prefix) );
Max.addHandler("ping", (...prefix) => drawsocket.ping(prefix) );
Max.addHandler("statereq", (...prefix) => drawsocket.stateReq(prefix) );
*/
Max.addHandler("bang", () => init() );
Max.addHandler(Max.MESSAGE_TYPES.DICT, (obj) => {
    if( typeof obj.init != "undefined" ){
        init();
    }
    else
        io_controller.input(obj)
});


init();


 //io_controller.startUDP();