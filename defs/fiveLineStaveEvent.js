
// make time/pixel scalar something that can be adjusted in the UI

'use strict';


//const sym_utils = root_require('utils')

const className = "fiveLineStaveEvent";

const palette = [ ] //"rectangleStaveAzim", "otherRectangleStaveEvent"

const x2time = 0.001;
const time2x = 1000;

//const y2pitch = 127.; // y is normalized 0-1
//const pitch2y = 1 / 127.;

const default_r = 2;
const default_dist = 5;

const default_duration = 0.1;


const accidentalLookup = {
    flat : "&#xE260",
    natural: "&#xE261",
    sharp: "&#xE262",

// lowered 3rds for numerator (overtone) 

    'flat-5^1o': "&#xE2C2",
    'natural-5^1o': "&#xE2C1",
    'sharp-5^1o': "&#xE2C3",

    'flat-5^2o': "&#xE2CB",
    'natural-5^2o': "&#xE2CC",
    'sharp-5^2o': "&#xE2CD",

    'flat-5^3o': "&#xE2CB",
    'natural-5^3o': "&#xE2CC",
    'sharp-5^3o': "&#xE2CD",

// raised 3rds for denominator (undertone) (4/5, 16/25, 64/125)
    'flat-5^1u': "&#xE2C6",
    'natural-5^1u': "&#xE2C7",
    'sharp-5^1u': "&#xE2C8",

    'flat-5^2u': "&#xE2D0",
    'natural-5^2u': "&#xE2D1",
    'sharp-5^2u': "&#xE2D2",

    'flat-5^3u': "&#xE2DA",
    'natural-5^3u': "&#xE2DB",
    'sharp-5^3u': "&#xE2DC",

// 7ths

    '7^1o': "&#xE2DE",
    '7^2o': "&#xE2E0",

    '7^2u': "&#xE2DF",
    '7^2u': "&#xE2E1",

// 11ths

    '11^1u': "&#xE2E2",
    '11^1o': "&#xE2E3",

// 13th
    '13^1o': "&#xE2E4",
    '13^1u': "&#xE2E5"
}



let dataInstance = {
    // class name, refering to the definition below
    class: className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 0.1,
    note: 'c5',
    midi: 60,
    ratio: '5/4',
    hz_ref: 440, // later make this assignable to another note?
    accid: "natural",
    amp: 1
}

let viewParamsInstance = {
    y: 0,
    x: 0,
    r: 5,
    width: 100,
    ledgerLine_y: 0,
    accidental: false
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

    const display = function(params)
    {
        let obj = [{
                id: `${params.id}-notehead`,
                new: "circle",
                class: "notehead",
                cx: params.x,
                cy: params.y,
                r: params.r
            },
            {
                new: "line",
                id: `${params.id}-duration`,
                class: "duration-line",
                x1: params.x,
                y1: params.y,
                x2: params.x + params.width, 
                y2: params.y
            }];

        if( params.accidental )
        {
            let oldAcc = document.getElementById(`${params.id}-accidental`);

            obj.push({
                new: "text",
                id: `${params.id}-accidental`,
                text : accidentalLookup[params.accidental], //(accidental == "sharp" ? "&#xE262" : "&#xE260"),
                class: "accidental",
                x : params.x - 15,
                y : params.y
            })
        }
        else
        {
            let oldAcc = document.getElementById(`${params.id}-accidental`);
            if( oldAcc )
                oldAcc.remove();
        }

        let ledgerLine_g_exists = document.getElementById(`${params.id}-ledgerLines`);
        if( ledgerLine_g_exists )
        {
            ui_api.drawsocketInput({
                key: "clear",
                val: `${params.id}-ledgerLines`
            })
        }

        console.log('params.ledgerLine_y');
        if( params.ledgerLine_y.length > 0 )
        {
            let ledgerLine_g = {
                new: "g",
                id: `${params.id}-ledgerLines`,
                children: []  
            }

            params.ledgerLine_y.forEach( ledge_y => {
                ledgerLine_g.children.push({
                    new: "line",
                    class : "staffline",
                    x1: params.x - 15,
                    x2: params.x + 15,
                    y1: ledge_y,
                    y2: ledge_y
                })
            })

            obj.unshift( ledgerLine_g );
        }
       

        return obj;
    }

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
                r: 2,
                width: 35,
                ledgerLine_y: [],
                accidental: false
            })
        }
    }

    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
     * @param {Object} dataObj data object sent from controller to display in UI
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
        console.log(viewObj);
        const drawObj = preview ? 
                            ui_api.getPreviewDataSVG( viewObj, dataObj) :
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
        const viewParams = parentDef.childDataToViewParams(container, data);

        return {
            ...viewParams,
            // other view params that the parent doesn't deal with
            id: data.id
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
            container: container.id
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

        const notehead = element.querySelector('.notehead');
        const durationLine = element.querySelector('.duration-line');

        const x = parseFloat(notehead.getAttribute('cx'));
        const y = parseFloat(notehead.getAttribute('cy'));
        const x2 = parseFloat(durationLine.getAttribute('x2'));

        const width = x2 - x;

        return {
            id: element.id,
            x,
            y,
            width
            // ledgerlines
            // accidental ...
        }

    }


    function mouseToData( event, container )
    {
        let pt = ui_api.getSVGCoordsFromEvent(event);
        let parent_def = ui_api.getDefForElement(container);

        let viewParams = parent_def.childViewParamsToData(container, {
            ...viewParamsInstance, // defaults other than xy
            ...pt
        });
        
        return {
            ...dataInstance, // set class, duration, and any other defaults
            ...viewParams,
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
            
            const container = ui_api.getContainerForElement(element);
            const stepSpacing = parseFloat(container.dataset.lineSpacing) * 0.5;

            const snapPt = {
                x: delta_pos.x,
                y: Math.floor(delta_pos.y / stepSpacing) * stepSpacing
            }

            //console.log('container', container, delta_pos.y, parseFloat(container.dataset.lineSpacing) / 2., y2midi(delta_pos.y));
            ui_api.translate(element, snapPt);

            let viewParams = getElementViewParams(element);

            viewParams.x += snapPt.x;
            viewParams.y += snapPt.y;

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

    function getFormattedLookup( params, obj_ref )
    {
        return {
            time: obj_ref.time,
            duration: obj_ref.duration,
            midi: obj_ref.midi
        }
    }
 
 

    return {
        class: className,
        comparator,
        lookup,
        getFormattedLookup
    }
}

module.exports = {
    ui_def,
    io_def
}
