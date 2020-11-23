const fs = require('fs');
const path = require('path');
const sym_util = require('./lib/utils')
const { js2osc } = require('./lib/js2osc.js')

const dgram = require('dgram');
const osc = require('osc/src/osc');


let udp_server;
let sendToIP = '127.0.0.1';
let sendPort = 7777;

/**
 * 
 * @param {string} path -- path to file to require, relative to symbolist root folder
 */
global.root_require = function(path) {
    return require(__dirname + '/' + path);
}



function initUDP()
{

    console.log(sym_util.fairlyUniqueString());

    udp_server = dgram.createSocket('udp4');;

    udp_server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });


    udp_server.on('message', (msg, rinfo) => {  
        console.log(msg);

        // now only osc, and will be synchronous
        let str = msg.toString('utf-8');
       // console.log(str); // boolean

        if( str.startsWith('#bundle'))
        {
            try {
                let osc_bundle = osc.readPacket(msg, { metadata: true });
                console.log(osc_bundle);
                console.error(`osc_bundles aren't used yet`);

            }
            catch(err) {
                console.error('malformed osc bundle', err);
            }
        }
        else
        {
            sym_util.parseAsync(str).then( obj => {
                udpRecieve(obj);
            })
        }

    });

    udp_server.on('listening', () => {
        const address = udp_server.address();
        console.log(`server listening ${address.address}:${address.port}`);
    });

    udp_server.on('error', (err) => {
        console.error('udp send err', err);
    });

    udp_server.bind(8888);

}

function udpSend(msg)
{
    udp_server.send( js2osc(msg), sendPort );
}

function udpRecieve(msg)
{
    switch(msg.key){
        case 'create':
            createNode(msg.val);
            break;
        case 'lookup':
            break;
        default:
            break;
    }
}

function createNode(val)
{
    val = Array.isArray(val) ? val : [val];

    val.forEach( v => {
        if( typeof v.id == "undefined")
        {
            v.id = v.new+'_u_'+sym_util.fairlyUniqueString();
        }

        console.log(v);

        // send back to caller with id after creation
    });


}

// to do: automate adding symbols to stave palette def, so we can load files dynamically
/*
const theremin = require('./thereminStave')
const notelines = require('./thereminStave.noteline')

theremin.palette.push( notelines.class );
*/


/**
 * model
 * 
 * key: unique_id
 * value:   {
 *              id: xxx,
 *              class: xxxx,
 *              parent: parent object (base level is the main svg window)
 *              comparator: function used to sort children
 *              children: [ child_ids, child_ids, ... ] 
 *                  sorted array of child_ids, use utills.insertSorted(el, arr, comparator_fn)
 *          }
 *      
 * 
 * 
 */

let defs = new Map();
let model = new Map();


function modelGet( classname )
{
    return model.get(classname);
}

function modelHas( classname )
{
    return model.has(classname);
}



// api export to definitions
const controller_api = {
    input,
    modelGet,
    modelHas
}


function loadInitFiles(folderArray)
{
    const folder = folderArray[0];
    console.log('loadUserFolder', folder);
    
    let initFile = null;

    fs.readdirSync(folder,'utf-8').forEach( file => {
        
        let filepath = `${folder}/${file}`;


        if( file.split('.').pop() == 'json' )
        {
            initFile = filepath;
        }
        else
        {
            // new version, both controllers load the files, but pull different parts out
            // forward to renderer-controller
            process.send({
                key: 'load-ui-defs',
                val: filepath
            })

            
            // load controller def
            let { controller } = require(filepath);
            if( controller )
            {
                console.log(filepath);
                // initialize def with api
                let cntrlDef_ = controller(controller_api);

                // set into def map
                defs.set(cntrlDef_.className, cntrlDef_);
            }
          
        }
    })


    /**
     * eventually we will be able to load files on the fly,
     * so probably don't do init every time...
     *  */ 
    init();
    

    /**
     * init file sets up palette creation in view
     */
    process.send({
        key: 'init',
        val: initFile
    })


}

function init()
{
    if( model.size > 0 )
    {
        console.log('init model status', model);
    }

    model.set(defaultContext.id, defaultContext);
    defs.set(defaultContext.class, defaultContext);
   // defs.set(theremin.class, theremin);
   // defs.set(notelines.class, notelines);

    console.log('received init');
   // makePalette();
   // console.log(theremin);
    
}

const stringifyOBJAsync = (obj_) => {
    return Promise.resolve().then( ()=> JSON.stringify(obj_) )
  }
  


function addToModel( dataobj )
{
    //  console.log('setting val into model', val.id, val )
    if( model.has(dataobj.id) )
    {
        let ref = model.get(dataobj.id);
        for (const [key, value] of Object.entries(dataobj)) 
        {
            ref[key] = value;
            console.log(`updating value ${key}: ${value}`);
        }    
    }
    else
        model.set( dataobj.id, dataobj );
        
    if( model.has(dataobj.parent) )
    {
        let parent = model.get(dataobj.parent);
        let parentDef = defs.get(parent.class);

        if( !parentDef.hasOwnProperty('comparator') )
        {
            console.log(`no comparator for ${JSON.stringify(parent, null, 2)}`);
        }
        else
        {
            if( typeof parent.contents == "undefined" )
                parent.contents = []

            console.log(`insterting sorted ${JSON.stringify(dataobj, null, 2)} into ${JSON.stringify(parent, null, 2)}`);

            const index = parent.contents.indexOf(dataobj.id);
            if (index > -1) {
                parent.contents.splice(index, 1);
            }

            sym_util.insertSorted(dataobj.id, parent.contents, (a,b) => {
                const test_a = model.get(a);
                if( typeof test_a == "undefined" ) return 0;

                const test_b = model.get(b);
                if( typeof test_b == "undefined"  ) return 0;

                return parentDef.comparator( test_a, test_b )
            })
        }
        
    }
}


// once children ids are logged in model, we can use that to delete the child ids from model

function removeSelected(event_)
{
    if( event_.selected.length > 0 )
    {
        event_.selected.forEach( obj => {
            if( model.has(obj.id) )
            {
                model.delete(obj.id);
            }
        });

    }
    // no need to redraw since the view is handled by the renderer    
}

function castFromString(def, param, value)
{

    if( typeof(value) == "String" && def.paramTypes[param] != "String")
    {
        if( def.paramTypes[param] == "Number" )
        {
            return Number(value);
        }
        else if( def.paramTypes[param] == "Array" || def.paramTypes[param] == "Object" )
        {
            return JSON.parse(value);
        }
        
    }

    return value;
   
}

function updateSymbolData(obj)
{
    //console.log('updateSymbolData', obj);

    if( model.has(obj.id) )
    {
      //  console.log('test');

        let sym = model.get(obj.id);
        const def = defs.get(obj.class);

        //update the symbol's parametrer passed in
        sym[obj.param] = castFromString(def, obj.param, obj.value);
       
    }
}

function signalGUI(obj)
{
    process.send({
        key: 'signal-gui-script',
        val: obj
    }) 
}

function buildModelLookup()
{
    console.log('ok will do');

    let array = [ ...model.entries() ];
    array.forEach( v => {
        console.log(v);
    })
}


function procGuiEvent(event_) {
    switch (event_.symbolistAction) {
        
        case 'buildModelLookup':
            buildModelLookup();
            break;
        default:
            console.log('unhandled symbolistAction:', event_.symbolistAction);
            break;
    }
}

function input(_obj)
{
    //console.log('input', _obj);
    
    const key = _obj.key;
    const val = _obj.val;

    switch (key) //must have key!
    {
        case 'new':
        case 'update':
            udpSend(val);
            break;
       
        case 'init':
            init();
            break;
        case 'loadInitFiles':
            loadInitFiles(val);
            break;
        case 'symbolistEvent':
            procGuiEvent(val);
            break;
       
        case 'signal-gui-script':
            signalGUI(val);
            break;

        default:
            console.log('controller, unhandled key', key);
            //process.send('pong');
            break;
    }
}

module.exports = { input, initUDP }


/*
function getDef(obj_, classtype) // paletteClass or object class
{
    if( !obj_.hasOwnProperty(classtype) ){
        console.log(`no ${classtype} found:`, obj_);
        return null;
    }

    const classList = obj_[classtype].split(".");
    
    if( defs.has(classList[0]) )
    {
        const clefDef = defs.get(classList[0]);

        if( classList.length == 1 )
        {
            return clefDef;
        }
        else if( classList.length == 2 )
        {
            if( clefDef.palette.hasOwnProperty(classList[1]) )
            {
                return clefDef.palette[ classList[1] ];
            }
        }
    }

    return null;
}
*/