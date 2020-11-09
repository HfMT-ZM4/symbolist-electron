
'use strict';

const sym_utils = root_require('utils')

const className = "rectangleStave";

const palette = [ "rectangleStaveEvent", "otherRectangleStaveEvent"]


const dataInstace = {
    // class name, refering to the definition below
    className,

    // unique id for this instance
    id : "default-0",
    
    // container objects 
    events = [],
    
    // container objects 
    time: 0,
    duration: 1
}


/**
 * view container model (stave/page/etc)
 * 
 * svg:
 * <g class='className container'>
 *      <g class='className display'></g>
 *      <g class='className events'></g>
 * </g>
 * 
 * html:
 * <div class='className container'>
 *      <div class='className display'></div>
 *      <div class='className events'></div>
 * </div>
 * 
 * regular objects can be any node type
 * usually they will be in a container
 * 
 * <circle .... />
 * 
 * sent to browser using drawsocket format
 * 
 */


const viewDisplay = function(x, y, width, height)
{
    return {
        new: "rect",
        x,
        y,
        width,
        height
    }
}

const viewContainer = function(x, y, width, height, id) 
{
    return {
        key: "svg",
        val: {
            new: "g", // container objects us a group to contain their child objects, separate from their display
            id, // use same reference id as data object
            class: `${className} container`, // the top level container, using the 'container' class for type selection if needed
            parent: "",
            children: [
                {
                    new: "g",
                    class: `${className} display`, // the display container, using the 'display' class as a selector
                    children : viewDisplay(x,y,width,height)
                },
                {
                    new: "g",
                    class: `${className} contents`, // the events container, using the 'events' class as a selector
                    children: [] // empty for now
                }
            ]  
        }
    }
}


/**
 * 
 * @param {Object} symbolist_api reference to object containing method functions for accessing the model and view if needed
 * 
 * @returns {Object} containing controller functions to be used in mapping to/from data-view
 */
const controllerDefinition = function( symbolist_api ) {
    return {
        // do we really need the class name here?
        //className: 'staveExample',

        // used to sort child objects
        comparator: function (a,b) {
            return (a < b ? -1 : (a == b ? 0 : 1))
        },

        // class names of child objects
        palette,



        /**
         * received in controller from view
         * it's up to the user to make sure that the data passed into this function from the view 
         * in most cases you'll want the parent view, to calculate the element's offset from it's container
         * 
         * it's also possible that you could only deal with relative values in the controller
         * and then you'd need to convert to/from absolute coordinates in the view
         * for example you could subtract the top left corner from all coordinates,
         * or make the coordinates normalized (0-1) scaled by the container
         * 
         * that might make the most sense, since then the controller doesn't need to konw the parent position when doing the 
         * mapping to view, in this case the parentID is very important
         * 
         * in cases where there is a complex graphic element that must be used in the model to compare against the 
         * element, the graphic element information can also be stored in the model
         * 
         * for now we will just send the view object sent from the view into this function, and try some different 
         * use cases and see how / where things need to be adjusted
         * 
         * the fromView script runs in the controller, and may look up values in the model
         * via the API function ??? getDataForID(id)
         * 
         * 
         * 
         * */

        /**
         * 
         * @param {Object} view object sent from view, containing information needed to create the data
         * @param {*} isNew (optional) flag to indicate that this is a new object (maybe we can remove this...)
         */
        fromView: function(view, isNew = false){
            
            let data = isNew ? defaultDataObject : {};

            let parentData = symbolist_api.get( new.parent );
            // could also add await 
            return {
                data
            }
        },

        /**
         * 
         * @param {Object} data object sent from model to create the view
         */
        fromData: function(data){
            return {
                view: {
                    
                }
            }
        }

    }
}

/**
 * 
 * UI is called in the browser, and has access to the symbolist and drawsocket global modules
 * (could be nicer to have the same interface as the controller, and pass the api objects as an argument)
 * 
 * optionally could use require here like:
 * const ui = require('myCoolUI.js')
 * 
 * the uiDef defines the behaviour of mouse interaction, and maniuputing the view information
 * 
 */
const uiDef = (function(){


    /**
     * called when drawing this symbol to draw into the palette 
     * 
     * @returns drawsocket format object which will sit inside an HTML div
     */
    function getPaletteIcon()
    {
        return {
            key: "svg",
            val: {
                id: 'rectangleStave-palette-icon',
                ...viewDisplay(0, 0, 25, 25)
            }
        }
    }

    
    /**
     * palette -- list of sub symbols that can be used inside this container
     * these will be looked up and added to the palette when this container is selected
     */
    palette,


    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
     * @param {Object} dataObj data object sent from controller to display in UI
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    function getInfoDisplay(dataObj, viewElement)
    {
        return sym_utils.makeDefaultInfoDisplay(dataObj, viewElement.getBoundingClientRect() );
    }


    /**
     * 
     * @param {HTML/SVG Element} element element to convert coordinates to be relative to container
     * 
     * @returns {HTML/SVG Element} with coordinates relative to container (in most cases this will be a simple translation)
     */
    function toRelative(element)
    {
        let containerDisplay = element.closest('.container').querySelector('.display');

        let containerBBox = containerDisplay.getBoundingClientRect();

        let relativeEl = element.cloneNode(1);
        let matrix = relativeEl.getCTM();

        matrix.e = -containerBBox.x;
        matrix.f = -containerBBox.y;
    
        symbolist.applyTransform(relativeEl, matrix);

        return relativeEl;

    }

    /**
     * 
     * @param {Object} obj input from controller in drawsocket format, to be converted to absolute coordinates before drawing
     * 
     * @returns {Object} object in drawsocket format offset by parent display
     */
    function toAbsoulte(obj)
    {
        let parentID = obj.val.parent;

        let containerDisplay = document.querySelector(`#${parentID}`).querySelector('.display');
        let containerBBox = containerDisplay.getBoundingClientRect();

    
    }


    /**
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Object} event mouse event from click
     * 
     * returns new view object in drawsocket format, to be drawn
     */
    function newFromClick(event)
    {

        const x = event.clientX;
        const y = event.clientY;
        const width = 800; // default w
        const height = 600; // default h

        const uniqueID = `${className}_u_${sym_utils.fairlyUniqueString()}`;

        const container = symbolist_api.getCurrentContext();
        const eventElement = container.querySelector('events');

        // create new symbol in view
        drawsocket.input({
            key: "svg", 
            val: {
                parent: eventNode.id,
                ...viewContainer(x, y, width, height, uniqueID)
            }
        })


        const containerDisplay = container.querySelector('display');
        const bbox = containerDisplay.getBoundingClientRect();

        // make relative for controller
        // the send command should be wrapped in the controller probably
        symbolist_api.send({
            key: "toData",
            val: {
                id: uniqueID,
                parent: eventNode.id,
                ...viewDisplay(x - bbox.x, y - bbox.y, width, height)
            }
        })

    }


    function move(e)
    {
        if( e.metaKey )
        {

            drawsocket.input({
                key: "svg", 
                val: {
                    id: 'rectangleStave-sprite',
                    ...viewDisplay(e.clientX, e.clientY, 800, 600)
                }
            })
        }

    }

    function down(e) 
    {
        if( e.metaKey )
        {

// scale coordinates to parent container object so we don't have to look it up in the controller

            symbolist.makeRelative()


            symbolist.send({
                key: "symbolistEvent",
                val: {
                    symbolistAction: "newFromClick",
                    view: {
                        key: "svg",
                        val: {
                            new: "circle",
                            //.. etc.
                        }
                        /// so... do we send the view or the data from here... probably the view
                    }
                }
            })

        }
    }

    function up(e){}
    function keyDown(e){}
    function keyUp(e){}



    function enter (){
        window.addEventListener("mousedown", down);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        document.body.addEventListener("keydown", keyDown);
        document.body.addEventListener("keyup", keyUp);
    }

    function exit (){
        window.removeEventListener("mousedown", down);
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        document.body.removeEventListener("keydown", keyDown);
        document.body.removeEventListener("keyup", keyUp);
    }

    // exported functions used by the symbolist renderer
    return {
        enter,
        exit
    }

})();
