
// make time/pixel scalar something that can be adjusted in the UI

'use strict';

const className = "partStave";

const palette = [ "rectangleStaveEvent", "rectangleStaveAzimuth" ]; //, "otherRectangleStaveEvent"


const default_duration = 1;
const default_height = 100;

const left_margin = 20;
const top_margin = 20;

let x2time = 0.001;
let time2x = 1000;

let y2pitch = 127.; // y is normalized 0-1
let pitch2y = 1 / 127.;


let dataInstance = {
    // class name, refering to the definition below
    class: className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 1,
    height: 100 
}


/**
 * data used to draw expected by display function
 */
let viewParamsInstance = {
    id: `${className}-0`,
    x: 0,
    y: 0,
    height: 100, 
    width: 100
}

/**
 * data params mapped for child objects
 */
let mappingParams = {
    time: 0,        // -> x
    pitch: 60,       // -> y
    duration: 1
}


/** 
 * viewDisplay is just the view part, for containers, it's used for sprites, palette, but the viewContainer is what is used in the DOM
 */
const display = function(params)
{

    return [{
        new:    "rect",
        class: 'partStave-rect',
        id:     `${params.id}-rect`,
        x:      params.x,
        y:      params.y,
        width:  params.width,
        height: params.height
    },
    {
        new:    "text",
        class:  'staveLabel',
        id:     `${params.id}-label`,
        x:      params.x - left_margin,
        y:      params.y + (params.height / 2),
        text:   params.id
    }];
}


/**
 * 
 * @param {Object} ui_api api object passed in to def on initialization from ui controller
 * 
 * ui def defines sorting and interaction scripts that run in the editor browser
 */
const ui_def = function( ui_api ) 
{

    /**
     * called when drawing this symbol to draw into the palette 
     * 
     * @returns drawsocket format object which will sit inside an HTML div
     */
    function getPaletteIcon(){}


    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
     * @param {Object} dataObj data object sent from controller to display in UI
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    function getInfoDisplay(viewElement)
    {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement, ui_api.scrollOffset)
        )
    }

    // rename: dataToDrawingParams? or dataToDisplayParams
    function dataToViewParams(data, container)
    {

        const parentDef = ui_api.getDefForElement(container);

        return {
            ...parentDef.childDataToViewParams(container, data),
            // other view params that the parent doesn't deal with:
            id: data.id
        }
     
    }

 /**
     * 
     * @param {Object} dataObj data object to use to create new or update element
     * @param {Element} container HTML/SVG element context for this element
     * 
     * called when creating new element, or updating values 
     * 
     * 
     */
    function fromData(dataObj, container)
    {

        let viewParams = dataToViewParams(dataObj, container);
        
        ui_api.drawsocketInput( 
            ui_api.getViewDataSVG( display(viewParams), dataObj )
        );

    }

    function getContainerForData(dataObj)
    {

        return document.getElementById(dataObj.container);

        /*
        let containers = document.querySelectorAll(`.${className}.symbol`);
        let insertAtIndex = ui_api.insertIndex(
            dataObj, containers,
            (a,b) => {
                return (a.time < b.dataset.time) ? -1 : (a.time == b.dataset.time ? 0 : 1) ;
            });
        
        if( insertAtIndex < 0 ) 
            insertAtIndex = 0;

        return containers[insertAtIndex];
        */
    }


   /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    function childDataToViewParams(this_element, child_data)
    {
        if( ui_api.hasParam(child_data, ['pitch', 'time']) )
        {

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));
            const bbox_y = parseFloat(containerRect.getAttribute('y'));
            const bbox_height = parseFloat(containerRect.getAttribute('height'));

            let ret = {
                y: bbox_y + ((1. - (child_data.pitch * pitch2y)) * bbox_height),
                x: bbox_x + ((child_data.time - parseFloat(this_element.dataset.time)) * time2x)
            }

            if( ui_api.hasParam(child_data, "duration" ) )
            {
                ret.width = child_data.duration * time2x;
            }

            return ret;

        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     */
    function childViewParamsToData(this_element, child_viewParams)
    {
        if( ui_api.hasParam(child_viewParams, ['x', 'y']) ) 
        {

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));
            const bbox_y = parseFloat(containerRect.getAttribute('y'));
            const bbox_height = parseFloat(containerRect.getAttribute('height'));

            let ret = {
                pitch: (1 - ((child_viewParams.y-bbox_y) / bbox_height)) * y2pitch,
                time: ((child_viewParams.x-bbox_x) * x2time) + parseFloat(this_element.dataset.time)            
            }

            if( ui_api.hasParam(child_viewParams, "width" ) )
            {
                ret.duration = child_viewParams.width * x2time;
            }

            return ret;
        }
    }

    function move(e) {}

    function down(e) {}

    function up(e){}

    function keyDown(e){}
    
    function keyUp(e){}


    /**
     * 
     * @param {Element} obj selected element
     */
    function paletteSelected (enable = false) {}


   /**
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    function updateFromDataset(element)
    {

        // not updated yet

        console.log('partStave updateFromDataset');
        // and currently not called I think


        /*
        // assuming that we have all the data
        let data = element.dataset;

        // this is a container, so to get the enclosing container, we need to go to the parent first
        const container = element.parentNode.closest('.container');

        const id = element.id;
        const parent = element.parentNode.id;

        let newView = mapToView(data, container, id, false);
        
         // send out before sending to drawsocket, because we overwrite the element
         ui_api.sendToServer({
            key: "data",
            val: {
                id,
                container: [ ...container.classList],
                class: className,
                ...data
            }
        })

        ui_api.drawsocketInput({
            key: "svg",
            val: {
//                id, // id is in the view now
                parent,
                class: element.classList,
                ...newView,
                ...ui_api.dataToHTML(data)
            }
        });

        */

    }


    // exported functions used by the symbolist renderer
    return {
        class: className,
        dataInstance,
        palette,

        getPaletteIcon,
        getInfoDisplay,

        paletteSelected,
        
        updateFromDataset,
        fromData,

        getContainerForData,

        childDataToViewParams,
        childViewParamsToData
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
     * comparator for sorting instances of this class type (rectangleStave)
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
      */
    function lookup( params, obj_ref )
    {
        let ret = [];

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                const event = def.lookup(params, obj);
                if( event )
                {
                    ret.push(event);
                }
            });
        
        }
        else
        {
            ret = {
                lookup_error: `no element with id "${params.id}" found`
            };
        }

      //  console.log(`${className} ret ${JSON.stringify(ret)}`);
        let ret_obj = {};
        ret_obj[obj_ref.id] = ret;
        
        return ret_obj;
    }

/**
     * 
     * @param {Object} params values to use for the lookup, user definable
     * 
     * in the current example, the only params we use are time, but there could
     * be others in future, for example, by angle, or ???
     * 
     * could use the same comparator as above
     * if comparator(params, prev_obj) == -1 && comparator(params, obj) >= 0 
     *      => note_on
     * 
     */


    function test(params)
    {
        return {
            yo: params
        }
    }


    return {
        class: className,
        comparator,
        lookup,
        test
    }
}

module.exports = {
    ui_def,
    io_def
}

