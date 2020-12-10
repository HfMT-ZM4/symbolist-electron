'use strict';


const className = "systemContainer";

const palette = []; //, "otherRectangleStaveEvent"

const default_duration = 1;
const default_height = 200;

const margin = 20;

let x2time = 0.001;
let time2x = 1000;

/**
 * maybe eventually we will want to use this dataInstance signature 
 * to conform data when it arrives via udp
 */
let dataInstace = {
    // class name, refering to the definition below
    class: className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 1,
    x: 100,
    y: 100,
    height: default_height,

    x_offset: margin * 2
}


/** 
 * viewContainer
 * 
 * used internally only, as a template for creating view diplay of this symbol type
 * 
 * (and since it's only used internally the function arguments can be changed as need)
 * 
 */
const viewDisplay = function(id, x, y, width, height, overwrite = true) 
{
    const half_margin = margin / 2.;
    return {
        new: (overwrite ? "g" : undefined),
        id,
        class: `${className} display`, // the display container, using the 'display' class as a selector
        children: [{
            new: (overwrite ? "rect" : undefined),
            id: `${id}-rect`,
            x,
            y,
            height,
            width,
            style: {
                fill: "white"
            }
        },
        {
            new: (overwrite ? "path" : undefined),
            id: `${id}-bracket`,
            d: `M ${x+margin} ${y+half_margin} h -${half_margin} v ${height - margin} h ${half_margin}`
        }]
    }

}


/*
*/
const viewContainer = function(id, x, y, width, height, overwrite = true) 
{
    /**
     * container objects us a group to contain their child objects, separate from their display
     * if overwriting, the whole container will be rewritten, which will also remove all the events
     * 
     * on update from data, the view might change, and the dataset, but not the conents
     * therefore it's more useful to have the id for the viewDisplay system rather than the display <g>
     * 
     */
    return {
        new: (overwrite ? "g" : undefined), 
        id, // use same reference id as data object
        class: `${className} symbol container`, // the top level container, using the 'container' class for type selection if needed
        children: [
            viewDisplay(`${id}-display`, x, y, width, height, overwrite),
            {
                new: (overwrite ? "g" : undefined),
                id: `${id}-contents`,
                class: `${className} contents` // the contents container, using the 'contents' class as a selector
                // removed empty children array since if we are updating the object, we don't want to overwrite the children
            }
        ]  
    }
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
    // not used for this top level, since it's auto created

    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
     * @param {Object} dataObj data object sent from controller to display in UI
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    function getInfoDisplay(viewElement) {}
    // not used for this top level, since it's auto created


    function mapToView(data, container, id, overwrite = true)
    {
        const containerDisplay = container.querySelector('.display');
        const bbox = ui_api.getBBoxAdjusted(containerDisplay);

        const x = bbox.x + parseFloat(data.x);
        const y = bbox.y + parseFloat(data.y);

        data.x_offset = x;

        const width = (2 * margin) + parseFloat(data.duration) * time2x;
        const height = margin + (typeof data.height != 'undefined' ? parseFloat(data.height) : default_height);

        return viewContainer(id, x, y, width, height, overwrite)       
    }

    /**
     * 
     * @param {Object} dataObj object to find container instance for
     * 
     * used for finding instance across instances (e.g. system breaks)
     * 
     */
    function getContainerForData(dataObj) {
        return document.getElementById(dataObj.container);
    }
    // currenlty not used but maybe could be used when spitting systems


    /**
     * called in cases when not all info is avaiable?
     * maybe not necessary
     * 
     */
    function newDefault() {}

    /**
     * 
     * @param {Object} dataObj data object to use to create new or update element
     * @param {Element} container HTML/SVG element context for this element
     * 
     * called when creating new element, or updating values 
     * 
     */
    function fromData(dataObj, container)
    {
        if( !container )
        {
            container = document.getElementById('top-svg-container');
        }

        const contentElement = container.querySelector('.contents');

        // filtering the dataObj since the id and parent aren't stored in the dataset
        let dataset = {
            time: dataObj.time,
            duration: dataObj.duration,
            height: dataObj.height,
            x: dataObj.x,
            y: dataObj.y,
            x_offset: 0 //<< updated in mapToView

        }

        let isNew = true;
        
        let currentElement =  document.getElementById(dataObj.id);

        if(currentElement) {
            isNew = false;
        }

        let newView = mapToView(dataset, container, dataObj.id, isNew );

        ui_api.drawsocketInput({
            key: "svg",
            val: {
                parent: contentElement.id,
                class: `${className} symbol`,
                ...newView,
                ...ui_api.dataToHTML(dataset)
            }
        });

    }


    /**
     * 
     * @param {Element} obj selected element
     */
    function paletteSelected (enable = false){}

    /**
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    function updateFromDataset(element){}


    function updateAfterContents( element )
    {
        const contents = element.querySelector('.contents');
        const contents_bbox = ui_api.getBBoxAdjusted(contents);

        let dataObj = {
            duration: element.dataset.duration,
            x: element.dataset.x,
            y: parseFloat(element.dataset.y) - 20,
            height: contents_bbox.height + 40,
            x_offset: element.dataset.x_offset

        }

        let newView = mapToView( dataObj, element.parentNode.closest('.container'), element.id, false );
        //console.log( element, dataObj, newView, );

        ui_api.drawsocketInput({
            key: "svg",
            val: {
                ...newView,
                ...ui_api.dataToHTML(dataObj)
            }
        });

    }
    // exported functions used by the symbolist renderer
    return {
        class: className,
        newDefault,

        palette,
        getPaletteIcon,
        getInfoDisplay,

        paletteSelected,
        
        updateFromDataset, // called from info panel edit boxes
        fromData,

        updateAfterContents,

        getContainerForData
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
      * @param {Object} lookup_params values to use for the lookup, user definable
      * @param {Object} obj_ref data object that has been looked up
      * 
      * script here is called when looking up symbols, and potentially could respond with
      * generative values in realtime
      * 
      */
    function lookup( params, obj_ref )
    {
        let ret = [];

        if(typeof obj_ref.contents != "undefined" )
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
        //console.`${className} ret ${ret}`);
        let ret_obj = {};
        ret_obj[obj_ref.id] = ret;
        
        return ret_obj;
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
