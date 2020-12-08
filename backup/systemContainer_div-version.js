'use strict';


const className = "systemContainer";

const palette = []; //, "otherRectangleStaveEvent"

const default_duration = 1;
const default_height = 200;

let x2time = 0.001;
let time2x = 1000;

/**
 * maybe eventually we will want to use this dataInstance signature 
 * to conform data when it arrives via udp
 */
let dataInstace = {
    // class name, refering to the definition below
    className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 1,
    x: 100,
    y: 100
}


/** 
 * viewDisplay
 * 
 * used internally only, as a template for creating view diplay of this symbol type
 * 
 * (and since it's only used internally the function arguments can be changed as need)
 * 
 */
const viewDisplay = function(id, x, y, width, height, overwrite = true)
{
    return {
        new: (overwrite ? "g" : undefined),
        id,
        class: `${className} display`, // the display container, using the 'display' class as a selector
        children: [{
            new: (overwrite ? "rect" : undefined),
            id: `${id}-background`,
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
            d: `M ${x+20} ${y+10} h -10 v ${height - 20} h 10`
        }]
    }

}

/*
*/
const viewContainer = function(id, x, y, width, height, overwrite = true) 
{
    // using div wrappers around separate SVG objects for the top level system,
    // which might allow easier use of flex box
    return {
        new: (overwrite ? "div" : undefined), 
        id, 
        class: `${className} symbol container`, // the top level container, using the 'container' class for type selection if needed
        style: {
            left: `${x}px`,
            top: `${y}px`
        },
        children: {
            new: (overwrite ? "svg" : undefined),
            children: [
                viewDisplay(`${id}-display`, 0, 0, width, height, overwrite),
                {
                    new: (overwrite ? "g" : undefined),
                    id: `${id}-contents`,
                    class: `${className} contents` 
                }
            ]  
        }
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
    function getPaletteIcon()
    {
        return {
            key: "svg",
            val: viewDisplay(`${className}-pal-disp`, 0, 0, 25, 25)
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
    function getInfoDisplay(viewElement)
    {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement, ui_api.scrollOffset)
        )
    }


    function mapToView(data, container, id, overwrite = true)
    {

        const containerDisplay = container.querySelector('.display');
        const bbox = ui_api.getBBoxAdjusted(containerDisplay);

        const x = bbox.x + parseFloat(data.x);
        const y = bbox.y + parseFloat(data.y);

        const width = parseFloat(data.duration) * time2x;
        const height = default_height;

       // console.log('width', width, container);

        return viewContainer(id, x, y, width, height, overwrite)
        //viewDisplay(id, x, y, width, height, overwrite);
            
    }

    function getContainerForData(dataObj)
    {
        let containers = document.querySelectorAll(`.${className}.symbol`);
        let insertAtIndex = ui_api.insertIndex(
            dataObj, containers,
            (a,b) => {
                return (a.time < b.dataset.time) ? -1 : (a.time == b.dataset.time ? 0 : 1) ;
            });
        
        if( insertAtIndex < 0 ) 
            insertAtIndex = 0;

        return containers[insertAtIndex];
    }


    function newDefault()
    {
        let container = ui_api.getCurrentContext();
        return fromData( dataInstace, container );
    }


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
            container = document.getElementById('top-html-container');
        }

        const contentElement = container.querySelector('.contents');

        // filtering the dataObj since the id and parent aren't stored in the dataset
        let dataset = {
            time: dataObj.time,
            duration: dataObj.duration,
            x: dataObj.x,
            y: dataObj.y
        }

        let isNew = true;
        
        let currentElement =  document.getElementById(dataObj.id) ;
       // console.log(currentElement);

        if(currentElement) {
            isNew = false;
        }

        let newView = mapToView(dataset, container, dataObj.id, isNew );

      //  console.log(newView);


        ui_api.drawsocketInput({
            key: "html",
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

    // exported functions used by the symbolist renderer
    return {
        className,
        newDefault,

        palette,
        getPaletteIcon,
        getInfoDisplay,
       // newFromClick, << I guess should/could be defined in mouse handler
        paletteSelected,
        
        updateFromDataset, // called from info panel edit boxes
        fromData,


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
    function lookup( lookup_params, obj_ref )
    {
        return null; // we aren't using the lookup for staves, so we can return null here,
        // or alternatively dont' define a lookup
    }

    return {
        className,
        comparator,
        lookup
    }
}

module.exports = {
    ui_def,
    io_def
}
