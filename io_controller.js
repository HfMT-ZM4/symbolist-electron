const fs = require('fs');
const path = require('path');
const sym_util = require('./lib/utils')
const { js2osc } = require('./lib/js2osc.js')


let udp_server;

function setUDP(server){ 
    udp_server = server;
}

/**
 * 
 * @param {string} path -- path to file to require, relative to symbolist root folder
 */
global.root_require = function(path) {
    return require(__dirname + '/' + path);
}

const defaultContext = {
    id: "main-svg", // unique id used as key for model Map()
    class: "svg", // required for lookup in to defs
    //  data items (user defined):  <-- should this be wrapped to protect scope?
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    // sorting for child objects using data items
    comparator: (a,b) => { 
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1));
    },
    // use utills.insertSorted(el, arr, comparator)
    contents: [],
    // id of parent, for the root element this is null
    parent: null
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
  
// >> make clef settable here
function makeViewFromData(data_obj, clefDef)
{
    /*
    if( data_obj.hasOwnPropery('id') )
    {
        if( !model.has(data_obj.id) )
        {

        }
    }
    */
}

/*
function makePalette()
{
    let draw_msg = [];
    defs.forEach((_def, _key) => { 
        if( _def.hasOwnProperty('getStaveIcon') )
        {
            draw_msg.push( _def.getStaveIcon().view )
        }
    });

    process.send({
        key: 'draw',
        val: draw_msg
    })  
}


function makeSymbolPalette(_classname)
{
    console.log('makeSymbolPalette ', _classname);

    if( defs.has(_classname) )
    {
        const clef = defs.get(_classname);
        if( clef.hasOwnProperty('palette') )
        {
            //console.log('building symbol palette');
            
            let draw_msg = [];
            for( _symbolDefID of clef.palette )
            {   
                //console.log('checking for ', _symbolDefID);

                if( defs.has(_symbolDefID) )
                {
                    const symDef = defs.get(_symbolDefID);
                    if( symDef.hasOwnProperty('getEventIcon') )
                    {
                        draw_msg.push( symDef.getEventIcon().view )
                    }

                }
            }

            if( draw_msg.length > 0 )
            {
                process.send({
                    key: 'draw',
                    val: [{
                        key: "clear",
                        val: "palette-symbols"
                    }, ...draw_msg]
                }) 
            }
            
        }
    }
}
*/


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

/**
 * 
 * @param {*} def_ 
 * @param {*} newData_ 
 * @param {*} data_context 
 * @param {*} view_context 
 * 
 * sets data into model and generates new view display
 * 
 * @returns array of new views
 */
function dataToView(def_, newData_, data_context, view_context)
{    
    if( typeof newData_ === 'undefined') {
        console.log('unhandled fromGUI function', newData_);
        return;
    }

    const dataArr = Array.isArray(newData_) ? newData_ : [ newData_ ];

    let newView = dataArr.map( val => {
        //if( model.has(val.id) )
        //    console.log('previous data:', model.get(val.id), 'newData: ', val);
        
    //    model.set( val.id, val );

        addToModel( val );
        /*
      //  console.log('setting val into model', val.id, val )
        model.set( val.id, val );
        if( model.has(val.parent) )
        {
            let parent = model.get(val.parent);
            utils.insertSorted(val.id, parent.children, (a,b) => {
                return parent.comparator( model.get(a), model.get(b) )
            } )
            
        }
        */
        
        //const contextID = obj_.hasOwnProperty('context') && obj_.context.hasOwnProperty('id') ? obj_.context.id : obj_.id;
        //const context_dataref = model.has(contextID) ? model.get(contextID) : null;

  //      console.log(`dataToView object new ${val.id} data_context ${sym_util.JSONprint(data_context)} view_context ${sym_util.JSONprint(view_context)}`);
        const fromDataResponse = def_.fromData(val, data_context, view_context); // null: context data ref is not implemented yet
        return fromDataResponse.view;
    });

    return newView;
   
}


function viewToData(obj)
{
    console.log('viewToData', obj);

    if( defs.has(obj.class) )
    {
        let def_ = defs.get(obj.class);
        let ret = def_.fromView(obj);
        console.log(ret);

        addToModel(ret.data);

    }
}

/*
// new from click is now defined in view-controller
function newFromClick(event_)
{
    if( event_.hasOwnProperty('paletteClass') && defs.has( event_.paletteClass ) )
    {
        const def = defs.get( event_.paletteClass );
        const data_context = model.get( event_.context.id );
      //  console.log(`newFromClick data context  ${sym_util.JSONprint( data_context )}`);
        
        let newData = def.newFromClick(event_, data_context);
        if( newData )
        {
            if( newData.data )
            {
                let newViewArray = dataToView(def, newData.data, data_context, event_.context);
                // dataToView always returns an array

                if( newViewArray.length > 0 )
                {
                    process.send({
                        key: 'draw',
                        val: newViewArray
                    }) 
                }
            }

            if( newData.event )
            {
                input( newData.event );
            }

        }

        
    }

}
*/

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

/*
// transforms are now applied in the view-controller

function applyTransform_recurse(_matrix, _viewobj, _data_context, _view_context)
{
    let _parent_data_context = _data_context;
    let _parent_view_context = sym_util.getValObject(_view_context);
    if( defs.has( _viewobj.class[0] ) )
    {
        const def = defs.get( _viewobj.class[0] );

        //console.log('recurse _data_context', _data_context);


        let transformResponse = def.transform(_matrix, _viewobj, _parent_data_context, _parent_view_context);
        if( transformResponse.data )
        {
            let newViewArray = dataToView(def, transformResponse.data,  _parent_data_context, _parent_view_context); // <<< maybe real context here
            if( newViewArray.length > 0 )
            {
                process.send({
                    key: 'draw',
                    val: newViewArray
                });

                _parent_data_context = transformResponse.data;
                _parent_view_context = newViewArray;
            }
        }


    }

    if( _viewobj.hasOwnProperty('children') )
    {
        const children = Array.isArray(_viewobj.children) ? _viewobj.children : [_viewobj.children];
        children.forEach(val => {
            applyTransform_recurse(_matrix, val, _parent_data_context, _parent_view_context);
        });
    }

}

function applyTransform(event_)
{
//    console.log('applyTransform');
    
    if( event_.selected.length > 0 )
    {
        event_.selected.forEach( sel => {

            if( defs.has( sel.class[0] ) )
            {
                const def = defs.get( sel.class[0] );

                
                const data_context = model.get( event_.context.id );
                //console.log(`context id ${event_.context.id} model ${JSON.stringify(data_context, null, 2)}`);

                const transformMatrix = sym_util.matrixFromString(sel.transform);

                let transformResponse = def.transform(transformMatrix, sel, data_context, event_.context);
                if( transformResponse.data )
                {
                    let newViewArray = dataToView(def, transformResponse.data, data_context, event_.context); // <<< maybe real context here
                    if( newViewArray.length > 0 )
                    {
                        process.send({
                            key: 'draw',
                            val: newViewArray
                        }) 
                    }
    
                    if( sel.hasOwnProperty('children') )
                    {        
                        const children = Array.isArray(sel.children) ? sel.children : [sel.children];
                        children.forEach(val => {
                            applyTransform_recurse(transformMatrix, val, transformResponse.data, newViewArray);
                        });
                    }
                }

            }
        });
    }
}
*/

function getInfoBoxes(event_)
{
   // console.log('getInfoBoxes', event_);
    
    event_.selected.forEach( obj => {
        if( defs.has(obj.class[0]) )
        {
            const def = defs.get(obj.class[0]);
            const data = model.get(obj.id);
            const view_bbox = obj.bbox;
            
            const response = def.getInfoDisplay(data, view_bbox);
            
            if( response.view )
            {
                process.send({
                    key: 'draw',
                    val: response.view
                }) 
            }

            if( response.event )
            {
                input( response.event );
            }

        }
    })
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
        
        const data_context = model.get(obj.view_context.id);

        let newViewArray = dataToView(def, sym, data_context, obj.view_context);
        if( newViewArray.length > 0)
        {
            process.send({
                key: 'draw',
                val: newViewArray
            }) 
        }

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
        case "getClefSymbols":            
            makeSymbolPalette(event_.class[0]);
            break;
        case "removeFromViewCache": 
            break;
        case "newFromClick_down":
            newFromClick(event_);
            break;
        case "transformed":
            applyTransform(event_);
            break;
        case "getInfo":
            getInfoBoxes(event_);
            break;
        case "updateSymbolData":
            updateSymbolData(event_);
            break;
        case "removeSelected":
            removeSelected(event_);
            break;
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
            console.log('sending', val);
            udp_server.send( js2osc(val), 7777, (err) => {
                console.error('send err', err);
              });
            break;
        case 'toData':
            viewToData(val);
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
        case 'mouse':
            procGuiEvent(val);
            break;
        case 'key':
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

module.exports = { input, setUDP }


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