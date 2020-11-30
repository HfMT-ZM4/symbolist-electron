const fs = require('fs');
const path = require('path');
const sym_util = require('./lib/utils')
const { js2osc } = require('./lib/js2osc.js')

const dgram = require('dgram');
const osc = require('osc/src/osc');

global.root_require = function(path) {
    return require(__dirname + '/' + path);
}


let udp_server;
let sendToIP = '127.0.0.1';
let sendPort = 7777;


let defs = new Map();

/**
 * model : flat hash table stored by id, with data, containers include 'contents' field
 * 
 *  or maybe the sorted contents field should be in the container map
 */
let model = new Map(); 

/**
 * container : a simple lookup table, stored by class name, 
 * listing ids of containers for faster lookup in the model
 * could also put the contents here instead of above
 * so the model is a flat array, and the other sets up the hierarchy
 */
let containers = new Map(); 

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

function addIDifMIssing(v)
{
    if( typeof v.id == "undefined")
    {
        v.id = v.class+'_u_'+sym_util.fairlyUniqueString();
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



function modelGet( classname )
{
    return model.get(classname);
}

function modelHas( classname )
{
    return model.has(classname);
}

function defGet( classname )
{
    return defs.get(classname);
}

function defHas( classname )
{
    return defs.has(classname);
}



// api export to definitions
const io_api = {
    //input, // input 
    modelGet,
    modelHas,
    defGet,
    defHas
}


function loadDefFiles(folder)
{
    console.log('loadUserFolder', folder);
    
    let initFile = null;

    folder.files.forEach( file => {
        
        let filepath = `${folder.path}/${file.name}`;

        if( file.type == 'json' )
        {
            initFile = filepath;
        }
        else
        {
            
            // load controller def
            let { io_def } = require(filepath);
            if( io_def )
            {
                console.log(filepath);
                // initialize def with api
                let cntrlDef_ = io_def(io_api);

                // set into def map
                defs.set(cntrlDef_.className, cntrlDef_);
            }
          
        }
    })

}


function addToModel( dataobj )
{
    console.log('setting val into model', dataobj )

    // set object into flat model array
    if( model.has(dataobj.id) )
    {
        let ref = model.get(dataobj.id);
        for (const [key, value] of Object.entries(dataobj)) 
        {
            ref[key] = value;
          //  console.log(`updating value ${key}: ${value}`);
        }    
    }
    else {
        model.set( dataobj.id, dataobj );
    }

    addToStructuredLookup(dataobj);
}


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
     // def className must be first of classList
     let container_class = dataobj.class[0];
     let container_def = defs.get(container_class) 

     if( containers.has(container_class) )
     {
         // container for the containers is the top level for now
         let contents = containers.get(container_class);

         if( !container_def.hasOwnProperty('comparator') )
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
    let ret = [];

    // val contains the contents... maybe we don't need a named contents here...
    containers.forEach( (id_array, key) => {

        if( defs.has(key) ) // case of storing by classname
        {
            /*
                in the case of storing by className, all of the events
                are located in className contents

                do we need to call the container lookup?
                even if there is no instance of the container?
                sure why not
            */

            let container_def = defs.get(key);
            if( container_def.lookup )
            {
                let result = container_def.lookup(params, null)
                if( result )
                {
                    ret.push( result );
                }
            }

            for( let i = 0; i < id_array.length; i++)
            {
                let sym_data = model.get(id_array[i]);

                let sym_class = Array.isArray(sym_data.class) ? sym_data.class[0] : sym_data.class;
                let sym_def = defs.get(sym_class);
                if( sym_def )
                {
                    let result = sym_def.lookup(params, sym_data)
                    if( result )
                    {
                        ret.push( result );
                    }
                }
                
            }

        }
        else if( model.has(key) ) // case of storing by id
        {   


        /*
                in the case of storing by id, each container instance will have it's own set of
                events, and there will be several containers of the same type (usually)

                so, we could maybe add the instance data of the container into the data_obj or params..

                for now just calling the container lookup and adding to returned array

            */

            const container_instance = model.get(key);

            let container_class = Array.isArray(container_instance.class) ? container_instance.class[0] : container_instance.class;
            
            if( defs.has( container_class ) )
            {
                let container_def = defs.get(container_class);
                if( container_def.lookup )
                {
                    let result = container_def.lookup(params, container_instance)
                    if( result )
                    {
                        ret.push( result );
                    }
                }

                for( let i = 0; i < id_array.length; i++)
                {
                    let sym_data = model.get(id_array[i]);

                    let sym_class = Array.isArray(sym_data.class) ? sym_data.class[0] : sym_data.class;
                    let sym_def = defs.get(sym_class);

                    if( sym_def )
                    {
                        let result = sym_def.lookup(params, sym_data)
                        if( result )
                        {
                            ret.push( result );
                        }
                    }
                    
                }
            
//               ret.push( defs.get(container_class).lookup(params) );
            }


           


        }
        else
        {
            // fail
        }
    });

    return ret;
}


function sendModelToUI()
{
    process.send({
        key: 'refresh-model',
        val: model
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

    containers.forEach( (val, key ) => {
        console.log( `${key} : ${val}` );
    })
}


function lookupResonseUDP(params)
{
   let ret = lookup(params);

 //  console.log('lookupResonseUDP', ret);
   if( Array.isArray(ret) )
   {
        ret.forEach( v => udpSend( v ) ); 
   }
   else
   {
        udpSend( ret ) 
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
            addIDifMIssing(msg.val);
            addToModel(msg.val);
            sendDataToUI(msg.val);
            break;
        case 'lookup':
            lookupResonseUDP(msg.val);
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
        case 'refresh':
            sendModelToUI();
        break;

        case 'data':
            addIDifMIssing(val);
            addToModel(val);
            udpSend(val);
            break;

        case 'new':
        case 'update':
            udpSend(val);
            break;
       
        case 'init':
            init();
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