
// make time/pixel scalar something that can be adjusted in the UI

'use strict';


//const sym_utils = root_require('utils')

const className = "rectangleStaveAzimuth";

const palette = [ ] //"rectangleStaveAzim", "otherRectangleStaveEvent"

const default_r = 2; // notehead radius
const default_dist = 5; // length of azim line

const default_duration = 0.1;


/**
 * 
 * Data object defaults, used when creating from mouse events
 * 
 */
let dataInstance = {

    class: className,
    id : `${className}-0`,
    
    time: 0,
    pitch: 60,
    azim: 0,

    //not used  
    duration: default_duration,
    amp: 1
}

/**
 * data used to draw expected by display function
 */
let viewParamsInstance = {
//    id: `${className}-0`, // not sure whether to include the id here or not
    x: 0,
    y: 0,
    azim: 0, // converted 
    r: default_r, // notehead size
    width: "not used, but for duration"
}


const display = function(params)
{
    return [{
        id: `${params.id}-notehead`,
        new: "circle",
        cx: params.x,
        cy: params.y,
        r: (params.r ? params.r : default_r)
    },
    {
        new: "line" ,
        id: `${params.id}-azim`,
        x1: params.x,
        y1: params.y,
        x2: params.x + Math.sin(params.azim) * default_dist,
        y2: params.y + Math.cos(params.azim) * default_dist,
        style: {
            stroke: 'black',
            'stroke-width': 1
        }
    }]
}


/**
 * 
 * @param {Object} ui_api api object passed in to def on initialization from ui controller
 * 
 * ui def defines sorting and interaction scripts that run in the editor browser
 * 
 * returns methods which can be called by the ui controller
 * 
 */
const ui_def = function(ui_api) 
{

    // UI mode, "creation" or "edit", passed from renderer
    let m_mode = null;

    /**
     * called when drawing this symbol to draw into the palette 
     * 
     * @returns drawsocket format object which will sit inside an HTML div
     */
    function getPaletteIcon()
    {
        return {
            key: "svg",
            val: display({
                id: `${className}-pal-disp`,
                x: 25,
                y: 25,
                azim: 0.15
            })
        }
    }

    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    function getInfoDisplay( viewElement )
    {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement, ui_api.scrollOffset)
        )
        
    }
    
    /**
     * API function called from controller to draw new data objects
     * also used internally
     * 
     * @param {Object} dataObj 
     * @param {Element} container 
     * @param {Boolean} preview -- optional flag to draw as sprite overlay and draw data text
     * 
     */
    function fromData(dataObj, container, preview = false)
    {
        const viewParams = dataToViewParams(dataObj, container);
        const viewObj = display(viewParams);
        const drawObj = preview ? 
                            ui_api.getPreviewDataSVG( viewObj, dataObj ) :
                            ui_api.getViewDataSVG( viewObj, dataObj );
        
        ui_api.drawsocketInput( drawObj );
    }


    /**
     * internal mapping function data->viewParams
     * 
     * @param {Object} data 
     * @param {Element} container 
     * 
     * returns object of view params
     * 
     */
    function dataToViewParams(data, container)
    {

        const parentDef = ui_api.getDefForElement(container);

        return {
            ...parentDef.childDataToViewParams(container, data),
            // other view params that the parent doesn't deal with
            id: data.id,
            azim: data.azim, 
        }
     
    }


    /**
     * internal mapping function viewParams->data
     * 
     * @param {Object} viewParams 
     * @param {Element} container 
     * 
     * returns data object
     * 
     */
    function viewParamsToData(viewParams, container)
    {
        const parentDef = ui_api.getDefForElement(container);

        return {
            ...parentDef.childViewParamsToData(container, viewParams),
            // other view params that the parent doesn't deal with
            id: viewParams.id,
            class: `${className}`,
            container: container.id,
            azim: viewParams.azim
        }
    }


    /**
     * 
     * gets viewParams from element
     * 
     * @param {Element} element 
     * 
     */
    function getElementViewParams(element)
    {

        const circle = element.querySelector('circle');
        const line = element.querySelector('line');

        const x = parseFloat(circle.getAttribute('cx'));
        const y = parseFloat(circle.getAttribute('cy'));
        const x2 = parseFloat(line.getAttribute('x2'));
        const y2 = parseFloat(line.getAttribute('y2'));

        const azim = Math.atan2(x2-x, y2-y);
        

        return {
            id: element.id,
            x,
            y,
            azim
        }

    }


    function mouseToData( event, container )
    {
        const pt = ui_api.getSVGCoordsFromEvent(event);
        const parent_def = ui_api.getDefForElement(container);

        return {
            ...dataInstance, // set class, default azim, duration
            ...parent_def.childViewParamsToData(container, pt), //pitch and time from container
            id: `${className}_u_${ui_api.fairlyUniqueString()}`,
            container: container.id
        }    
    }

    /**
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Object} event mouse event from click
     * 
     * returns new view object in drawsocket format, to be drawn
     */
    function creatNewFromMouseEvent(event)
    {

        // remove preview sprite
        ui_api.drawsocketInput({
            key: "remove", 
            val: `${className}-sprite`
        })

        // generate objectData from Mouse Event
        const container = ui_api.getCurrentContext();
        let data = mouseToData(event, container);
        
        fromData(data, container);

        // send new object to server
        ui_api.sendToServer({
            key: "data",
            val: data
        })

    }


    function move(event)
    {
        if( event.metaKey && m_mode == "palette" )
        {
            // preview of mouse down creation
            const container = ui_api.getCurrentContext();
            let data = mouseToData(event, container);

            fromData( data, container, true); // sets preview flag to true
        }

    }



    /**
     * 
     * 
     * @param {Element} element html/svg element to translate
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    function drag(element, delta_pos = {x:0,y:0}) 
    {
        // delta_pos needes to be adjusted for scale also
       
       // console.log('drag mode', m_mode);
        if( m_mode == "edit" )
        {
            //rotate(element, delta_pos);
        }
        else
        {
            // maybe rename... sets translation in transform matrix, but doesn't apply it
            ui_api.translate(element, delta_pos);

            let viewParams = getElementViewParams(element);
            viewParams.x += delta_pos.x;
            viewParams.y += delta_pos.y;

            let container = ui_api.getContainerForElement(element);
            let data = viewParamsToData(viewParams, container);
            ui_api.drawsocketInput(
                ui_api.getDataTextView(data)
            )

        }
       
        return true; // return true if you are handling your own translation
    }




   /**
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    function updateFromDataset(element)
    {

        const container = ui_api.getContainerForElement(element);        
        let data = ui_api.getElementData(element, container);
        
        fromData(data, container);

        // update data 
        ui_api.sendToServer({
            key: "data",
            val: data
        })

    }

    function applyTransformToData(element)
    {
        ui_api.applyTransform(element);

        let viewParams = getElementViewParams(element);
        let container = ui_api.getContainerForElement(element);
        let data = viewParamsToData(viewParams, container);

        ui_api.drawsocketInput({
            key: "svg",
            val: ui_api.dataToHTML(data)
        })

        // send out
        ui_api.sendToServer({
            key: "data",
            val: data
        })

        return true;

    }

    
    function selected(element, state)
    {
        console.log('select state', state);

    }

    

    function down(e) 
    {
        if( e.metaKey )
        {
            creatNewFromMouseEvent(e);
        }
    }

    function up(e){
       
    }

    function keyDown(e){}
    
    function keyUp(e)
    {
        if( e.key == "Meta" )
        {
            ui_api.removeSprites();
        }
    }

    /**
     * 
     * @param {Boolean} enable called when entering  "palette" or  "edit"  mode
     * 
     * creation mode starts when the symbol is sected in the palette
     * edit mode is when the symbols is when one symbol is selected (or when you hit [e]?)
     */
    function paletteSelected( enable = false ) {

        console.log(`enter ${className} ${m_mode}`);

        if( enable ){
            m_mode = 'palette';

            window.addEventListener("mousedown", down);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            window.addEventListener("keydown", keyDown);
            window.addEventListener("keyup", keyUp);
        }
        else
        {
            console.log(`exit ${className} ${m_mode}`);

            ui_api.removeSprites();

            window.removeEventListener("mousedown", down);
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);

            m_mode = null;
        }
    }

    // -- below is not yet updated


    function rotate(element, event)
    {

        let line = element.querySelector('line');

        let x1 = parseFloat(line.getAttribute('x1'));
        let y1 = parseFloat(line.getAttribute('y1'));
        
        let x2 = parseFloat(line.getAttribute('x2'));
        let y2 = parseFloat(line.getAttribute('y2'));

        let mousePt = ui_api.getSVGCoordsFromEvent(event);

        let azim = Math.atan2( mousePt.x - x1, mousePt.y - y1);

        let newX = x1 + Math.sin(azim) * default_dist;
        let newY = y1 + Math.cos(azim) * default_dist;

        line.setAttribute('x2', newX);
        line.setAttribute('y2', newY);

        element.dataset.azim = azim;

        ui_api.drawsocketInput({
            key: "svg", 
            val: {
                id: `${element.id}-rotation-handle`,
                x: newX - 4,
                y: newY - 4
            }
        })

        updateFromDataset(element);
        
    }


    let cb = {};

    // now passing element so that edit mode can be signaled from script
    // but then how does the controlller know that it's in edit mode?
    // maybe the controller should do less but provide key event handling and pass to scripts
    function editMode( element, enable = false )
    {
        //let element = ui_api.getSelected()[0]; // first object only for now...

        if( enable )
        {
            m_mode = 'edit';
/*
            ui_api.drawsocketInput(
                ui_api.makeDefaultInfoDisplay(element, ui_api.scrollOffset)
            )
*/
            const line = element.querySelector('line')
            const x2 = parseFloat(line.getAttribute('x2'));
            const y2 = parseFloat(line.getAttribute('y2'));
    
            ui_api.drawsocketInput({
                key: "svg", 
                val: {
                    id: `${element.id}-rotation-handle`,
                    new: "rect",
                    class: "handle",
                    parent: element.id, 
                    x: x2 - 4,
                    y: y2 - 4,
                    width: 8,
                    height: 8,
                    onmousedown: (event) => { 
                        console.log('ello', element);
                        console.log('register');

                        document.addEventListener('mousemove', 
                            cb[`${element.id}-moveHandler`] = function (event) {
                                console.log(`${element.id}-moveHandler`);
                                if( event.buttons == 1 ) {
                                    rotate(element, event);
                                }
                            }
                        );
                    }                        
                }
            })



        }
        else
        {
            m_mode = '';

            console.log('deregister');

            ui_api.drawsocketInput({
                key: "remove", 
                val: `${element.id}-rotation-handle`,
            }) 


            document.removeEventListener('mousemove', cb[`${element.id}-moveHandler`]);
            delete cb[`${element.id}-moveHandler`];
            console.log(`removing ${element.id}-moveHandler, ${cb[`${element.id}-moveHandler`]}`);

        }
        
        return true;
    }


    // exported functions used by the symbolist renderer
    return {
        class: className,
        dataInstance,

        palette,

        fromData,

        getPaletteIcon,
        
        getInfoDisplay,

        updateFromDataset,
        
        //newFromClick,  // << another optional callback in case you don't want to deal with mouse events
        
       // enter edit mode

        paletteSelected, // arg true/false to enter exit

        editMode, // 1/0 to enter/exit

        
    //    enter,
    //    exit,

        selected,
        
        drag,
        applyTransformToData
    }

}



/**
 * 
 * @param {Object} io_api api object passed in to def on initialization from io controller
 * 
 * io def defines sorting and lookup scripts to be run on the server-side
 */
const io_def = (io_api) => {

    /**
     * 
     * @param {Object} a 
     * @param {Object} b 
     * 
     * comparator for sorting instances of this class type (rectangleStaveAzimuth)
     */
    function comparator (a, b) {
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1))
    }

    /**
      * 
      * @param {Object} dataObj data object that has been looked up
      * 
      * script here is called when looking up symbols, and potentially could respond with
      * generative values in realtime
      * 
      * return null if lookup params don't match the obj_ref
      * 
      */
    function lookup( params, obj_ref )
    {
        const start = obj_ref.time;
        const end = start + obj_ref.duration;
     //   console.log( start, end, params.time);
        if( start <= params.time && end >= params.time )
        {
            return {
                ...obj_ref,
                phase: (params.time - start) / obj_ref.duration
            }
        }

        return null;
    }
 

    return {
        class: className,
        comparator,
        lookup
    }
}

module.exports = {
    ui_def,
    io_def
}
