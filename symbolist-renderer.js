
/* global drawsocket:readonly  */

/**
 * symbolist renderer view module -- exported functions are at the the bottom
 */

const { ipcRenderer } = require('electron')

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
function enterCustomUI(filename_)
{
    console.log('test', filename_);
    const userInterface = require(filename_);
    if( userInterface )
        userInterface.enter();
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

}

/**
 * 
 * @param {set context from symbolist controller} obj 
 */
function symbolist_setContext(obj)
{
    deselectAll();

    document.querySelectorAll(".current_context").forEach( el => {
        el.classList.remove("current_context");
    });

    if( obj != svgObj )
        obj.classList.add("current_context");

    currentContext = obj;
    symbolist_set_log(`set context to ${obj.id}`)

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

function getObjViewContext(obj)
{
    let elm = obj;
    while(  elm != svgObj && 
        elm.parentNode && 
        elm.parentNode.id != 'main-svg' && 
        elm.parentNode.id != 'palette' && 
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
    if( selected.length > 0 )
    {
        let selectedIDs = selected.map( val => val.id );
        drawsocket.input({
            key: 'remove',
            val: selectedIDs
        });  
    }
        
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
        //console.log(mainSVG.children[i].tagName);
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

}




function deltaPt(ptA, ptB)
{
    return { x: ptA.x - ptB.x, y: ptA.y - ptB.y };
}
/*
function calcTransform(matrix, _x, _y)
{  
    return { 
        x: matrix.a * _x + matrix.c * _y + matrix.e, 
        y: matrix.b * _x + matrix.d * _y + matrix.f
    }   
}


function applyTransform(obj)
{
    let matrix = obj.getCTM();

    let x, y;


    switch ( obj.tagName )
    {
        case "circle":
            {
                x = obj.getAttribute("cx");
                y = obj.getAttribute("cy");
                const newpt = calcTransform(matrix, x, y)
                obj.setAttribute("cx", newpt.x );
                obj.setAttribute("cy", newpt.y );
            }
            break;
        case "rect":
            break;
        case "path":
            break;                
        default:
            break;
    }
}
*/

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

function fairlyUniqueNumber() {
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
    let newId = base+'_u_'+fairlyUniqueNumber();
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
            if( obj.type === 'path' && attr.name === 'd' ){                
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
            removeSelected();
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
    
    const _id = ( event.target.id == "svg" || toplevelObj.id == currentContext.id ) ? selectedClass+'_u_'+fairlyUniqueNumber() : toplevelObj.id;

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
    
            console.log(`selected object ${clickedObj} selection, event ${_eventTarget.classList}, context ${currentContext.classList}` );
    
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

    /*
    if( _eventTarget != svgObj && _eventTarget != currentContext )
    {
        
        addToSelection( _eventTarget );
        clickedObj = _eventTarget;

        event.symbolistAction = "selection";

        console.log(`selected object ${clickedObj} selection, event ${_eventTarget.classList}, context ${currentContext.classList}` );

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
    else
    {

        if( event.metaKey ){
            event.symbolistAction = "newFromClick_down";
        }

        clickedObj = null;
        selectedClass = currentPaletteClass; // later, get from palette selection
    }
    */
    

    mousedown_pos = { x: event.clientX, y: event.clientY };
    mouse_pos = mousedown_pos;

    prevEventTarget = _eventTarget;
    
    sendMouseEvent(event, "mousedown");
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
            event.symbolistAction = "transformed";
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
    element.addEventListener("mousedown", symbolist_mousedown, true);
    element.addEventListener("mousemove", symbolist_mousemove, true);
    element.addEventListener("mouseup", symbolist_mouseup, true);
    element.addEventListener("mouseover", symbolist_mouseover, true);
    element.addEventListener("mouseleave", symbolist_mouseleave, true);
    element.addEventListener("dblclick", symbolsit_dblclick, true);

}

function removeSymbolistMouseHandlers(element)
{
    element.removeEventListener("mousedown", symbolist_mousedown, true);
    element.removeEventListener("mousemove", symbolist_mousemove, true);
    element.removeEventListener("mouseup", symbolist_mouseup, true);
    element.removeEventListener("mouseover", symbolist_mouseover, true);
    element.removeEventListener("mouseleave", symbolist_mouseleave, true);
    element.removeEventListener("dblclick", symbolsit_dblclick, true);
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


module.exports = { 
    setClass: symbolist_setClass, 
    setContext: symbolist_setContext,
    send: symbolist_send,
    getObjViewContext,
    elementToJSON,
    startDefaultEventHandlers,
    stopDefaultEventHandlers,
    enterCustomUI, // called from palette click
    exitCustomUI // called from custom UI to clean up
 }