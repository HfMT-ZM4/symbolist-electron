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
    //console.log('makeSymbolPalette ', _classname);

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
                    val: draw_msg
                }) 
            }
            
        }
    }
}

function dataToView(def_, newData_, obj_)
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

        const context_dataref = model.has(obj_.context.id) ? model.get(obj_.context.id) : null;
       
        return def_.fromData(val, obj_.context, context_dataref); // null: context data ref is not implemented yet
    });

   // console.log('newview', JSON.stringify(newView, null, 2));
    
    if( newView.length > 0 )
    {
        process.send({
            key: 'draw',
            val: newView
        }) 
    }
   
}

function newFromClick(event_)
{
    if( event_.hasOwnProperty('paletteClass') && defs.has( event_.paletteClass ) )
    {
        const def = defs.get( event_.paletteClass );
        const contextDef = model.get( event_.context.id );

        let newData = def.newFromClick(event_, contextDef);
        dataToView(def, newData, event_);
    }

}

function applyTransform(event_)
{
    if( event_.selected.length > 0 )
    {
        event_.selected.forEach( sel => {
            if( defs.has( sel.class ) )
            {
                const def = defs.get( sel.class );
                const transformMatrix = sym_util.matrixFromString(sel.transform);
                let newData = def.transform(transformMatrix, sel);
                console.log('current:', sel, 'newData:', newData);
                
                dataToView(def, newData, event_);
            }
        });
    }
}

function procGuiEvent(event_) {
    switch (event_.symbolistAction) {
        case "getClefSymbols":
            makeSymbolPalette(event_.class);
            break;
        case "removeFromViewCache":
            break;
        case "newFromClick_down":
            newFromClick(event_);
            break;
        case "transformed":
            applyTransform(event_);
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
        // console.log('key', key);
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