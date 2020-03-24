const sym_util = require('./utils')

const defaultContext = {
    class: "svg",
    x: 0,
    y: 0,
    width: 800,
    height: 600
}

// to do: automate adding symbols to stave palette def, so we can load files dynamically
const theremin = require('./thereminStave')
const notelines = require('./thereminStave.noteline')

theremin.palette.push( notelines.class );

let model = new Map();
let defs = new Map();

function init()
{
    model.set(defaultContext.class, defaultContext);
    defs.set(defaultContext.class, defaultContext);
    defs.set(theremin.class, theremin);
    defs.set(notelines.class, notelines);

    console.log('received init');
    makePalette();
    console.log(theremin);
    
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

function makePalette()
{
    let draw_msg = [];
    defs.forEach((_def, _key) => { 
        if( _def.hasOwnProperty('getStaveIcon') )
        {
            draw_msg.push( _def.getStaveIcon() )
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
                        draw_msg.push( symDef.getEventIcon() )
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
        
        model.set( val.id, val );
        
        //const contextID = obj_.hasOwnProperty('context') && obj_.context.hasOwnProperty('id') ? obj_.context.id : obj_.id;
        //const context_dataref = model.has(contextID) ? model.get(contextID) : null;

  //      console.log(`dataToView object new ${val.id} data_context ${sym_util.JSONprint(data_context)} view_context ${sym_util.JSONprint(view_context)}`);
        return def_.fromData(val, data_context, view_context); // null: context data ref is not implemented yet
    });

    return newView;
   
}

function newFromClick(event_)
{
    if( event_.hasOwnProperty('paletteClass') && defs.has( event_.paletteClass ) )
    {
        const def = defs.get( event_.paletteClass );
        const data_context = model.get( event_.context.id );
      //  console.log(`newFromClick data context  ${sym_util.JSONprint( data_context )}`);
        
        let newData = def.newFromClick(event_, data_context);
        let newView = dataToView(def, newData, data_context, event_.context);
//        console.log(`newview ${sym_util.JSONprint( newView )}` );

        if( newView.length > 0 )
        {
            process.send({
                key: 'draw',
                val: newView
            }) 
        }


        
    }

}

function applyTransform_recurse(_matrix, _viewobj, _data_context, _view_context)
{
    let _parent_data_context = _data_context;
    let _parent_view_context = sym_util.getValObject(_view_context);
    if( defs.has( _viewobj.class[0] ) )
    {
        const def = defs.get( _viewobj.class[0] );

        //console.log('recurse _data_context', _data_context);

        let newData = def.transform(_matrix, _viewobj, _parent_data_context, _parent_view_context);    
        let newView = dataToView(def, newData, _parent_data_context, _parent_view_context);

        //console.log('recurse newview', newView);

        if( typeof newView !== 'undefined' )
        {
            process.send({
                key: 'draw',
                val: newView
            }) 
        }

        _parent_data_context = newData;
        _parent_view_context = newView;

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

                let newData = def.transform(transformMatrix, sel, data_context, event_.context);
                let newView = dataToView(def, newData, data_context, event_.context); // <<< maybe real context here
                if( newView.length > 0 )
                {
                    process.send({
                        key: 'draw',
                        val: newView
                    }) 
                }

                if( sel.hasOwnProperty('children') )
                {        
                    const children = Array.isArray(sel.children) ? sel.children : [sel.children];
                    children.forEach(val => {
                        applyTransform_recurse(transformMatrix, val, newData, newView);
                    });
                }
            }
            /*
            if( defs.has( sel.class[0] ) )
            {
                const def = defs.get( sel.class[0] );
                const transformMatrix = sym_util.matrixFromString(sel.transform);
                let newData = def.transform(transformMatrix, sel);
          //      console.log('current:', sel, 'newData:', newData);
                
                dataToView(def, newData, event_);
            }
            */
        });
    }
}

function getInfoBoxes(event_)
{
   // console.log('getInfoBoxes', event_);
    
    event_.selected.forEach( obj => {
        if( defs.has(obj.class[0]) )
        {
            const def = defs.get(obj.class[0]);
            const data = model.get(obj.id);
            const view_bbox = obj.bbox;
            
            const newView = def.getInfoDisplay(data, view_bbox);

            console.log(newView);
            
            if( typeof newView != 'undefined')
            {
                process.send({
                    key: 'draw',
                    val: newView
                }) 
            }

        }
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
        default:
            console.log('unhandled symbolistAction:', event_.symbolistAction);
            break;
    }
}

function input(_obj)
{
//    console.log('input', _obj);
    
    const key = _obj.key;
    const val = _obj.val;

    switch (key) //must have key!
    {
        case 'init':
            init();
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
        default:
            console.log('controller, unhandled key', key);
            //process.send('pong');
            break;
    }
}

module.exports = { input }


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