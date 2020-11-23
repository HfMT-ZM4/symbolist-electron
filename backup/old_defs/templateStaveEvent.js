

'use strict';

const sym_utils = root_require('utils')

const className = "rectangleStaveEvent";

const model = {
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

function mergeData( props )
{
    return { ...model, ...props }
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

const view = {
    key: "svg",
    val: {
        new: "g", // container objects us a group to contain their child objects, separate from their display
        id: `${className}-0`, // use same reference id as data object
        class: `${className} container`, // the top level container, using the 'container' class for type selection if needed
        parent: "",
        children: [
            {
                new: "g",
                class: `${className} display`, // the display container, using the 'display' class as a selector
                children : {
                    new: "rect",
                    // id is optional here, since it's tracked by the top level 'g' here
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 600
                }
            },
            {
                new: "g",
                class: `${className} contents`, // the events container, using the 'events' class as a selector
                children: [] // empty for now
            }
        ]
       
    }
}


const viewEvent = {
    key: "svg",
    val: {
        parent: `${uniqueParentID}`,
        class: `${className} ${containerClassName} event`,
        new: "rect",
        x: 0,
        y: 0,
        width: 4,
        height: 4
    }
}


/**
 * 
 * @param {Object} symbolist_api reference to object containing method functions for accessing the model and view if needed
 * 
 * @returns {Object} containing controller functions to be used in mapping to/from data-view
 */
const controller = function( symbolist_api ) {
    return {
        className: 'staveExample',

        // used to sort child objects
        comparator: function (a,b) {
            return (a < b ? -1 : (a == b ? 0 : 1))
        },

        // class names of child objects
        palette: [],


        map: {
            x2time: function(parentData, parentView, x){ 
                const rect = sym_utils.getChildByValue(parentView, 'class', 'thereminStaff');            
                return parentData.time + ((x - rect.x) *  0.001);
            },
                
            time2x: function(parentData, parentView, t){
                const rect = sym_utils.getChildByValue(parentView, 'class', 'thereminStaff');
                return rect.x + ((t - parentData.time) * 1000);
            }    
        },


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
 * optionally could use require here like:
 * const ui = require('myCoolUI.js')
 * 
 * UI is called in the browser, and has access to the symbolist and drawsocket global modules
 * 
 * could be nicer to have the same interface as the controller, and pass the api objects as an argument
 * 
 */
const ui = (function(){


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

    function move(e){
        if( e.metaKey )
        {

            // preview sprite of this class
            // we are listening to the window events, so we can still get the mouse down
            
            drawsocket.input({
                key: "svg", 
                val: {
                    id: 'rectangleStave-sprite',
                    new: "rect",
                    x: e.clientX,
                    y: e.clientY
                }
            })
        }

    }

    function down(e) {
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
