
// make time/pixel scalar something that can be adjusted in the UI

/**
 * new version 
 */

'use strict';


const className = "fiveLineStave";

const palette = [ "fiveLineStaveEvent" ]; //, "otherRectangleStaveEvent"


const default_duration = 1;
const default_height = 100;

const left_margin = 20;
const top_margin = 20;

let x2time = 0.001;
let time2x = 1000;

/**
 * maybe eventually we will want to use this dataInstance signature 
 * to conform data when it arrives via udp
 */
let dataInstance = {
    // class name, refering to the definition below
    class: className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 1,
    height: 100 ,
    lineSpacing: 8
}


/** 
 * viewDisplay is just the view part, for containers, it's used for sprites, palette, but the viewContainer is what is used in the DOM
 */
const viewDisplay = function(id, x, y, width, height, lineSpacing, overwrite = true)
{
    let strokeWidth = 0.5;
    let centerY = y + (height / 2);
    return {
        new: (overwrite ? "g" : undefined),
        id: `${id}-display`,
        class: `${className} display`, // the display container, using the 'display' class as a selector
        children: [{
            new: (overwrite ? "rect" : undefined),
            id: `${id}-rect`,
            x,
            y,
            width,
            height,
            style: {
                fill: "none",
                stroke: 'rgba(0, 0, 0, 0.1)',
                'stroke-width' : strokeWidth
            }
        },{
            new: (overwrite ? "text" : undefined),
            id: `${id}-label`,
            x: x - left_margin,
            y: centerY,
            text: id,
            'text-anchor': 'end',
            style: {
                fill: 'white'
            }
        },
        {
            new: "g",
            id: `${id}-staffline-group`,
            children: [{
                new: (overwrite ? "line" : undefined),
                id: `${id}-staffline-1`,
                class : "staffline",
                x1: x,
                y1: centerY - lineSpacing * 2,
                x2: x + width,
                y2: centerY - lineSpacing * 2,
                style: {
                    stroke: "black",
                    'stroke-width' : strokeWidth
                }
            },
            {
                new: (overwrite ? "line" : undefined),
                id: `${id}-line-2`,
                class : "staffline",
                x1: x,
                y1: centerY - lineSpacing,
                x2: x + width,
                y2: centerY - lineSpacing,
                style: {
                    stroke: "black",
                    'stroke-width' : strokeWidth
                }
            },
            {
                new: (overwrite ? "line" : undefined),
                id: `${id}-line-3`,
                class : "staffline",
                x1: x,
                y1: centerY,
                x2: x + width,
                y2: centerY,
                style: {
                    stroke: "black",
                    'stroke-width' : strokeWidth
                }
            },
            {
                new: (overwrite ? "line" : undefined),
                id: `${id}-line-4`,
                class : "staffline",
                x1: x,
                y1: centerY + lineSpacing,
                x2: x + width,
                y2: centerY + lineSpacing,
                style: {
                    stroke: "black",
                    'stroke-width' : strokeWidth
                }
            },
            {
                new: (overwrite ? "line" : undefined),
                id: `${id}-line-5`,
                x1: x,
                y1: centerY + lineSpacing * 2,
                x2: x + width,
                y2: centerY + lineSpacing * 2,
                style: {
                    stroke: "black",
                    'stroke-width' : strokeWidth
                }
            }]
        }]
    }

}

const viewContainer = function(id, x, y, width, height, lineSpacing, overwrite = true) 
{

    return {
        new: (overwrite ? "g" : undefined), 
        id, // use same reference id as data object
        class: `${className} symbol container`, // the top level container, using the 'container' class for type selection if needed
        children: [
            viewDisplay(id, x, y, width, height, lineSpacing, overwrite),
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

       // console.log('mapToView', data);
        const containerDisplay = container.querySelector('.display');
        const contents = container.querySelector('.contents');

        const bbox = ui_api.getBBoxAdjusted(containerDisplay);

        const x = bbox.x + left_margin;

        //  maybe later use x_offset for setting position?
        //const x_ref = parseFloat(container.dataset.x_ref);

        const num_siblings = contents.children.length;

        let y_offset = 0;
        if( num_siblings > 0 )
        {
            y_offset = top_margin + ui_api.getBBoxAdjusted(contents.children[ num_siblings - 1 ]).bottom - bbox.y;
        }

        const y = bbox.y + y_offset; 

        const width = parseFloat(container.dataset.duration) * time2x;
        const height = parseFloat(data.height);
        const lineSpacing = parseFloat(data.lineSpacing);

        return viewContainer(id, x, y, width, height, lineSpacing, overwrite)
            
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
     * @param {Object} dataObj data object to use to create new or update element
     * @param {Element} container HTML/SVG element context for this element
     * 
     * called when creating new element, or updating values 
     * 
     * 
     */
    function fromData(dataObj, container)
    {
        const contentElement = container.querySelector('.contents');


        // filtering the dataObj since the id and parent aren't stored in the dataset
        // note in this case the dataObject needs to include all of the dataset items!
        let dataset = {
            time: container.dataset.time,
            duration: container.dataset.duration,
            height: dataObj.height,
            lineSpacing: dataObj.lineSpacing
        }


        let isNew = true;
        
        let currentElement =  document.getElementById(dataObj.id) ;
       // console.log(currentElement);

        if(currentElement) {
            isNew = false;
        }

        let newView = mapToView(dataset, container, dataObj.id, isNew );

        //console.log('fromData', newView, dataset);


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
                class: [className, "container"],
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

