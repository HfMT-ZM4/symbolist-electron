
const path = require('path');
const sym_util = require('./lib/utils')
const { cloneObj } = sym_util;

const udp_server = require('./lib/udp');


global.root_require = function(path) {
    return require(__dirname + '/' + path);
}


let post = console.log;
let outlet = (msg) => {};
let ui_send = (msg) => { process.send(msg) }

let params = {
    ui_send: "default",
    post: "default",
    outlet: "default",
    enable_udp: false,
    udp_listen_port: 9999,
    udp_send_port: 7777,
    udp_send_ip: "127.0.0.1"
}

const init = function(obj) {
   // post("hello init!");
    params = {
        ...params,
        ...obj
    }

    if( params.post != "default" )
    {
        post = params.post;
        io_api.post = post;
    }

    if( params.outlet != "default" )
    {
        outlet = params.outlet;
        io_api.outlet = outlet;  
    }

    if( params.ui_send != "default" )
    {
        ui_send = params.ui_send;
        io_api.ui_send = ui_send;  
    }

}

const startUDP = function()
{

    udp_server.receive_callback(io_receive);

    if( params.enable_udp )
    {
        post("starting udp server");

        udp_server.init( params.udp_listen_port, params.udp_send_port, params.udp_send_ip );
        if( params.outlet == "default" )
        {
            outlet = udp_server.send;
            post("set outlet");

        }
    }

}



let initDef = null;

let ioDefs = new Map();

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

let undo_cache = [];
let num_undo_steps = 10;
let undo_cache_step = 0;

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

let score = initDef;



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
        ui_send({
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
    return ioDefs.get(Array.isArray(classname) ? classname[0] : classname);
}

function defHas( classname )
{
    return ioDefs.has(Array.isArray(classname) ? classname[0] : classname);
}


function getModel()
{
    return model;
}

function getScore()
{
    return score;
}


// api export to definitions
global.io_api = {
    //input, // input 
    modelGet,
    modelHas,
    defGet,
    defHas,
    Points: require("points"),

    post,
    outlet,

    ui_send,
    input,

    sendDataToUI,

    getModel,
    getScore,
    addToModel

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

/**
 * 
 * Read / Write
 * 
 */

const fs = require('fs');

function saveScore(filepath)
{
    fs.writeFile(filepath, JSON.stringify(score), (err) => {
        if( err )
        {
            console.error(err);
        }
        else
        {
            post('saved', filepath);
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
                post('loaded', newFile);

                //newScore();

                score = cloneObj( newFile );
                model = new Map();
                model.set(score.id, score);

                addScoreToModelRecursive(score);
                addCacheState( score );

                sendScoreToUI();
                

            }
            catch(e) {
                console.error(e);
            }
            
        }
    })
}

function newScore( newScore = initDef ){

    score = cloneObj( newScore );
    model = new Map();

    model.set(score.id, score);

    addScoreToModelRecursive(score);
}

async function loadDefBundleFile(file)
{
    const defFile = await require(file);

    initDef = defFile.initDef;
    ioDefs = defFile.ioDefs;

    newScore();
    addCacheState( score );

}


function loadDefFiles(folder)
{
    post('loadUserFolder', folder);
    
    folder.files.forEach( file => {
        
        let filepath = path.normalize( `${folder.path}/${file.name}` );

        if( file.name == "init.json" ) //file.type == 'json' )
        {
            initDef = require(filepath);
        }
        else if( file.type == 'js' )
        {
            
            // load controller def
            let { io_def } = require(filepath);
            if( io_def )
            {
                post(filepath);
                // api now global
                let cntrlDef_ = new io_def();

                // set into def map
                ioDefs.set(cntrlDef_.class, cntrlDef_);
            }
          
        }
       
    })

    newScore();
    addCacheState( score );

}

function undo()
{
    newScore( stepCacheBack() );
    sendScoreToUI();
}

function redo()
{
    newScore( stepCacheForward() );
    sendScoreToUI();
}

function stepCacheBack()
{
    undo_cache_step = undo_cache_step >= num_undo_steps ? num_undo_steps-1 : undo_cache_step+1;
    return undo_cache[ undo_cache_step ];
}


function stepCacheForward()
{
    undo_cache_step = undo_cache_step <= 0 ? 0 : undo_cache_step-1 ;
    return undo_cache[ undo_cache_step ];
}


function addCacheState( data )
{

    undo_cache_step = 0; // resets undo step, so redo is not possible now
    undo_cache.unshift( cloneObj(data) );

    if( undo_cache.length > num_undo_steps )
        undo_cache.pop();
}


function addToModel( dataobj_arr )
{
  //  console.log('setting val into model', dataobj )

    dataobj_arr = Array.isArray(dataobj_arr) ? dataobj_arr : [ dataobj_arr ];

    dataobj_arr.forEach( dataobj => {
        // set object into flat model array
        if( model.has(dataobj.id) )
        {
        // console.log('updating exsiting val in model', dataobj )
            let ref = model.get(dataobj.id);
            for (const [key, value] of Object.entries(dataobj)) 
            {
                ref[key] = value;
            //  console.log(`updating value ${key}: ${value}`);
            }    
        }
        else 
        {
            model.set( dataobj.id, dataobj );
            addToScore(dataobj);
        }
    });

    // the model includes the score
    outlet({
        model: Object.fromEntries(model)
    });

}

function addToScore( dataobj )
{
    let container = model.get(dataobj.container);

    if( !container )
    {
        console.error(`no container found with id ${dataobj.container}`);
        return;
    }

    let container_def = ioDefs.get(container.class)

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
     post('adding container');
     // def className must be first of classList
     let container_class = dataobj.class[0];
     let container_def = ioDefs.get(container_class) 

     if( containers.has(container_class) )
     {
         // container for the containers is the top level for now
         let contents = containers.get(container_class);

         if( typeof container_def.comparator === "undefined")
         {
             post(`no comparator for ${JSON.stringify(container_def, null, 2)}`);
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
    let sym_def = ioDefs.get(sym_class);

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

            post(model.has(params.id), model.get(params.id) );
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
    //console.log('data-refresh', score);
    ui_send({
        key: 'score',
        val: score
    }) 
}


function signalGUI(obj)
{
    ui_send({
        key: 'signal-gui-script',
        val: obj
    }) 
}

function buildModelLookup()
{
    post('buildModelLookup');

    model.forEach( (val, key ) => {
        post( `${key} : ${val}` );
    })
}


function lookupResponseUDP(params)
{
   let ret = lookup(params);
   outlet({
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
                    outlet({
                        'formatted': ret
                    })
                }
            }      
        }

    }
}

function callFromIO(params)
{
    if( typeof params.class != "undefined" && typeof params.method != "undefined" )
    {

        if( ioDefs.has(params.class)  )
        {  
            const _def = ioDefs.get(params.class);
            if( typeof _def[params.method] != 'undefined')
            {

                const ret = _def[params.method](params);
                if( ret )
                {
                    outlet({
                        'return/io': ret
                    })
                }
            } /*
            else {
                // fail quietly
                post('call failed, no method def', params);
            } 
            */

        }
        else
            post('call failed, no class def', params);


        // also sends to ui_controlller, so if the function has the same name in both defs it will be called in both places
        ui_send({
            key: "call", 
            val: params
        })
    }
}

/**
 * 
 * @param {Object} msg key/val object from UDP
 */
function io_receive(msg)
{
    switch(msg.key){
        case 'data':
            addIdIfMissing(msg.val);
            addToModel(msg.val);
            addCacheState( score );
            sendDataToUI(msg.val);
            break;
        case 'lookup':
            lookupResponseUDP(msg.val);
            break;
        case 'getFormattedLookup':
            getFormattedLookupUDP(msg.val);
            break;
        case 'call':
            callFromIO(msg.val);
            break;
        case 'drawsocket':
            ui_send({
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
            post('unhandled symbolistAction:', event_.symbolistAction);
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
            addCacheState( score );
            outlet({
                data: val
            });
            break;

        case 'new':
        case 'update':
            outlet({
                update: val
            });
            break;

        case 'undo':
            undo();
        break;

        case 'redo':
            redo();
        break;

        case 'io_out':
            //post('io_out', val);
            outlet(val);
            break;    
            
        case 'newScore':
            newScore();
            addCacheState( score );
            break;
/*
        case 'load-io-defs':
            loadDefFiles(val);
            break;
*/
        case 'import-io-def-bundle':
            loadDefBundleFile(val);
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

        case 'lookup':
            lookupResponseUDP(val);
            break;
        case 'getFormattedLookup':
            getFormattedLookupUDP(val);
            break;
        case 'call':
            callFromIO(val);
            break;
        

        default:
            post('controller, unhandled key', key);
            //process.send('pong');
            break;
    }
}

module.exports = { 
    input, 
    init,
    startUDP
}
