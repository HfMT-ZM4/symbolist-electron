
/* global drawsocket:readonly  */

/**
 * symbolist renderer view module -- exported functions are at the the bottom
 */

const { defaultInfoDisplay } = require('./lib/default-infopanel')

const { insertSorted, insertSortedHTML, insertIndex } = require('./lib/sorted-array-utils')

const { ntom, mton, ftom, mtof, ratio2float, parseRatioStr, reduceRatio, getRatioPrimeCoefs } = require('./lib/ntom-mton')

const {
    fairlyUniqueString,
    isNumeric,
    hasParam,
    filterByKeys,
    cloneObj,
    makeUniqueID,
    copyObjectAndAddToParent
} = require("./lib/ui_utils");

const {
    hitTest,
    recursiveHitTest,
    deltaPt,
    getSVGCoordsFromEvent,
    transformPoint,
    getComputedMatrix,
    getBBoxAdjusted,
    applyTransform,
    rotate,
    makeRelative
} = require("./lib/ui_svg_utils");


const svgObj = document.getElementById("svg");
const mainSVG = document.getElementById("main-svg");



/**
 * uiDefs stores UI defs in flat array, lookup by classname
 * 
 * definitions have a palette array that stores the classNames of potential child types
 *  */ 
let uiDefs = new Map();

// API




/**
 * 
 * @param {Object} obj element to translate
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
    if( obj === topContainer )
        return;
    
    gsap.set(obj, delta_pos);

/*
    return;

    let transformlist = obj.transform.baseVal; 

    let matrix = svgObj.createSVGMatrix();//obj.getScreenCTM().multiply( mainSVG.getScreenCTM().inverse() );
    // delta position is prescaled in svg coordinates
    // keep scale/rotation transform as is 
    matrix.e = delta_pos.x;
    matrix.f = delta_pos.y;

    

    //let translation_ = svgObj.createSVGTransform();
    //translation_.setTranslate( delta_pos.x,  delta_pos.y );
    
    const transformMatrix = svgObj.createSVGTransformFromMatrix(matrix);
    transformlist.initialize( transformMatrix );

    //transformlist.insertItemBefore(translation_, 1);
*/
}

/*
function translate_selected(delta_pos)
{
    for( let i = 0; i < selected.length; i++)
    {
       
        if( !callSymbolMethod(selected[i], "translate", delta_pos))
        {
            translate(selected[i], delta_pos);
        }
    }
}
*/



/**
 * iterates to top level element from child
 * @param {target element} elm 
 */

function getTopLevel(elm)
{    
    if( elm == topContainer )
        return elm;
    else    
    {

        return elm.closest(".symbol");

        /*
        // should return only the first layer of objects within the current context
        // mabye we need to set the default context with current_context?
        let ret = elm.closest(".symbol");
        while ( !ret.parentNode.closest(".symbol").classList.includes('.current_context') ) 
        {
            ret = parentNode;
        }

        return ret;
        */
    }

/*
    while(  elm != svgObj && 
            elm.parentNode && 
            elm.parentNode.id != 'main-svg' && 
            elm.parentNode.id != 'palette' && 
            ( currentContext != svgObj ? !elm.parentNode.classList.contains('stave_content') : 1 ) ) 
    {
        elm = elm.parentNode;
    }

   return elm;
   */
}




/*
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
*/

function symbolist_keydownhandler(event)
{
    let nmods =  event.altKey + event.shiftKey + event.ctrlKey + event.metaKey;
    switch( event.key )
    {
        case "i":
            if( nmods == 0 && selected.length > 0 ){                

                callMethodForSelected("getInfoDisplay");
                
            }
            break;
        case "e":
            if( nmods == 0 && selected.length > 0 ){                
                callEnterEditModeForSelected();
            }
            break;
        case "Escape":
            escapeModes()
            break;
        case "s":
            setSelectedContext();
            event.symbolistAction = "setContext";
            break;
        case "Backspace":
            if( removeSelected() ) // returns true if should really delete (and not in infobox)
                event.symbolistAction = "removeSelected";
            break;
        case "+":
            console.log('plus');
        break;

    }

  //  console.log("symbolist_keydownhandler", event.symbolistAction, event.key);
    
   // symbolost_sendKeyEvent(event, "keydown");
}

function symbolist_keyuphandler(event)
{
  //  symbolost_sendKeyEvent(event, "keyup");
}

/*
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
            xy: [ event.pageX, event.pageY ],
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
*/

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



function symbolist_mousemove(event)
{         
    if( currentMode == "edit" )
        return;
    
    //console.log('symbolist_mousemove', event.pageX, event.pageY, event.screenX, event.screenY);
    const _eventTarget = getTopLevel( event.target );

    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;

    mouse_page_pos.x = event.clientX;
    mouse_page_pos.y = event.clientY;

    mouse_pos = getSVGCoordsFromEvent(event);//{ x: event.pageX, y: event.pageY };
    const mouseDelta = deltaPt(mouse_pos, mousedown_pos);
  //  console.log('symbolist_mousemove', mouseDelta, mouse_pos);

    if( event.buttons == 1 )
    {
        if( clickedObj )
        {
            /*
            if( event.shiftKey ) {
                //rotate_selected( mouse_pos )
                // put snap points here?
            }
            else
            {
                */
                // now only translating if the def has a translate function
                callMethodForSelected("drag", { ...event, delta_pos: mouseDelta } );
            //}
        }
        else 
        {
            if( !event.shiftKey ){
                deselectAll();
            }

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

    
    prevEventTarget = _eventTarget;

   // sendMouseEvent(event, "mousemove");

}


function symbolist_mousedown(event)
{          

    mousedown_page_pos.x = event.pageX;
    mousedown_page_pos.y = event.pageY;
    mousedown_pos = mousedown_page_pos.matrixTransform( mainSVG.getScreenCTM().inverse() ); 

    mouse_pos = mousedown_pos;

    if( currentMode == "edit" )
        return;

 //   console.log(`mouse down> current context: ${currentContext.id}\n event target ${event.target}`); 

   
    const _eventTarget = getTopLevel( event.target );

    if( !_eventTarget )
        return;

    //console.log(_eventTarget);
    
   // console.log(`mouse down ${_eventTarget.id} was ${JSON.stringify(elementToJSON(event.target))}`); 
    
    if( prevEventTarget === null )
        prevEventTarget = _eventTarget;


    if( (_eventTarget == currentContext) || (!event.shiftKey && !event.altKey) ){
        deselectAll();
    }

    if( event.metaKey )
    {
        event.symbolistAction = "newFromClick_down";

        /*
        if( uiDefs.has(currentPaletteClass) )
        {
            const def_ = uiDefs.get(currentPaletteClass);
            if( def_.hasOwnProperty('newFromClick') )
                def_.newFromClick(event);
        }
        */

        clickedObj = null;
        selectedClass = currentPaletteClass; // later, get from palette selection
    }
    else
    {
        if( _eventTarget != topContainer && _eventTarget != currentContext )
        {
            
            addToSelection( _eventTarget );
            clickedObj = _eventTarget;
            clickedObjBoundsPreTransform = cloneObj( clickedObj.getBoundingClientRect() );
            
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
            console.log(`not selected object ${_eventTarget.id} selection, event ${_eventTarget.classList}, context ${currentContext.classList}` );

    }

   
    prevEventTarget = _eventTarget;
    
   // sendMouseEvent(event, "mousedown");

   // callbackCustomUI( event );

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
            removeSprites();
            
        }
        else
        {

            //callSelected();
            // only call getUnionBounds if there is no custom transform function
           // getUnionBounds();
        }
    }

    
    
    mouse_pos = getSVGCoordsFromEvent(event);//{ x: event.pageX, y: event.pageY };
    event.mousedownPos = mousedown_pos;

    //sendMouseEvent(event, "mouseup");

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

    /*
    drawsocketInput({
        key: "clear",
        val: "symbolist_overlay"
    })
    */
    removeSprites();
    prevEventTarget = null;
}


function symbolist_zoomReset()
{
    if( m_scale == 1 )
    {
        scrollOffset = {x: 0, y: 0};
        gsap.set( mainSVG,  scrollOffset );
        gsap.set( mainHTML, scrollOffset );
        gsap.set( floatingForms, scrollOffset )
    }

    m_scale = 1;
   // const scale = Math.pow( Math.E, m_scale);
    gsap.set( mainSVG,  { scale: 1 } );
    gsap.set( mainHTML, { scale: 1 } );
    gsap.set( floatingForms, { scale: 1 } );

    mousedown_pos = mousedown_page_pos.matrixTransform( mainSVG.getScreenCTM().inverse() ); 

}


function symbolist_zoom(offset)
{

    const visible_w = window.innerWidth / m_scale;
    const visible_h = window.innerHeight / m_scale;

    m_scale += offset;

    const next_visible_w = window.innerWidth / m_scale;
    const next_visible_h = window.innerHeight / m_scale;

    const offset_x = next_visible_w - visible_w;
    const offset_y = next_visible_h - visible_h;

    if( offset_x < 0 )
        scrollOffset.x += offset_x * 0.5;
    if( offset_y < 0 )
        scrollOffset.y += offset_y * 0.5;

    gsap.set( mainSVG,  { ...scrollOffset, scale: m_scale } );
    gsap.set( mainHTML, { ...scrollOffset, scale: m_scale } );
    gsap.set( floatingForms, { ...scrollOffset, scale: m_scale } );


    mousedown_pos = mousedown_page_pos.matrixTransform( mainSVG.getScreenCTM().inverse() ); 

}

let ticking = false;

function symbolist_wheel(event)
{

    scrollOffset.x -= event.deltaX;
    scrollOffset.y -= event.deltaY;

    // >> slowing the update down a litte, which was causing some jittery behavior

    if (!ticking) {
      window.requestAnimationFrame( function() {

        gsap.set( mainSVG,  scrollOffset );
        gsap.set( mainHTML, scrollOffset );
        gsap.set( floatingForms, scrollOffset );

        ticking = false;
      });
  
      ticking = true;
    }
}

/**
 * 
 * @param {Point} norm_pos normalized xy position 0-1
 * 
 */
function setScrollOffset(norm_pos)
{

    const bbox = svgObj.getBBox();

    if( typeof norm_pos.x != "undefined" )
        scrollOffset.x = -norm_pos.x * bbox.width;
    
    if( typeof norm_pos.y != "undefined" )
        scrollOffset.y = -norm_pos.y * bbox.height;

    if (!ticking) {
        window.requestAnimationFrame( function() {
  
          gsap.set( mainSVG,  scrollOffset );
          gsap.set( mainHTML, scrollOffset );
          gsap.set( floatingForms, scrollOffset );
  
          ticking = false;
        });
    
        ticking = true;
      }
}


function addSymbolistMouseHandlers(element)
{
    element.addEventListener("mousedown", symbolist_mousedown);
    element.addEventListener("mousemove", symbolist_mousemove);
    element.addEventListener("mouseup", symbolist_mouseup);
    element.addEventListener("mouseover", symbolist_mouseover);
    element.addEventListener("mouseleave", symbolist_mouseleave);
    element.addEventListener("dblclick", symbolsit_dblclick);

    window.addEventListener('wheel', symbolist_wheel);

}

function removeSymbolistMouseHandlers(element)
{
    element.removeEventListener("mousedown", symbolist_mousedown);
    element.removeEventListener("mousemove", symbolist_mousemove);
    element.removeEventListener("mouseup", symbolist_mouseup);
    element.removeEventListener("mouseover", symbolist_mouseover);
    element.removeEventListener("mouseleave", symbolist_mouseleave);
    element.removeEventListener("dblclick", symbolsit_dblclick);

    window.removeEventListener('wheel', symbolist_wheel);

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


var hidden, visibilityChange; 
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

function visibility_handler(event)
{
    console.log('hidden', document[hidden] );

    /*
    if( document[hidden] )
    {
        removeSymbolistMouseHandlers(svgObj);
        removeSymbolistKeyListeners();
    }
    else
    {
        addSymbolistMouseHandlers(svgObj);
        addSymbolistKeyListeners
    }
    */
}

window.addEventListener("blur", (event)=> {
 //   console.log("blur");
    removeSymbolistMouseHandlers(svgObj);
    removeSymbolistKeyListeners();
}, false);

window.addEventListener("focus", (event)=> {
  //  console.log("focus");
    addSymbolistMouseHandlers(svgObj);
    addSymbolistKeyListeners();
}, false);



function addFocusListner()
{   
    window.addEventListener(visibilityChange, visibility_handler, false);

}

function removeFocusListner()
{
    // probably not necessary
}



function onChange(event)
{
    console.log('changer', event);
}

// https://stackoverflow.com/questions/31659567/performance-of-mutationobserver-to-detect-nodes-in-entire-dom/39332340
function startObserver()
{
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    let queue = [];


    const observer = new MutationObserver( mutation => {
        if( queue.length > 0 ){
            requestAnimationFrame( () => {
                
                console.log( mainDiv.getBoundingClientRect() );
                
                queue.forEach( modlist => {
                    modlist.forEach( mod => {
                        
                        switch( mod.type ){
                            case "attributes":
                                console.log('attr', mod.attributeName );
                                break;
                            default:
                                break;
                        }

                    })
                    
                })

                queue = [];
            });
        }

        queue.push(mutation);
    });


    // Start observing the target node for configured mutations
    
   // observer.observe(mainDiv, config);

    // Later, you can stop observing
  //  observer.disconnect();
}

function startDefaultEventHandlers()
{
    addSymbolistMouseHandlers(svgObj);
    
    startObserver();

    addSymbolistKeyListeners();

    addFocusListner();
}

function stopDefaultEventHandlers()
{
    removeSymbolistMouseHandlers(svgObj);
    removeSymbolistKeyListeners();
}

startDefaultEventHandlers();



/**
 * returns Element Node of currently selected context
 */
function getCurrentContext(){
    //console.log('currentContext', currentContext);
    return currentContext;
}






 /**
  * Communication
  */

 const { ipcRenderer } = require('electron')

/**
 * handler for special commands from menu that require info about state of view/selection
 */
ipcRenderer.on('menu-call', (event, ...args) => {
    console.log(`menu call received ${args}`);

    let arg = args[0];
    switch(arg) {
        case 'deleteSelected':
            removeSelected();
            break;
        case 'zoomIn':
            symbolist_zoom(default_zoom_step);
            break;
        case 'zoomOut':
            symbolist_zoom(-default_zoom_step);
            break;
        case 'zoomReset':
            symbolist_zoomReset()
            break;
        case 'newScore':
            symbolist_newScore();
            break;
        case 'load-ui-defs':
            loadUIDefs(args[1]);
            break;

    }
})

/**
 * routes message from the io controller
 */
ipcRenderer.on('io-message', (event, obj) => {
    switch(obj.key){
        case 'data':
            iterateScore(obj.val);
            break;
        case 'model':
           // parseDataModelFromServer(obj.val);
            break;
        case 'score':
            console.log('score');
            symbolist_newScore();
            iterateScore(obj.val);
            break;
        case 'call':
            callFromIO(obj.val);
            break;
        case 'drawsocket':
            drawsocketInput(obj.val)
            break;
        default:
            break;
    }
})

ipcRenderer.on('load-ui-defs', (event, folder) => {
//    console.log('called from main.js?');
    loadUIDefs(folder);
})

ipcRenderer.on('set-dirname', (event, args) => {
    window.__symbolist_dirname = args;
});


function io_out(msg)
{
    sendToServer({
        key: 'io_out',
        val: {
            'return/ui' : msg
        }
    })
}




function symbolist_send(obj)
{
    ipcRenderer.send('symbolist_event', obj);
}


/**
 * 
 * @param {Object} obj object to send to controller
 */
function sendToServer(obj)
{
    ipcRenderer.send('renderer-event', obj);

}


/*
// not used now but could be useful if we want to deal with the lookup system from the gui
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
*/



/**
 * 
 * @param {Object} obj input to drawsocket
 */
function drawsocketInput(obj){
    drawsocket.input(obj)
}



/**
 * Main Def Handling
 */


/**
 * 
 * @param {SVG/HTML Element} element 
 * 
 * returns ui def for class, which must be first in the class list
 */
function getDefForElement(element)
{
    return uiDefs.get(element.classList[0]);;
}

/**
 * 
 * @param {String} classname
 * @returns def
 */
function getDef(classname)
{
    return uiDefs.get(classname);
}

function loadUIDefs(folder)
{
    const path = folder.path;

    folder.files.forEach( f => {
        
        if( f.type != 'folder' )
        {
            const filepath = `${path}/${f.name}`;

            const exists = require.resolve(filepath); 
            if( exists )
                delete require.cache[ exists ];
                 
            if( f.type == 'js')
            {
                // load controller def
                let { ui_def } = require(filepath);
    
                // initialize def with api
    
                // api now global
                let cntrlDef_ = new ui_def();
            
                // set into def map
                uiDefs.set(cntrlDef_.class, cntrlDef_);
                console.log('added ', cntrlDef_.class);
            }
            else if( f.type == "css" )
            {
                let head = document.getElementsByTagName("head");
                if( !document.querySelector(`link[href="${filepath}"]`) )
                {
                    var cssFileRef = document.createElement("link");
                    cssFileRef.rel = "stylesheet";
                    cssFileRef.type = "text/css";
                    cssFileRef.href = filepath;
                    head[0].appendChild(cssFileRef);
                }
                
            }
            else if( f.name == 'init.json' ) //if(f.type == 'json')
            {
                console.log('loading init');
                // there can be only one json file in the folder
                initDef = require(filepath);
            }
        }        
        
   
    })
    
  //   initDocument();
 
     initPalette();
 
     sendToServer({
         key: 'data-refresh'
     })
}



/**
 * 
 * @param {Object} data object with perceptual parameters
 * @param {Element} context_element HTML/SVG element container, 
 * 
 * iterates each layer of container first, then calls updateAfterContents
 * then iterates the contents of each container
 * 
 */
function iterateScore(contents, context_element = null)
{
   // console.log('iterateScore', contents, context_element);

    if( !context_element ){
        context_element = getCurrentContext();
    }

    const contents_arr = Array.isArray(contents) ? contents : [ contents ];

    contents_arr.forEach( data => {
    //    console.log('iterateScore', data);
        
        if( !hasParam(data, 'container' ) )
            data.container = context_element.id;
    
        context_element = document.getElementById(data.container);

        if( !context_element )
        {
            console.error('no context element', data.container );
        }

        if( uiDefs.has(data.class) )
        {
            const def_ = uiDefs.get(data.class);
            
            if( hasParam(def_, "fromData") )
            {
                def_.fromData( data, context_element );
            }
        }
        else
        {
            console.error("no ui def found for class:", data.class);
        }
        
    })

    if( context_element ) // seems like there will always be a context element so maybe this is not required
    {
        //console.log(context_element.classList[0]);
        const container_class_def = uiDefs.get( context_element.classList[0] );
        if( container_class_def && hasParam(container_class_def, 'updateAfterContents') )
        {
            container_class_def.updateAfterContents(context_element);
        }
    }

    // why not do depth first?
    // maybe so that the absolute values are correct for the parents before
    // drawing the children

    contents_arr.forEach( data => {
        const newEl = document.getElementById(data.id);
        if( newEl && data.hasOwnProperty('contents') )
        {
         //   console.log('drawing children');
            iterateScore(data.contents, newEl )
        }
    })
   
}



function initPalette()
{
    if( hasParam( initDef, 'palette') )
    {
        let drawMsgs = [];
        initDef.palette.forEach( el => {
            if( el.length > 0 )
            {
                let def_ = uiDefs.get(el);

                const def_classname = def_.class;
                let def_palette_display = def_.getPaletteIcon();
    
                if( def_palette_display && def_palette_display.key == "svg" )
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
                        parent: "palette-tools",
                        onclick: () => {
                                console.log(`select ${def_classname}`); 
                                symbolist_setClass(def_classname);
                        },
                        children: def_palette_display
                    }
                })
            }
            
        })

        drawsocketInput([{
                key: "clear",
                val: "palette-symbols"
            }, ...drawMsgs
        ]) 
    }

    // in controller there is a defautlContext class, probably we should do the same
    console.log('initFile', initDef);
}


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

            if( def_palette_display && def_palette_display.key == "svg" )
            {
                def_palette_display = {
                    new: "svg",
                    class: "palette-svg",
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
                    onclick: () => {
                            console.log(`select ${classname}`); 
                            symbolist_setClass(`${classname}`);
                    },
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


function makeDefaultInfoDisplay(viewObj)
{
    const bbox = getBBoxAdjusted(viewObj);
    //const bbox = viewObj.getBoundingClientRect();
    return defaultInfoDisplay(viewObj, bbox);
}



function callFromIO(params)
{
    if( typeof params.class != "undefined" && typeof params.method != "undefined" )
    {

        if( uiDefs.has(params.class)  )
        {  
            const _def = uiDefs.get(params.class);
            if( typeof _def[params.method] != 'undefined')
            {
                const ret = _def[params.method](params);
                if( ret )
                {
                    io_out(_def[params.method](params));
                }
            }
        }
    }
}



/**
 * 
 * @param {string} _class sets current selected palette class
 * 
 * called on click from the palette icon
 * 
 */
function symbolist_setClass(_class)
{
//    console.log("symbolist_setClass", _class);
    symbolist_set_log(`selected symbol ${_class}`)

    if( _class == selectedClass )
    {
        document.querySelectorAll(".palette .selected").forEach( el => {
            el.classList.remove("selected");
        });

        if( uiDefs.has(selectedClass) && hasParam( uiDefs.get(selectedClass), 'paletteSelected') )
        {
            uiDefs.get(selectedClass).paletteSelected(false);
            
        }
        selectedClass = null;
        return;
    }

    document.querySelectorAll(".palette .selected").forEach( el => {
        el.classList.remove("selected");
    });

    let paletteItem = document.getElementById(`${_class}-paletteIcon`);
    paletteItem.classList.add("selected");  

    if( uiDefs.has(selectedClass) && hasParam( uiDefs.get(selectedClass), 'paletteSelected') )
    {
        uiDefs.get(selectedClass).paletteSelected(false);
    }

    currentPaletteClass = _class;
    selectedClass = _class;

    if( uiDefs.has(selectedClass) && hasParam( uiDefs.get(selectedClass), 'paletteSelected') )
    {
        uiDefs.get(selectedClass).paletteSelected(true);
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
 * -->> change this to element..
 * @param {Object} obj set context from symbolist controller
 */
function symbolist_setContext(obj)
{
    deselectAll();

    document.querySelectorAll(".palette .selected").forEach( el => {

        if( uiDefs.has( el.classList[0] ) )
        {
            uiDefs.get( el.classList[0] ).paletteSelected(false);
        }
    
    //    callSymbolMethod(el, "paletteSelected", false);
    });

    // not sure that it's possible to have more than one context...
    // maybe?
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

        // make enter context mode also?
        //def_.enter(obj);
    }

    if( obj != topContainer )
        obj.classList.add("current_context");


    callSymbolMethod(currentContext, "currentContext", false);

    currentContext = obj;
    callSymbolMethod(currentContext, "currentContext", true);

    symbolist_set_log(`set context to ${currentContext.id}`)


}



/**
 * 
 * @param {Element} element HTML/SVG symbol element to call method on
 * @param {String} methodName name of method (e.g. editMode, selected.. )
 * @param {Object} args arguments to pass to method, could be anything, but probably an object
 * 
 * returns true if there is a method name defined in the def, false if not
 * 
 * if false, there is a possibility of using the default handlers for translate, etc.
 * but I think we're going to remove most of the default handlers
 */
function callSymbolMethod( element, methodName, args )
{
    if( uiDefs.has( element.classList[0] ) )
    {
        const def_ = uiDefs.get( element.classList[0] );

        if( hasParam(def_, methodName) )
        {
            const ret = def_[methodName](element, args);
            return (typeof ret === "undefined" ? false : ret );
        }        
    }

    return false;

}


/**
 * UI Helpers
 */



// storage for internal Handle callbacks
let cb = {};

/**
 * 
 * @param {Element} element element to create Handle for
 * @param {Object} relativeToAttrs attrs of element to use for handle position for x and y
 * @param {Function} callback (element, event) => {} callback to call on drag
 */
function createHandle(  element, 
                        relativeToAttrs = {selector: "", x: "", y: ""}, 
                        callback = (element, event) => {} )
{
   // const symbol = getContainerForElement(element);
  //  console.log('create handle with reative selector', relativeToAttrs.selector);
    const handle_id = `${element.id}-handle-${relativeToAttrs.x}-${relativeToAttrs.y}`;
    ui_api.drawsocketInput({
        key: "svg", 
        val: {
            id: handle_id,
            new: "rect",
            class: "symbolist_handle",
            parent: 'symbolist_overlay', 
            x: {
                selector: relativeToAttrs.selector,
                attr: relativeToAttrs.x
            },
            y: {
                selector: relativeToAttrs.selector,
                attr: relativeToAttrs.y
            },
            onmousedown: function (event) { 
                document.addEventListener('mousemove', 
                    cb[`${handle_id}-moveHandler`] = function (event) {
                      //  console.log(`${handle_id}-moveHandler`);
                        if( event.buttons == 1 ) {
                            
                            callback(element, event);

                            // update position after callback
                            ui_api.drawsocketInput({
                                key: "svg",
                                val: {
                                    id: handle_id,
                                    x: {
                                        selector: relativeToAttrs.selector,
                                        attr: relativeToAttrs.x
                                    },
                                    y: {
                                        selector: relativeToAttrs.selector,
                                        attr: relativeToAttrs.y
                                    }
                                }
                            })
                            

                        }

                    }
                );
            }                        
        }
    });

 //   console.log( document.getElementById(handle_id) );
}

function removeHandles()
{
    document.querySelectorAll('.symbolist_handle').forEach( e => {
        document.removeEventListener('mousemove', cb[`${e.id}-moveHandler`]);
        delete cb[`${e.id}-moveHandler`];
   //     console.log(`removed ${e.id}-moveHandler, now = ${cb[`${e.id}-moveHandler`]}`);
    })
}


function removeSprites()
{
    removeHandles();
    document.querySelectorAll('.sprite').forEach(e => e.remove());
}

/**
 * 
 * @param {Object/Array} view object, or array of Drawsocket format, SVG elements to draw, placed inside the display <g> group
 * @param {Object} dataObj data object containing id, class, container-id, and any other data to store in the dataset
 * @param {Boolean} overwrite (optional) force overwrite the object, this will whipe out child elements false by default
 * 
 * returns object formatted to send to Drawsocket
 * 
 * When creating a new SVG element, you need to include the class in the dataObj
 * 
 */
function svgFromViewAndData(view, dataObj, overwrite = false)
{
    if( !overwrite )
    {
        overwrite = !document.getElementById(dataObj.id);
    }

    let val = {
        ...dataToHTML(dataObj),
        children: [{
            id: `${dataObj.id}-display`,
            children: view
        }, {
            id: `${dataObj.id}-contents`,
        }]
    };

    if( overwrite )
    {
        val.new = 'g';
        val.children[0].new = 'g';
        val.children[1].new = 'g';
    }

    if( hasParam(dataObj, "container" ) )
    {
        if( dataObj.container == "symbolist_overlay" )
            val.container = "symbolist_overlay";
        else
            val.container = `${dataObj.container}-contents`;
    }

    if( hasParam(dataObj, "class" ) )
    {
        val.class = `${dataObj.class} symbol`;
        val.children[0].class = `${dataObj.class} display`;
        val.children[1].class = `${dataObj.class} contents`;
    }

    return {
        key: "svg",
        val
    }
}



/**
 * 
 * could definitely avoid this copy here...
 * 
 * @param {Object/Array} view object, or array of Drawsocket format, SVG elements to draw, placed inside the display <g> group
 * @param {Object} dataObj data object containing id, class, container-id, and any other data to store in the dataset
 * @param {Boolean} overwrite (optional) force overwrite the object, this will whipe out child elements false by default
 * 
 * returns object formatted to send to Drawsocket
 * 
 * When creating a new SVG element, you need to include the class in the dataObj
 * 
 */
function htmlFromViewAndData(view, dataObj, overwrite = false)
{
    if( !overwrite )
    {
        overwrite = !document.getElementById(dataObj.id);
    }

    let val = {
        ...dataToHTML(dataObj),
        children: [{
            id: `${dataObj.id}-display`,
            children: view
        }, {
            id: `${dataObj.id}-contents`,
        }]
    };

    if( overwrite )
    {
        val.new = 'div';
        val.children[0].new = 'div';
        val.children[1].new = 'div';
    }

    if( hasParam(dataObj, "container" ) )
    {
        if( dataObj.container == "forms" )
            val.container = "forms";
        else
            val.container = `${dataObj.container}-contents`;
    }

    if( hasParam(dataObj, "class" ) )
    {
        val.class = `${dataObj.class} symbol`;
        val.children[0].class = `${dataObj.class} display`;
        val.children[1].class = `${dataObj.class} contents`;
    }

    return {
        key: "html",
        val
    }
}



function getDataTextView(dataObj, relativeTo = null)
{
    return {
        key: 'svg',
        val: {  
            new: "text",
            class: "data_text sprite",
            container: `symbolist_overlay`,
            relativeTo : (relativeTo ? relativeTo : `#${dataObj.id}`),
            id: `${dataObj.id}-data_text`,
            x: 0,
            y: -20,
            text: JSON.stringify( filterDataset(dataObj) )
        }
    }
}

function svgPreviewFromViewAndData(view, dataObj, relativeTo = null)
{
    let drawing = svgFromViewAndData(view, 
        {
            ...dataObj,
            class: `${dataObj.class} sprite`, // << sprite flags the object to be deleted
            id: `${dataObj.class}-sprite`,
            container: 'symbolist_overlay' // << temp overlay layer gets cleared also
        }, 
        true /* overwrite*/ 
    );
    
    if( relativeTo )
    {
        relativeTo = `#${dataObj.class}-sprite ${relativeTo}`;
    }
        
    let text_drawing = getDataTextView({
        ...dataObj,
        id: `${dataObj.class}-sprite`
    }, relativeTo );

    return [ drawing, text_drawing ];
}

/**
 * 
 * @param {Object} data_ data object to convert to HTML style
 * 
 * returns object with "data-" prepended to keys
 */
function dataToHTML(data_)
{
    let dataObj = {};
    Object.keys(data_).forEach( key => {
        // filtering elements not used in the dataset
        if( key != 'id' && 
            key != 'class' && 
            key != 'container' && 
            key != 'parent' && 
            key != 'contents' ) 
        {
            dataObj[`data-${key}`] = typeof data_[key] == "object" ? JSON.stringify(data_[key]) : data_[key];
        }
        else if( key == 'id') // maybe pass all keys?
        {
            dataObj.id = data_.id; 
        }
            
    })

    return dataObj;
}

// better to make a flag for dataToHTML?
function filterDataset(data_)
{
    let dataObj = {};
    Object.keys(data_).forEach( key => {
        // filtering elements not used in the dataset
        if( key != 'id' && 
            key != 'class' && 
            key != 'container' && 
            key != 'parent' && 
            key != 'contents' ) 
        {
            dataObj[key] = data_[key];
        }
            
    })

    return dataObj;
}




/**
 * 
 * @param {Element} element SVG/HTML element to get dataset from
 * @param {Element} container optional, adds container.id to data
 */
function getElementData(element, container = null) 
{
    let data = {};
    Object.keys(element.dataset).forEach( k => {
        if( isNumeric( element.dataset[k] ) )
        {
            data[k] = Number( element.dataset[k] );
        }
        else if( element.dataset[k][0] == '{' ||  element.dataset[k][0] == '[' )
        {
            try 
            {
                data[k] = JSON.parse(element.dataset[k])
            }
            catch (e) 
            {
                data[k] = element.dataset[k]; 
            }
        }
        else
        {
            data[k] = element.dataset[k]; 
        }
    });
    
    data.id = element.id;
    data.class = element.classList[0];

    if( container )
        data.container = container.id;

    return data;
}

/**
 * 
 * @param {SVG/HTML Element} element a symbol element
 * 
 * searches through the parent elements for the first container
 */
function getContainerForElement(element)
{
    // all symbols are in .contents groups
    // so we can get the parent node (.contents) 
    // and then the parent of that note should be the symbol
    return element.parentNode.closest('.symbol'); //element.parentNode.parentNode;
    // could also do element.parentNode.closest('.symbol');
}


/**
 * UI Actions
 */



/**
 * globals
 */
const mainHTML = document.getElementById("main-html");
const topContainer = document.getElementById('top-svg');
const mainDiv = document.getElementById("main-div");
const floatingForms = document.getElementById('floating-forms');

const overlay = document.getElementById('symbolist_overlay');

let symbolist_log = document.getElementById("symbolist_log");;

let clickedObj = null;
let clickedObjBoundsPreTransform = null;
let prevEventTarget = null;
let selected = [];
let selectedCopy = [];

let mousedown_pos = svgObj.createSVGPoint();
let mousedown_page_pos = svgObj.createSVGPoint();
let mouse_pos = svgObj.createSVGPoint();
let mouse_page_pos = svgObj.createSVGPoint();

let scrollOffset = {x: 0, y: 0};
let m_scale = 1;
let default_zoom_step = 0.1;

let currentContext = topContainer;
let currentPaletteClass =  "";

let selectedClass = currentPaletteClass;
let initDef;

let currentMode = "palette";



function escapeModes()
{
    document.getSelection().removeAllRanges();
    document.activeElement.blur();

    if( selected.length == 0 )
        setDefaultContext();
    else
    {
        if( currentMode == "edit" )
            callExitEditModeForSelected();
        else {
            deselectAll();
        }
        console.log('currentMode', currentMode, 'currentContext', currentContext );
    }
        
}




/**
 * returns array of selected elements
 */
function getSelected()
{
    return selected;
}



function symbolist_newScore()
{
    console.log('newScore');
    deselectAll();
    setDefaultContext();

    drawsocketInput({
        key: "clear",
        val: ["palette-symbols", "top-svg-contents", "top-html-contents", "symbolist_overlay", "floating-forms", "floating-overlay"]
    })
}



function symbolist_set_log(msg)
{
    if( symbolist_log )
    {
        symbolist_log.innerHTML = `<span>${msg}</span>`;
    }
}

function symbolist_setContainerClass(_class)
{
    drawsocketInput({
        key: "clear",
        val: "palette-symbols"
    })
    
    symbolist_setClass(_class);
}


function setDefaultContext()
{
    symbolist_setContext(topContainer);
}

/**
 * set context from UI event, selecting most recently selected object
 * sets palette class to null
 */
function setSelectedContext(){

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



/**
 * UI Def Method Functions
 * require UI info (selection)
 * and defs
 * 
 */

/**
 * 
 * @param {String} methodName method name
 * @param {*} args args (optional)
 * 
 * simple wrapper to call method for all selected objects
 */
function callMethodForSelected(methodName, args)
{
    selected.forEach( sel => callSymbolMethod(sel, methodName, args) )

}

function callEnterEditModeForSelected()
{
    selected.forEach( sel => {
        if( callSymbolMethod(sel, "editMode", true) )
            currentMode = "edit"
    })
}

function callExitEditModeForSelected()
{
    let check = true;
    selected.forEach( sel => {
        if( !callSymbolMethod(sel, "editMode", false)  )
            check = false;
    })

    if( check ){
        currentMode = "palette"
    }
    else
        console.error('failed to exit edit mode!!')

    console.log('callExitEditModeForSelected now ', currentMode );


}

/*

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
*/



/**
 * Selection
 */



function addToSelection( element )
{

    if( !element || typeof element.id == "undefined" || element.id == 'dragRegion' )
        return;

   // console.log('addToSelection', element);

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

    callSymbolMethod(element, "selected", true);

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

    let contextContent = currentContext.querySelector('.contents');

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
                
        callSymbolMethod(el, "selected", false);
        callSymbolMethod(el, "editMode", false);
        
    })

    selected = [];
    selectedCopy = [];

    document.querySelectorAll('.infobox').forEach( ibox => {
        ibox.remove();
    })

    drawsocket.input({
        key: "clear",
        val: "symbolist_overlay"
    })

}



function applyTransformToSelected()
{
    for( let i = 0; i < selected.length; i++)
    {
        
        if( !callSymbolMethod(selected[i], "applyTransformToData" ) )
        {
            let matrix = getComputedMatrix(selected[i]);
            applyTransform(selected[i], matrix);
        }
        
    }
}


function cancelTransform(element)
{
    element.removeAttribute('transform');   
}



function rotate_selected(mouse_pos)
{
    for( let i = 0; i < selected.length; i++)
    {
       
       // if( !callTranslate(selected[i], delta_pos) )
        {
            rotate(selected[i], mouse_pos);
        }
    }
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



function getDragRegion(event)
{
    let left, right, top, bottom;
    if( mousedown_pos.x < event.pageX )
    {
        right = event.pageX;
        left = mousedown_pos.x;
    }
    else
    {
        left = event.pageX;
        right = mousedown_pos.x;
    }

    if( mousedown_pos.y < event.pageY )
    {
        bottom = event.pageY;
        top = mousedown_pos.y;
    }
    else
    {
        top = event.pageY;
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


/**
 * ui_api used in defs
 */

let ui_api = {
    uiDefs, // access to the defs in the defs
    
    getDef,

    getSymbolFromElement: getTopLevel,
    getDefForElement, // helper function to get def for DOM element
    getContainerForElement, // look upwards in the elemement heirarchy to find the container

    svgFromViewAndData,
    htmlFromViewAndData,
    svgPreviewFromViewAndData,
    getDataTextView,
    removeSprites,

    drawsocketInput,
    sendToServer, // renderer-event
    fairlyUniqueString,
    makeUniqueID,
    getCurrentContext,
    getSelected,
    dataToHTML,
    getElementData,

    filterByKeys,

    makeDefaultInfoDisplay,
    translate,
    applyTransform,

    getSVGCoordsFromEvent,
    getBBoxAdjusted,


    svgObj,
    mainDiv,
    scrollOffset,

    
    insertSorted, 
    insertSortedHTML,
    insertIndex,

    ntom,
    mton,
    ftom, 
    mtof,
    ratio2float,
    reduceRatio,
    getRatioPrimeCoefs,
    parseRatioStr,

    hasParam,
    createHandle,

    startDefaultEventHandlers,
    stopDefaultEventHandlers,

    filterDataset
}


/**
 * availale globally
 */
module.exports = { 
    drawsocketInput,
    sendToServer, // renderer-event
    fairlyUniqueString,

   // send: symbolist_send,

    setClass: symbolist_setClass, 
    setContext: symbolist_setContext,

    getCurrentContext,
    
   // elementToJSON,
    
    translate,
    applyTransform,
    makeRelative,
    startDefaultEventHandlers,
    stopDefaultEventHandlers,
  //  getContextConstraintsForPoint,

    callSymbolMethod,

    ui_api,

    setScrollOffset

 }
