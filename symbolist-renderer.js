
/* global drawsocket:readonly  */

/**
 * 
 * every major event in the general use sequence should have the option of a callback in the defs
 * for example, selection, and on setting the context
 */


/**
 * symbolist renderer view module -- exported functions are at the the bottom
 */

const { ipcRenderer } = require('electron')

/**
 * globals
 */
const svgObj = document.getElementById("svg");
const mainSVG = document.getElementById("main-svg");
const overlay = document.getElementById('symbolist_overlay');

let symbolist_log = document.getElementById("symbolist_log");;

let clickedObj = null;
let prevEventTarget = null;
let selected = [];
let selectedCopy = [];

let mousedown_pos = {x: 0, y: 0};
let mouse_pos = {x: 0, y: 0};

let currentContext = svgObj;
let currentPaletteClass =  "";

let selectedClass = currentPaletteClass;


/**
 * uiDefs stores UI defs in flat array, lookup by classname
 * 
 * definitions have a palette array that stores the classNames of potential child types
 *  */ 
let uiDefs = new Map();

let renderer_api = {
    drawsocketInput,
    sendToController, // renderer-event
    fairlyUniqueString,
    getCurrentContext
}

ipcRenderer.on('load-ui-defs', (event, arg) => {

    console.log('loading files:', arg);

    // load controller def
    let { ui } = require(arg);

    // initialize def with api
    let cntrlDef_ = ui(renderer_api);

    // set into def map
    uiDefs.set(cntrlDef_.className, cntrlDef_);
   
})

ipcRenderer.on('init', (event, filepath) => {

    const exists = require.resolve(filepath); 
    if( exists )
        delete require.cache[ exists ];

    let init = require(filepath)

    if( init.hasOwnProperty('palette') )
    {
        let drawMsgs = [];
        init.palette.forEach( el => {
            let def_ = uiDefs.get(el);

            const def_classname = def_.className;
            let def_palette_display = def_.getPaletteIcon();

            if( def_palette_display.key == "svg" )
            {
                def_palette_display = {
                    new: "svg",
                    class: "palette-svg",
                    id: `${def_classname}-icon`,
                    children: def_palette_display.val
                }
            }

            drawMsgs.push({
                key: "html",
                val: {
                    new: "div",
                    class: `${def_classname} palette-icon`,
                    id: `${def_classname}-paletteIcon`,
                    parent: "palette-clefs",
                    onclick: `
                            console.log('select ${def_classname}'); 
                            symbolist.setClass('${def_classname}');
                        `,
                    children: def_palette_display
                }
            })
        })

        drawsocket.input([{
                key: "clear",
                val: "palette-symbols"
            }, ...drawMsgs
        ]) 
    }

    // in controller there is a defautlContext class, probably we should do the same
    console.log('initFile', init);
})


/**
 * 
 * @param {Array} class_array array of class names
 */
function makeSymbolPalette(class_array)
{
    let draw_msg = [];
    class_array.forEach( classname => {
        if( uiDefs.has(classname) )
        {
            const symDef = uiDefs.get(classname);

            let def_palette_display = symDef.getPaletteIcon();

            if( def_palette_display.key == "svg" )
            {
                def_palette_display = {
                    new: "svg",
                    class: "symbol-palette-svg",
                    id: `${classname}-icon`,
                    children: def_palette_display.val
                }
            }
        
            draw_msg.push({
                key: "html",
                val: {
                    new: "div",
                    class: `${classname} palette-icon`,
                    id: `${classname}-paletteIcon`,
                    parent: "palette-symbols",
                    onclick: `
                            console.log('select ${classname}'); 
                            symbolist.setClass('${classname}');
                        `,
                    children: def_palette_display
                }
            })
        
        }
    })

    if( draw_msg.length > 0 )
    {
        drawsocket.input([
            {
                key: "clear",
                val: "palette-symbols"
            }, 
            ...draw_msg
        ]) 
    }
}


/**
 *  load ui file into map
 * 
 * format:
 * {
 *      classname: 'foo',
 *      filepath: '/usr/local/scripts/.../foo-ui.js'
 * }
 */
/*
ipcRenderer.on('load-ui-file', (event, arg) => {
    console.log('loading custom ui', arg.classname, arg.filepath);

    // should exit in case we are already running a custom script here?
    const removeUI = require.resolve(arg.filepath); // lookup loaded instance of module
    if( removeUI )
        delete require.cache[ removeUI ];


    const userInterface = require(arg.filepath);
    
    if( userInterface ){
        uiDefs.set(arg.classname, userInterface)
    }

})
*/


function makeSymbolPaletteForContainer(_classname)
{
    console.log('makeSymbolPaletteForContainer ', _classname);

    if( paletteMap.has(_classname) )
    {
        const clef = paletteMap.get(_classname);
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







/*
    {
        call: "enterEditMode",
        args: data
    } 
 */
ipcRenderer.on('signal-gui-script', (event, arg) => {
    if( arg.call )
    {
        console.log('check', arg);
        if( uiDefs.has(currentPaletteClass) )
        {
            console.log('check check', arg.call);

            uiDefs.get(currentPaletteClass)[arg.call](arg.args)
        }
    }
    
})




/**
 * 
 * @param {Object} obj input to drawsocket
 */
function drawsocketInput(obj){
    drawsocket.input(obj)
}

ipcRenderer.on('draw-input', (event, arg) => {
    console.log(`received ${arg}`);
    
    drawsocket.input(arg)
})

/**
 * handler for special commands from menu that require info about state of view/selection
 */
ipcRenderer.on('menu-call', (event, arg) => {
    switch(arg) {
        case 'deleteSelected':
            removeSelected();
            break;

    }
    console.log(`menu call received ${arg}`);
})

ipcRenderer.on('enter-custom-ui', (event, arg) => {
    console.log('starting custom ui');
    enterCustomUI(arg);
})

/**
 * load and unload custom UI from external file
 * 
 */
function enterCustomUI(argObj)
{
    console.log('test', argObj.filename);
    const userInterface = require(argObj.filename);
    if( userInterface )
        userInterface.enter(argObj, mousedown_pos);
}

function exitCustomUI(filename_)
{  
    // removes imported module
    const userInterface = require.resolve(filename_); // lookup loaded instance of module
    if( userInterface )
        userInterface.exit();

    delete require.cache[ userInterface ];
}

/**
 *  listener receives all forwarded messages from drawsocket
 */
 
 /*
drawsocket.setInputListener( (key, objarr, wasHandled) => {
// or no default because we listen to all messages to drawsocket... ?
    if( wasHandled == false )
    {
        switch (key) {
            case "symbolist_log":
                symbolist_set_log(objarr); // << prob need to iterate obj array...
            break;
            default: 
                symbolist_set_log(`${key} message not handlded by symbolist or drawsocket`);
            break;
        }
    }
   // console.log("called", key);
});
*/

/** 
 * API -- make namespace here ?
 */

function symbolist_set_log(msg)
{
    symbolist_log.innerHTML = `<span>${msg}</span>`;
}

/**
 * 
 * @param {string} _class sets current selected palette class
 * 
 * this functions also could/should tell the controller to send the linked interface js file?
 * 
 */
function symbolist_setClass(_class)
{
//    console.log("symbolist_setClass", _class);
    symbolist_set_log(`selected symbol ${_class}`)

    document.querySelectorAll(".palette .selected").forEach( el => {
        el.classList.remove("selected");
    });

    let paletteItem = document.getElementById(`${_class}-paletteIcon`);
    paletteItem.classList.add("selected");  

    currentPaletteClass = _class;
    selectedClass = _class;

    if( uiDefs.has(selectedClass) && uiDefs.get(selectedClass).hasOwnProperty('enter') )
    {
        uiDefs.get(selectedClass).enter();
    }

    ipcRenderer.send('symbolist_event',  {
        key: "symbolistEvent",  
        val: {
            symbolistAction: 'setPaletteClass',
            class: currentPaletteClass
        }
    }); 

}


/**
 * 
 * @param {Object} obj set context from symbolist controller
 */
function symbolist_setContext(obj)
{
    deselectAll();

    document.querySelectorAll(".current_context").forEach( el => {
        el.classList.remove("current_context");
    });

    if( uiDefs.has(obj.classList[0]) )
    {
        let def_ = uiDefs.get(obj.classList[0]);

        if( def_.palette )
        {
            makeSymbolPalette(def_.palette);
        }

        def_.enter(obj);
    }

    if( obj != svgObj )
        obj.classList.add("current_context");

    currentContext = obj;
    symbolist_set_log(`set context to ${obj.id}`)


/*
    //  if( _class != currentPaletteClass )
    {
        
        ipcRenderer.send('symbolist_event',  {
            key: "symbolistEvent",  
            val: {
                symbolistAction: 'getClefSymbols',
                class: formatClassArray( currentContext.classList.value )
            }
        }); 
    }
*/
}

function setDefaultContext()
{
    symbolist_setContext(svgObj);
}

function symbolist_send(obj)
{
    ipcRenderer.send('symbolist_event', obj);
}

function getCurrentContextJSON()
{
    let view = elementToJSON(currentContext);
    view.bbox = cloneObj(currentContext.getBoundingClientRect());
    return view;
}


// could be improved with html.closest()
function getObjViewContext(obj)
{
    let elm = obj;
    while(  elm != svgObj && 
        elm.parentNode && 
        elm.parentNode.id != 'main-svg' && 
        elm.parentNode.id != 'palette' && 
        //elm.parentNode.id != 'symbolist_overlay' && 
        (currentContext != svgObj && (!elm.parentNode.classList.contains('stave') || 
            !elm.parentNode.classList.contains('stave-events'))) ) 
    {
        elm = elm.parentNode;
    }

    let view = elementToJSON(elm);
    view.bbox = cloneObj(elm.getBoundingClientRect());
    return view;
}

 /**
  * internal methods
  */


/**
 * set context from UI event, selecting most recently selected object
 * sets palette class to null
 */
function setSelectedContext()
{
    if( selected.length > 0 )
        symbolist_setContext( selected[selected.length-1] );
    else
        setDefaultContext();

    currentPaletteClass = null;
}
 
function removeSelected()
{
    if( selected.length > 0 && !document.querySelector('.infobox') )
    {
        let selectedIDs = selected.map( val => val.id );
        drawsocket.input({
            key: 'remove',
            val: selectedIDs
        });  

        return true;
    }

    return false;
        
}

function getUnionBounds()
{

    if( selected.length == 0 )
        return;

    const bounds = cloneObj(selected[0].getBoundingClientRect());

    let l = bounds.left;
    let r = bounds.right;
    let t = bounds.top;
    let b = bounds.bottom;

    for( let i = 1; i < selected.length; i++)
    {
            const addBox = selected[i].getBoundingClientRect();

            if( l > addBox.left ){
                l = addBox.left;
            }
            
            if( r < addBox.right ){
                r = addBox.right;
            }

            if( t > addBox.top ){
                t = addBox.top;
            }
            
            if( b < addBox.bottom ){
                b = addBox.bottom;
            }

           // console.log('bounds', bounds);
    }


    function HandleRect(x,y, idx) {
        const r = 5;
        const d = r * 2;
        return {
            new: "rect",
            parent: "symbolist_overlay",
            class: "transform-handle",
            x: x - r,
            y: y - r,
            width: d,
            height: d,
            id: `transform-handle-${idx}`,
            onclick: `console.log( "selected", this.id )`,
            style: {
                fill: "rgba(0, 0, 0, 0.05)"
            }
        }
    }

    function BoundsLine(x1,y1,x2,y2) {
        const r = 2;
        const d = r * 2;
        return {
            new: "line",
            parent: "bounds-group",
            class: "transform-line",
            x1: x - r,
            y: y - r,
            width: d,
            height: d,
            id: `transform-handle-${idx}`,
            onclick: `console.log( "selected", this.id )`,
            style: {
                fill: "rgba(0, 0, 0, 0.05)"
            }
        }
    }
    
    

    drawsocket.input({
        key: 'svg',
        val: {
            new: "g",
            id: "bounds-group",
            parent: "symbolist_overlay",
            children : [
                HandleRect(l,t, 0),
                HandleRect(l,b, 1),
                HandleRect(r,t, 2),
                HandleRect(r,b, 3),
                {
                    new: "rect",
                    id: "bounds-rect",
                    x: l,
                    y: t,
                    width: r-l,
                    height: b-t,
                    style: {
                        "stroke-width" : 1,
                        stroke: 'rgba(0,0,0, 0.5)',
                        fill: "none",
                        "stroke-dasharray" : 1,
                        'pointer-events': "none" // "stroke"
                    }
                }
            ]
        }
    });


}

function hitTest(regionRect, obj)
{
    const objBBox = obj.getBoundingClientRect();

    return  !(objBBox.left  > regionRect.right ||
             objBBox.top    > regionRect.bottom ||
             objBBox.right  < regionRect.left || 
             objBBox.bottom < regionRect.top );

}

function recursiveHitTest(region, element)
{

    if( hitTest(region, element) )
        return true;

    for (let i = 0; i < element.children.length; i++) 
    {
        if( recursiveHitTest(region, element.children[i]) )
            return true;
        
           // console.log(element.children[i].tagName);
    }

    return false;
}

function addToSelection( element )
{
    if( element.id == 'dragRegion' )
        return;

    console.log('addToSelection');
    

    for( let i = 0; i < selected.length; i++)
    {
        if( selected[i] == element )
            return;    
    }

    selected.push(element);

    if( !element.classList.contains("symbolist_selected") )
    {
        element.classList.add("symbolist_selected");
    }

    // copy with selected tag to deal with comparison later
    selectedCopy.push( element.cloneNode(true) );
  

}

function selectedObjectsChanged()
{
    for( let i = 0; i < selected.length; i++)
    {
        if( !selectedCopy[i].isEqualNode( selected[i] ) ){
      //      console.log(selectedCopy[i], selected[i] );    
            return true;
        }   
        
    }

    return false;
}


function selectAllInRegion(region, element)
{
/*
   // if( currentContext != )
    let topLevel = getTopLevel(element);
    if( topLevel == svgObj) //topLevel == currentContext || 
    { 
        return;
    }
    console.log(topLevel);
*/

    // to do, avoid selecting the bounding box, it's turning blue

    let contextContent = currentContext.querySelector('.stave_content');

    if( contextContent == null )
        contextContent = currentContext;

    //console.log(contextContent);
    for (let i = 0; i < contextContent.children.length; i++) 
    {
        if( recursiveHitTest(region, contextContent.children[i]) )
            addToSelection( contextContent.children[i] );

    }
        
}

function deselectAll()
{
 
    document.querySelectorAll('.symbolist_selected').forEach( el => {
        el.classList.remove("symbolist_selected");
    })

    selected = [];
    selectedCopy = [];

    document.querySelectorAll('.infobox').forEach( ibox => {
        ibox.remove();
    })

    drawsocket.input({
        key: "remove",
        val: 'bounds-group'
    })

}




function deltaPt(ptA, ptB)
{
    return { x: ptA.x - ptB.x, y: ptA.y - ptB.y };
}


function calcTransform(matrix, pt)
{  
    return { 
        x: matrix.a * pt.x + matrix.c * pt.y + matrix.e, 
        y: matrix.b * pt.x + matrix.d * pt.y + matrix.f
    }   
}

/**
 * 
 * @param {Object} obj element to transform
 * @param {Object} matrix transform matrix
 * 
 * the function gets the tranformation matrix and adjusts the SVG parameters to the desired values
 * 
 */
function applyTransform(obj, matrix)
{    
    let x, y;
// add scaling eventually
    switch ( obj.tagName )
    {
        case "g":
            {
                obj.childNodes.forEach(node => {
                    applyTransform(node, matrix);
                });
            }
            break;
        case "circle":
            {
                x = obj.getAttribute("cx");
                y = obj.getAttribute("cy");
                const newpt = calcTransform(matrix, { x, y } )
                obj.setAttribute("cx", newpt.x );
                obj.setAttribute("cy", newpt.y );
            }
            break;
        case "rect":
            {
                x = obj.getAttribute("x");
                y = obj.getAttribute("y");
                const newpt = calcTransform(matrix, { x, y } )
                obj.setAttribute("x", newpt.x );
                obj.setAttribute("y", newpt.y );
            }
            break;
        case "line":
            {
                x = obj.getAttribute("x1");
                y = obj.getAttribute("y1");
                const newpt = calcTransform(matrix, { x, y } )
                obj.setAttribute("x1", newpt.x );
                obj.setAttribute("y1", newpt.y );

                x = obj.getAttribute("x2");
                y = obj.getAttribute("y2");
                const newpt2 = calcTransform(matrix, { x, y } )
                obj.setAttribute("x2", newpt2.x );
                obj.setAttribute("y2", newpt2.y );
            }
            break;
        case "path":
            break;                
        default:
            break;
    }

    obj.removeAttribute('transform');
}

function applyTransformToSelected()
{
    for( let i = 0; i < selected.length; i++)
    {
        let matrix = selected[i].getCTM();
        applyTransform(selected[i], matrix);
    }
}



/**
 * 
 * @param {Object} obj element to trasnlate
 * @param {Object} delta_pos point {x,y} of translation delta from the object attribute settings
 * 
 * function applies transaltion and updates position of object, via transform without updating SVG attributes
 * this is done via the transform list since it works on the top level <g> object
 * 
 * once the transformation is complete, it should be applied to the child objects so that the mapping works more easiy in the controller
 * 
 * 
 *  */
function translate(obj, delta_pos)
{
    if( !obj )
        return;

//    let svg = document.getElementById("svg");
    if( obj === svgObj )
        return;
        
    let transformlist = obj.transform.baseVal; 

    let matrix = obj.getCTM();
    matrix.e = delta_pos.x;
    matrix.f = delta_pos.y;

    const transformMatrix = svgObj.createSVGTransformFromMatrix(matrix);
    transformlist.initialize( transformMatrix );

}

function translate_selected(delta_pos)
{
    for( let i = 0; i < selected.length; i++)
    {
      //  console.log('translate_selected', selected[i]);        
        translate(selected[i], delta_pos);
    }
}


function makeRelative(obj, container)
{
    let containerBBox = container.getBoundingClientRect();

    // assumes that the translation has been applied already
    let matrix = obj.getCTM();
    matrix.e = -containerBBox.x;
    matrix.f = -containerBBox.y;

    applyTransform(obj, matrix);

}


function copyObjectAndAddToParent(obj)
{
    let new_node = obj.cloneNode(true);
    new_node.id = makeUniqueID(obj);
    return obj.parentElement.appendChild(new_node);
}

function copySelected()
{

    let newArray = [];
    for( let i = 0; i < selected.length; i++)
    {
        newArray.push( copyObjectAndAddToParent(selected[i]) );
    }

    deselectAll();

    for( let i = 0; i < newArray.length; i++)
    {
        addToSelection(newArray[i]);
    }

}

function isNumeric(value) {
    return !isNaN(value - parseFloat(value));
}

function fairlyUniqueString() {
    return (
      Number(String(Math.random()).slice(2)) + 
      Date.now() + 
      Math.round(performance.now())
    ).toString(36);
  }

function makeUniqueID(obj)
{
    let tok = obj.id.split("_u_");
    let base = ( tok.length == 1 ) ? tok : tok[0];
    let newId = base+'_u_'+fairlyUniqueString();
    return newId;
}

/**
 * iterates to top level element from child
 * @param {target element} elm 
 */

function getTopLevel(elm)
{    

    while(  elm != svgObj && 
            elm.parentNode && 
            elm.parentNode.id != 'main-svg' && 
            elm.parentNode.id != 'palette' && 
            ( currentContext != svgObj ? !elm.parentNode.classList.contains('stave_content') : 1 ) ) 
    {
        elm = elm.parentNode;
    }

    return elm;
}

// maybe use arrays instead?
function formatClassArray(classlist)
{
    let classArr = classlist.split(" ");
    if( Array.isArray(classArr) )
        return classArr;
    else
        return [ classArr ];

    /*

    let classArr = attr.value.includes(" ") ? attr.value.split(" ") : attr.value;
    
    if( Array.isArray(classArr) )
    {
        let newClassList = [];
        for( let ii = 0 ; ii < classArr.length; ii++)
        {
            newClassList.push(classArr[ii]);
        }

        return newClassList;
    }
    
    return classArr;
    */
}

function removedSymbolistSelected(classlist)
{
    return typeof classlist !== "undefined" ? classlist.replace(" symbolist_selected", "" ) : "";
}

function parseStyleString(styleStr)
{
    let chunks = styleStr.split(';').map( tok => tok.trim() );
    chunks = Array.isArray(chunks) ? chunks : [chunks];

    let rules = {};
    chunks.forEach( ruleStr => {
        if( ruleStr != "" )
        {
            let keyval = ruleStr.split(':').map( tok => tok.trim() );

            let val = keyval[1];
            rules[keyval[0]] = isNumeric(val) ? Number(val) : val;
        }
    });
    //console.log('parseStyleString',chunks, '//', rules);
    return rules;
}

function elementToJSON(elm)
{
    if( typeof elm === 'undefined' || elm == document )
        return null;

    if( typeof elm.attributes === 'undefined' )
    {
        console.log('->',elm);
        return null;
    }
        
        
    let obj = {};
    obj.type = elm.tagName;
    for( let i = 0, l = elm.attributes.length; i < l; ++i)
    {
        const attr = elm.attributes[i];
        if( attr.specified )
        {
            if( obj.type === 'path' && attr.name === 'd' && attr.value.length > 0 ){    
                //console.log(attr);            
                obj.points = SVGPoints.toPoints({ type: "path", d: attr.value });
            }

            if( attr.name == 'style' )
            {
                obj.style = parseStyleString(attr.value);
            }
            else if( attr.name === "class" )
            {
                obj.class = formatClassArray(attr.value); // removedSymbolistSelected(attr.value);
            }
            else
                obj[attr.name] = (isNumeric(attr.value) ? Number(attr.value) : attr.value);
        }
    }

    if( elm != svgObj )
    {
        let children = [];
        if( elm.hasChildNodes() ){
            const nodes = elm.childNodes;
            for(let i = 0, l = nodes.length; i < l; ++i){
                children.push(  elementToJSON(nodes[i]) ); 
            }
            obj.children = children;
        }
    }

    return obj;
}

function cloneObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function symbolost_sendKeyEvent(event, caller)
{
    if( typeof event.symbolistAction === 'undefined' )
    {
        console.log('undefined key action');
        return;
    }
    
    let sel_arr = [];
    for( let i = 0; i < selected.length; i++)
    {
        let _jsonEl = elementToJSON( selected[i]);
        _jsonEl.bbox = cloneObj(selected[i].getBoundingClientRect());
        sel_arr.push( _jsonEl );
    }

    let _jsonContext = elementToJSON( currentContext );
    _jsonContext.bbox = cloneObj(currentContext.getBoundingClientRect());

    console.log("send key: ", event.symbolistAction);

    ipcRenderer.send('symbolist_event',  {
        key: 'key',
        val: {
            xy: [mouse_pos.x, mouse_pos.y],
            context: _jsonContext,
            action: caller,
            keyVal: event.key,
            mods : {
                alt: event.altKey,
                shift: event.shiftKey,
                ctrl: event.ctrlKey,
                meta: event.metaKey
            },
            paletteClass: currentPaletteClass, 
            selected: sel_arr,
            symbolistAction: event.symbolistAction
        }
    });
}



function symbolist_keydownhandler(event)
{
    let nmods =  event.altKey + event.shiftKey + event.ctrlKey + event.metaKey;
    switch( event.key )
    {
        case "i":
            if( nmods == 0 && selected.length > 0 ){                
                console.log("i key getInfo");
                event.symbolistAction = "getInfo";
            }
            break;
        case "Escape":

            if( selected.length == 0 )
                setDefaultContext();
            else
                deselectAll();

            break;
        case "s":
            setSelectedContext();
            event.symbolistAction = "setContext";
            break;
        case "Backspace":
            if( removeSelected() ) // returns true if should really delete (and not in infobox)
                event.symbolistAction = "removeSelected";
            break;

    }

    console.log("symbolist_keydownhandler", event.symbolistAction, event.key);
    
    symbolost_sendKeyEvent(event, "keydown");
}

function symbolist_keyuphandler(event)
{
    symbolost_sendKeyEvent(event, "keyup");
}


function sendMouseEvent(event, caller)
{  

    if( typeof event.symbolistAction === 'undefined' )
        return;

    const toplevelObj = getTopLevel(event.target);
    
    const _id = ( event.target.id == "svg" || toplevelObj.id == currentContext.id ) ? selectedClass+'_u_'+fairlyUniqueString() : toplevelObj.id;

  //  console.log(_id, selectedClass, toplevelObj.id, currentContext);
   
    let sel_arr = [];

    for( let i = 0; i < selected.length; i++)
    {
        let _jsonEl = elementToJSON( selected[i]);
        _jsonEl.bbox = cloneObj(selected[i].getBoundingClientRect());
        sel_arr.push( _jsonEl );    
    }

    let _jsonContext = elementToJSON( currentContext );
    _jsonContext.bbox = cloneObj(currentContext.getBoundingClientRect());

    let _jsonTarget = elementToJSON( toplevelObj );
    _jsonTarget.bbox = cloneObj(toplevelObj.getBoundingClientRect());


    let obj = {
        key: 'mouse',
        val: {
            id: _id,
            context: _jsonContext,
            paletteClass: currentPaletteClass, // class specified by the palette
            action: caller,
            xy: [ event.clientX, event.clientY ],
            mousedownPos: event.buttons == 1 ? [mousedown_pos.x, mousedown_pos.y ] : null,
            button: event.buttons,
            mods : {
                alt: event.altKey,
                shift: event.shiftKey,
                ctrl: event.ctrlKey,
                meta: event.metaKey
            },
            target: _jsonTarget, // the object receiving mouse event
            selected: sel_arr
        }
    };

    if( caller == 'wheel' )
    {
        obj.val.delta = [ event.deltaX, event.deltaY ];
    }

    if( event.hasOwnProperty("symbolistAction") )
        obj.val.symbolistAction = event.symbolistAction;

    ipcRenderer.send( 'symbolist_event', obj );

}

function getDragRegion(event)
{
    let left, right, top, bottom;
    if( mousedown_pos.x < event.clientX )
    {
        right = event.clientX;
        left = mousedown_pos.x;
    }
    else
    {
        left = event.clientX;
        right = mousedown_pos.x;
    }

    if( mousedown_pos.y < event.clientY )
    {
        bottom = event.clientY;
        top = mousedown_pos.y;
    }
    else
    {
        top = event.clientY;
        bottom = mousedown_pos.y;
    }

    return {
        left: left,
        top: top,
        right: right,
        bottom: bottom
    };
}

function drawDragRegion(_dragRegion)
{
    drawsocket.input({
        key: 'svg',
        val: {
            id: 'dragRegion',
            parent: 'symbolist_overlay',
            new: 'rect',
            x: _dragRegion.left,
            y: _dragRegion.top,
            width: _dragRegion.right - _dragRegion.left,
            height: _dragRegion.bottom - _dragRegion.top,
            fill: 'none',
            'stroke-width': 1,
            'stroke': 'rgba(0,0,0,0.5)'
        }
    });
}

function clearDragRegionRect() 
{
    drawsocket.input({
        key: 'remove',
        val: 'dragRegion'
    });    
}

function symbolsit_dblclick(event)
{
   // event.preventDefault();
    /*
    setSelectedContext();
    deselectAll();
    event.symbolistAction = "setContext";
    sendMouseEvent(event, "dblclick");
*/
/*
    const _eventTarget = getTopLevel( event.target );

    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;

    prevEventTarget = _eventTarget;             

    if( currentContext !== _eventTarget )
    {
        event.symbolistAction = "set_context";
        currentContext = _eventTarget;
        console.log('set context to', currentContext);
    }
    
    sendMouseEvent(event, "dblclick");
    */
}


function symbolist_mousedown(event)
{          
    console.log(`mouse down> current context: ${currentContext.id}\n event target ${event.target}`); 

    const _eventTarget = getTopLevel( event.target );

    
    console.log(`mouse down ${_eventTarget.id} was ${JSON.stringify(elementToJSON(event.target))}`); 
    
    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;


    if( !event.shiftKey && !event.altKey )
        deselectAll();


    if( event.metaKey )
    {
        event.symbolistAction = "newFromClick_down";

        if( uiDefs.has(currentPaletteClass) )
        {
            const def_ = uiDefs.get(currentPaletteClass);
            if( def_.hasOwnProperty('newFromClick') )
                def_.newFromClick(event);
        }


        clickedObj = null;
        selectedClass = currentPaletteClass; // later, get from palette selection
    }
    else
    {
        if( _eventTarget != svgObj && _eventTarget != currentContext )
        {
            
            addToSelection( _eventTarget );
            clickedObj = _eventTarget;
    
            event.symbolistAction = "selection";
    
            //console.log(`selected object ${clickedObj} selection, event ${_eventTarget.classList}, context ${currentContext.classList}` );
    
    //        selectedClass =  clickedObj.classList[0]; // hopefully this will always be correct! not for sure though
    
            if( event.altKey )
            {
                copySelected();
                //clickedObj = copyObjectAndAddToParent(_eventTarget);       
                //addToSelection( clickedObj );
            }
            else if( event.altKey && event.metaKey )
            {
                event.symbolistAction = "create_menu";
            }
    
        }
    }

    mousedown_pos = { x: event.clientX, y: event.clientY };
    mouse_pos = mousedown_pos;

    prevEventTarget = _eventTarget;
    
   // sendMouseEvent(event, "mousedown");

   // callbackCustomUI( event );

}

/**
 * 
 * @param {SymbolistMouseEventObject} event passed from mouse event, contains information about context, class etc.
 * 
 * this callback system could allow users to trigger GUI actions directly in the view, without going through the controller first
 */

function callbackCustomUI( event )
{

    if( uiDefs.has(currentPaletteClass) )
    {
        const uiDef = uiDefs.get(currentPaletteClass);

        switch( event.symbolistAction )
        {
            case "newFromClick_down":         
                if( uiDef.newFromClick )   
                    uiDef.newFromClick( event );

                break;
            default:
                break;
        }
    }
    
    
}

function symbolist_mousemove(event)
{         
    const _eventTarget = getTopLevel( event.target );

    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;

    const mouseDelta = deltaPt({ x: event.clientX, y: event.clientY }, mousedown_pos);

    if( event.buttons == 1 )
    {
        if( clickedObj )
        {
            translate_selected( mouseDelta );
        }
        else 
        {
            if( !event.shiftKey )
                deselectAll();

            if( event.metaKey ){
                event.symbolistAction = "newFromClick_drag";
            }
            else
            {
                let dragRegion = getDragRegion(event);

                selectAllInRegion( dragRegion, mainSVG );
    
                drawDragRegion(dragRegion);
            }


        }
    }

    
    mouse_pos = { x: event.clientX, y: event.clientY };
    prevEventTarget = _eventTarget;

    sendMouseEvent(event, "mousemove");

}

function symbolist_mouseup(event)
{   
    console.log('symbolist_mouseup');

    clearDragRegionRect();

    const _eventTarget = getTopLevel( event.target );
    
    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;


//    console.log("1", _eventTarget.getAttribute("class"));

//    const classString = _eventTarget.getAttribute("class");

    if( event.metaKey ){
        event.symbolistAction = "newFromClick_up";

    }
    else
    {
       // console.log('compare', selectedCopy != selected, selectedCopy, selected );
        
        if( selectedObjectsChanged() ) // _eventTarget != svgObj
        {
            //event.symbolistAction = "transformed";

            applyTransformToSelected();
            
        }
        else
        {
            // only call getUnionBounds if there is no custom transform function
            getUnionBounds();
        }
    }

    
    
    mouse_pos = { x: event.clientX, y: event.clientY };
    event.mousedownPos = mousedown_pos;

    sendMouseEvent(event, "mouseup");

    clickedObj = null;
    selectedClass = currentPaletteClass;
    prevEventTarget = _eventTarget;

}


function symbolist_mouseover(event)
{           
    const _eventTarget = getTopLevel( event.target );

    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;


    prevEventTarget = _eventTarget;

    //sendMouseEvent(event, "mouseover");

}


function symbolist_mouseleave(event)
{           
    //console.log('symbolist_mouseleave');
    //clearDragRegionRect();
    prevEventTarget = null;
}

function addSymbolistMouseHandlers(element)
{
    element.addEventListener("mousedown", symbolist_mousedown);
    element.addEventListener("mousemove", symbolist_mousemove);
    element.addEventListener("mouseup", symbolist_mouseup);
    element.addEventListener("mouseover", symbolist_mouseover);
    element.addEventListener("mouseleave", symbolist_mouseleave);
    element.addEventListener("dblclick", symbolsit_dblclick);

}

function removeSymbolistMouseHandlers(element)
{
    element.removeEventListener("mousedown", symbolist_mousedown);
    element.removeEventListener("mousemove", symbolist_mousemove);
    element.removeEventListener("mouseup", symbolist_mouseup);
    element.removeEventListener("mouseover", symbolist_mouseover);
    element.removeEventListener("mouseleave", symbolist_mouseleave);
    element.removeEventListener("dblclick", symbolsit_dblclick);
}

function addSymbolistKeyListeners()
{
  document.body.addEventListener("keydown", symbolist_keydownhandler);
  document.body.addEventListener("keyup", symbolist_keyuphandler);
}

function removeSymbolistKeyListeners()
{
  document.body.removeEventListener("keydown", symbolist_keydownhandler);
  document.body.removeEventListener("keyup", symbolist_keyuphandler);
}


function startDefaultEventHandlers()
{
    addSymbolistMouseHandlers(svgObj);
    addSymbolistKeyListeners();
}

function stopDefaultEventHandlers()
{
    removeSymbolistMouseHandlers(svgObj);
    removeSymbolistKeyListeners();
}

startDefaultEventHandlers();


function getContextConstraintsForPoint(pt)
{
    if( uiDefs.has( currentContext.classList[0]) )
    {
        return uiDefs.get( currentContext.classList[0] ).getConstraintsForPoint( currentContext, pt );
    }
    else
    {
        return pt;
    }
}

/**
 * returns Element Node of currently selected context
 */
function getCurrentContext(){
    //console.log('currentContext', currentContext);
    return currentContext;
}

/**
 * 
 * @param {Object} obj object to send to controller
 */
function sendToController(obj)
{
    ipcRenderer.send('renderer-event', obj);

}

/**
 * 
 * @param {String} id id to lookup in data model
 * 
 * returns Promise for result, can be used with await,
 * or with .then( (result) => {}) etc.
 * 
 */
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

module.exports = { 
    drawsocketInput,
    sendToController, // renderer-event
    fairlyUniqueString,

    send: symbolist_send,

    setClass: symbolist_setClass, 
    setContext: symbolist_setContext,

    getObjViewContext,
    getCurrentContext,
    
    elementToJSON,
    
    translate,
    applyTransform,
    makeRelative,
    startDefaultEventHandlers,
    stopDefaultEventHandlers,
    getContextConstraintsForPoint,
    enterCustomUI, // called from palette click
    exitCustomUI // called from custom UI to clean up
 }