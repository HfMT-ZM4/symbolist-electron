'use strict';


const className = "systemContainer";

const palette = []; //, "newPartStave"

const default_duration = 1;
const default_height = 200;

const margin = 20;
const half_margin = margin / 2.;

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
    
    time: 0,        // -> start x
    duration: 1,    // -> width

    x: 100,
    y: 100,
    height: default_height,

    x_offset: margin * 2
}


/**
 * mapping params used by children
 */
let mappingParams = {
    time: 0,
    duration: 1,
    height: 100
}


const display = function(params) 
{
    return [{
        new:    "rect",
        id:     `${params.id}-rect`,
        class:  'systemContainer-rect',
        x:      params.x,
        y:      params.y,
        height: params.height,
        width:  params.width
    },
    {
        new: "path",
        id: `${params.id}-bracket`,
        class: 'systemContainer-bracket',
        d: `M ${params.x+margin} ${params.y+half_margin} h -${half_margin} v ${params.height - margin} h ${half_margin}`
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
    // not used for this top level, since it's auto created

       /**
     * 
     * @param {Element} obj selected element
     */
    function paletteSelected (enable = false){}

    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
     * @param {Object} dataObj data object sent from controller to display in UI
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    function getInfoDisplay(viewElement) {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement, ui_api.scrollOffset)
        )

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
    // currently just looking up by ID but this could be used to deal with line breaks


    function dataToViewParams(data, container)
    {
        /**
         * note: this container is a "top level" container, and so for the moment we are not querying
         * the parent for info, because there is not a default class for the top svg yet,
         * eventually that is probably the way to do it rather than calculating the bbox here
         */
        const containerDisplay = container.querySelector('.display');
        const bbox = ui_api.getBBoxAdjusted(containerDisplay);

        return {
            id: data.id,
            x: bbox.x + parseFloat(data.x),
            y: bbox.y + parseFloat(data.y),
            width: (2 * margin) + parseFloat(data.duration) * time2x,
            height: margin + (typeof data.height != 'undefined' ? parseFloat(data.height) : default_height)
        }
     
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    function childViewParamsToData(this_element, child_data)
    {
        if( ui_api.hasParam(child_data, Object.keys(mappingParams)) )
        {

            ;
        }
    }

  /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    function childDataToViewParams(this_element, child_data)
    {
        if( ui_api.hasParam(child_data, Object.keys(mappingParams)) )
        {

            const container = ui_api.getContainerForElement(this_element);
            const this_data = ui_api.getElementData(this_element);

            const viewParams = dataToViewParams(this_data, container);

            const contents = this_element.querySelector('.contents');
            const n_childStaves = contents.children.length;

            let y_offset = 0;
            if( n_childStaves > 0 )
            {
                y_offset = margin + ui_api.getBBoxAdjusted(contents.children[n_childStaves - 1]).bottom - viewParams.y;
            }

            return {
                y: viewParams.y + y_offset,
                x: viewParams.x + margin,
                width: viewParams.width,
                height: child_data.height
            }
        }
    }

    /**
     * 
     * @param {Element} element 
     * 
     * called after child object has been added in order to adjust 
     * drawing of the container element
     * 
     */
    function updateAfterContents( element )
    {
        const contents = element.querySelector('.contents');
        const contents_bbox = ui_api.getBBoxAdjusted(contents);

        let dataObj = {
            id: element.id, // I don't love this, but the dataObj needs the id
            duration: element.dataset.duration,
            x: element.dataset.x,
            y: parseFloat(element.dataset.y) - 20,
            height: contents_bbox.height + 40,
            x_offset: element.dataset.x_offset

        }

        const container = ui_api.getContainerForElement(element);

        fromData(dataObj, container);

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

        let viewParams = dataToViewParams(dataObj, container);

        // probably don't need this, but currently there is no top svg class, so maybe we need it for now
        dataObj.x_offset = viewParams.x;

        ui_api.drawsocketInput( 
            ui_api.svgFromViewAndData( 
                display(viewParams), 
                dataObj 
            )
        );

    }

    /**
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    function updateFromDataset(element){}



    // exported functions used by the symbolist renderer
    return {
        class: className,

        palette,
        getPaletteIcon,
        getInfoDisplay,

        paletteSelected,
        
        updateFromDataset, // called from info panel edit boxes
        fromData,

        updateAfterContents,

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
