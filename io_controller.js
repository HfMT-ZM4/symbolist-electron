const fs = require('fs');
const path = require('path');
const sym_util = require('./lib/utils')
const { obj2osc, osc2obj } = require('./lib/o')

const dgram = require('dgram');
const { parseAsync, cloneObj } = require('./lib/utils');

global.root_require = function(path) {
    return require(__dirname + '/' + path);
}


let udp_server;
let sendToIP = '127.0.0.1';
let sendPort = 7777;

let initFile = null;

let defs = new Map();

/**
 * model : flat hash table DOM like lookup by ID
 * 
 * if item is a container, a contents array is used to store 
 * 
 * maybe rename this to "hash" since basically the score object
 * will also contain all of the data.
 * 
 * the lookup model is really only for fast lookup by id
 * maybe not even really needed unless there are non-linear lookup approaches
 * oh, but actually it's useful for when inputting data point by point
 * e.g. specifiying the container by id, we can then look it up quickly and
 * add the new data point.
 * 
 */
let model = new Map(); 

/**
 * container : a simple lookup table, stored by class name, 
 * listing ids of containers for faster lookup in the model
 * could also put the contents here instead of above
 * so the model is a flat array, and the other sets up the hierarchy
 */


/*
    {
        data: {
                className,
                ...
            },
        contents: [{
            data: {
                className,
                ...
            }
            contents: []
        }
    }

*/

let score = initFile;


function initUDP()
{

    console.log(sym_util.fairlyUniqueString());

    udp_server = dgram.createSocket('udp4');;

    udp_server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });


    udp_server.on('message', (msg, rinfo) => {  

        // not using osc yet, because of missing subbundles
        let str = msg.toString('utf-8');
        if( str.startsWith('#bundle'))
        {
            udpRecieve( osc2obj(msg) );
            /*
            try {
                let osc_bundle = osc.readPacket(msg, { metadata: true });
                console.log(osc_bundle);
                console.error(`osc_bundles aren't used yet`);

            }
            catch(err) {
                console.error('malformed osc bundle', err);
            }
            */
        }
        else
        {
            sym_util.parseAsync(str).then( obj => {
                udpRecieve(obj);
            })
        }

    });

    udp_server.on('listening', () => {
        udp_server.setSendBufferSize(65507);
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
    const bndl = obj2osc(msg);
    if( bndl.length > 65507 ){
       // console.error(`udp_server error, buffer too large ${bndl.length}`)
        udp_server.send( obj2osc({
            sendError: `udp_server error, buffer too large ${bndl.length}`
        }), sendPort);
    }
    else
    {
        udp_server.send( bndl, sendPort, (err) => {
            if( err ) console.error(`udp_server ${err} (size ${bndl.length})`);
          });
    }
    
}

function addIdIfMissing(v)
{
    if( typeof v.id == "undefined")
    {
        v.id = v.class+'_u_'+sym_util.fairlyUniqueString();
    }

    if( typeof v.contents !== "undefined" )
    {
        v.contents = Array.isArray(v.contents) ? v.contents : [v.contents];
        v.contents.forEach( e => {
            addIdIfMissing(e);
        })
    }
}


function sendDataToUI(val)
{
    val = Array.isArray(val) ? val : [val];

    val.forEach( v => {
        process.send({
            key: 'data',
            val: v
        })
        // send back to caller with id after creation
    });

}


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



function modelGet( id )
{
    return model.get(id);
}

function modelHas( id )
{
    return model.has(id);
}

function defGet( classname )
{
    return defs.get(Array.isArray(classname) ? classname[0] : classname);
}

function defHas( classname )
{
    return defs.has(Array.isArray(classname) ? classname[0] : classname);
}



// api export to definitions
global.io_api = {
    //input, // input 
    modelGet,
    modelHas,
    defGet,
    defHas,
    Points: require("points")

}

global.__symbolist_dirname = __dirname;

function addScoreToModelRecursive(obj)
{
    model.set(obj.id, obj);
    if( obj.contents )
    {
        const arr = ( Array.isArray(obj.contents) ? obj.contents : [ obj.contents ]  );
        arr.forEach( item => {
            addScoreToModelRecursive(item);
        })
    }

}

function saveScore(filepath)
{
    fs.writeFile(filepath, JSON.stringify(score), (err) => {
        if( err )
        {
            console.error(err);
        }
        else
        {
            console.log('saved', filepath);
        }
    })
}

function loadScore(filepath)
{
    fs.readFile(filepath, (err, data) => {
        if( err )
        {
            console.error(err);
        }
        else
        {
            try {
                let newFile = JSON.parse(data);
                console.log('loaded', newFile);

                //newScore();

                score = cloneObj( newFile );
                model = new Map();
                model.set(score.id, score);

                addScoreToModelRecursive(score);

                sendScoreToUI();

            }
            catch(e) {
                console.error(e);
            }
            
        }
    })
}

function newScore(){

    score = cloneObj( initFile );
    model = new Map();

    model.set(score.id, score);

    addScoreToModelRecursive(score);
}

function loadDefFiles(folder)
{
    console.log('loadUserFolder', folder);
    
    folder.files.forEach( file => {
        
        let filepath = path.normalize( `${folder.path}/${file.name}` );

        if( file.name == "init.json" ) //file.type == 'json' )
        {
            initFile = require(filepath);
        }
        else if( file.type == 'js' )
        {
            
            // load controller def
            let { io_def } = require(filepath);
            if( io_def )
            {
                console.log(filepath);
                // api now global
                let cntrlDef_ = new io_def();

                // set into def map
                defs.set(cntrlDef_.class, cntrlDef_);
            }
          
        }
       
    })

    newScore();

}


function addToModel( dataobj )
{
//    console.log('setting val into model', dataobj )

    // set object into flat model array
    if( model.has(dataobj.id) )
    {
        console.log('updating exsiting val in model', dataobj )
        let ref = model.get(dataobj.id);
        for (const [key, value] of Object.entries(dataobj)) 
        {
            ref[key] = value;
          //  console.log(`updating value ${key}: ${value}`);
        }    
    }
    else {
        model.set( dataobj.id, dataobj );
        addToScore(dataobj);
    }

//    addToStructuredLookup(dataobj);
}

function addToScore( dataobj )
{
    let container = model.get(dataobj.container);

    if( !container )
    {
        console.error(`no container found with id ${dataobj.container}`);
        return;
    }

    let container_def = defs.get(container.class)

    if( !container_def )
    {
        console.error(`no io def for container ${container.class}`);
        return;
    }

    //console.log(container, container_def);
    
    if( typeof container.contents === "undefined" )
    {
        container.contents = [];
    }

    if( typeof container_def.comparator === "undefined" )
    {
        console.error(`no comparator for ${JSON.stringify(container_def, null, 2)}`);
    }
    else
    {
        sym_util.insertSorted(dataobj, container.contents, (a,b) => {
            const test_b = model.get(b);
            if( typeof test_b === "undefined"  ) return 0;
    
            return container_def.comparator( dataobj, test_b )
            // we already have the data object, so we don't need to look it up everytime
        })
    }

   
}


/**
 * 
 * @param {Object} dataobj data object to store
 * 
 * maybe best would be to store by class name, sorted
 * then the container structure would be ok
 * 
 */

function addToStructuredLookup( dataobj )
{
 // add sorted event symbol into container set
 // add sorted container into top level container by type
 // class is now an array so we have to deal with that


 // if obj is a container, add it to the container by type, sorted
 //  later add support for sub containers

 // fix this, will always need a parent, if top level, then parent is '.top-svg' or '.top-html'

 if( Array.isArray(dataobj.class) && dataobj.class.includes('container') )
 {
     console.log('adding container');
     // def className must be first of classList
     let container_class = dataobj.class[0];
     let container_def = defs.get(container_class) 

     if( containers.has(container_class) )
     {
         // container for the containers is the top level for now
         let contents = containers.get(container_class);

         if( typeof container_def.comparator === "undefined")
         {
             console.log(`no comparator for ${JSON.stringify(container_def, null, 2)}`);
         }
         else
         {
             
            // console.log(`insterting sorted ${JSON.stringify(dataobj, null, 2)} into ${JSON.stringify(parent, null, 2)}`);
    /*
             const index = container.contents.indexOf(dataobj.id);
             if (index > -1) {
                 container.contents.splice(index, 1);
             }
    */
             // insert sorted for self (i.e. sorted containers)
             sym_util.insertSorted(dataobj.id, contents, (a,b) => {
                 const test_b = model.get(b);
                 if( typeof test_b == "undefined"  ) return 0;
    
                 return container_def.comparator( dataobj, test_b )
                 // we already have the data object, so we don't need to look it up everytime
             })
         }

     }
     else
     { 
         // first container of its kind, insert in top level or probably check for parent... 
        containers.set(container_class, [] );
     } 

     
 }
 else
 {
    // not a container, find the parent class and insert item to container

    if( typeof dataobj.container == "undefined" )
    {
        console.error('no parent info in data, so can\'t be looked up!');
        return;
    }
    /**
     * parent_ref could be an ID or the class name, this is what will be used 
     * to lookup the symbols later
     */
    let parent_ref = Array.isArray(dataobj.container) ? dataobj.container[0] : dataobj.container;

    if( !containers.has(parent_ref) )
    {
        containers.set( parent_ref, [ dataobj.id ] );

    }
    
    let contents = containers.get(parent_ref);    

    let sym_class = Array.isArray(dataobj.class) ? dataobj.class[0] : dataobj.class;
    let sym_def = defs.get(sym_class);

    sym_util.insertSorted(dataobj.id, contents, (a,b) => {

        const test_b = model.get(b);
        if( typeof test_b == "undefined"  ) return 0;

        return sym_def.comparator( dataobj, test_b )
        // we already have the data object, so we don't need to look it up everytime
    })


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

/**
 * 
 * @param {Object} params 
 * 
 * probably a given score will have one set of lookup parameters,
 * so I suppose that means we can pass the same parameters to all containers
 * if there are different kinds, this is more complicated, so I guess the user
 * will have to deal with that in their class lookup callback
 */
function lookup(params)
{
    let ret = null;

    if( typeof params.id == "undefined" )
    {
        ret = {
            lookup_error: 'no id tag found in lookup parameters'
        };
    }
    else
    {
        if( modelHas(params.id) )
        {
            const obj = modelGet(params.id);
            const def = defGet(obj.class);

            ret = def.lookup(params, obj);
        }
        else
        {

            console.log(model.has(params.id), model.get(params.id) );
            ret = {
                lookup_error: `no element with id "${params.id}" found`
            };
        }

    }

    if( !ret )
    {
        ret = ''  
    }

    return ret;

}


function sendScoreToUI()
{
    console.log('data-refresh');
    process.send({
        key: 'score',
        val: score
    }) 
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
    console.log('buildModelLookup');

    model.forEach( (val, key ) => {
        console.log( `${key} : ${val}` );
    })
}


function lookupResonseUDP(params)
{
   let ret = lookup(params);
   udpSend({
       lookup: ret 
    }) ;
}


function getFormattedLookupUDP(params)
{
    if( typeof params.id != "undefined"  )
    {

        if( modelHas(params.id) )
        {
            const obj = modelGet(params.id);
            const def = defGet(obj.class);

            if( typeof def.getFormattedLookup != 'undefined')
            {
                const ret = def.getFormattedLookup(params, obj);
                if( ret )
                {
                    udpSend({
                        'formatted': ret
                    })
                }
            }      
        }

    }
}

function callFromIO(params)
{
   // console.log('callFromIO', params);
    if( typeof params.class != "undefined" && typeof params.method != "undefined" )
    {

        if( defs.has(params.class)  )
        {  
            const _def = defs.get(params.class);
            if( typeof _def[params.method] != 'undefined')
            {
                const ret = _def[params.method](params);
                if( ret )
                {
                    udpSend({
                        'return/io': ret
                    })
                }
            }

        }

        // also sends to ui_controlller, so if the function has the same name in both defs it will be called in both places
        process.send({
            key: "call", 
            val: params
        })
    }
}

/**
 * 
 * @param {Object} msg key/val object from UDP
 */
function udpRecieve(msg)
{
    switch(msg.key){
        case 'data':
            addIdIfMissing(msg.val);
            addToModel(msg.val);
            sendDataToUI(msg.val);
            break;
        case 'lookup':
            lookupResonseUDP(msg.val);
            break;
        case 'getFormattedLookup':
            getFormattedLookupUDP(msg.val);
            break;
        case 'call':
            callFromIO(msg.val);
            break;
        case 'drawsocket':
            process.send({
                key: 'drawsocket',
                val: msg.val
            })
            break;
        default:
            break;
    }
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


/**
 * 
 * @param {Object} _obj key/val object from UI
 */
function input(_obj)
{
    //console.log('input', _obj);
    
    const key = _obj.key;
    const val = _obj.val;

    switch (key) //must have key!
    {
        case 'data-refresh':
            sendScoreToUI();
        break;

        case 'data':
            addIdIfMissing(val);
            addToModel(val);
            udpSend(val);
            break;

        case 'new':
        case 'update':
            udpSend(val);
            break;

        case 'io_out':
            console.log('io_out', val);
            udpSend(val);
            break;    
            
        case 'newScore':
            newScore();
            break;

        case 'load-io-defs':
            loadDefFiles(val);
            break;

        case 'symbolistEvent':
            procGuiEvent(val);
            break;
       
        case 'signal-gui-script':
            signalGUI(val);
            break;

        case 'saveScore':
            saveScore(val);
        break;

        case 'loadScore':
            loadScore(val);
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




/*
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
*/