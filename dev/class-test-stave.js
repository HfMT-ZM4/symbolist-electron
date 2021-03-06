/**
 * 
 * new design using a "push" data flow
 * 
 * graphic interaction can manipulate graphic objects, and then push the new graphic object to the controller
 * the controller will have functions to convert to and from data and graphics
 * using the fromView function
 * translations, rotation, and other graphic transformation will be applied in the browser, 
 * and then used to udpate the data in the model (via the fromView function)
 * 
 * 
 * data can be also be created via UDP, sending new values, which will be inserted into the model, and mapped to the view
 * using the fromData function
 * 
 */


'use strict';


// maybe chnage the name of "events" ?

// since class is a reserved name in JS, but also used in HTML/CSS
// in the model we use "className", but in the browser "class" (for CSS usage)

const model = {
    // class name, refering to the definition below
    className: "default",

    // unique id for this instance
    id : "default-0",
    
    // container objects 
    events = [],
    /**
     *  add user perceptual parameters below here
     *  time, pitch, amp, etc.
     *  page, or other root containers will probably also contain graphic layout information
     **/
    x: 0,
    y: 0,
    width: 800,
    height: 600
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
        id: "default-0", // use same reference id as data object
        class: "default container", // the top level container, using the 'container' class for type selection if needed
        parent: "",
        children: [
            {
                new: "g",
                class: "default display", // the display container, using the 'display' class as a selector
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
                class: "default events", // the events container, using the 'events' class as a selector
                children: [] // empty for now
            }
        ]
       
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

    function move(e){

    }

    function down(e) {
        if( e.metaKey )
        {

// scale coordinates to parent container object so we don't have to look it up in the controller

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

    function exit (){}

    // exported functions used by the symbolist renderer
    return {
        enter,
        exit
    }

})();



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
