
// make time/pixel scalar something that can be adjusted in the UI

'use strict';

//const sym_utils = root_require('utils')

const className = "rectangleStaveEvent";

const palette = [ ] //"rectangleStaveEvent", "otherRectangleStaveEvent"

const x2time = 0.001;
const time2x = 1000;
const y2pitch = 127.; // y is normalized 0-1
const default_r = 4;

let dataInstace = {
    // class name, refering to the definition below
    className,

    // unique id for this instance
    id : `${className}-0`,
    
    // container objects 
    contents: [],
    
    // container objects 
    time: 0,
    duration: 1,
    pitch: 60,
    amp: 1
}


const viewDisplay = function(cx, cy, r)
{
    return {
        new: "circle",
        cx,
        cy,
        r
    }
}



/**
 * 
 * @param {Object} controller_api reference to object containing method functions for accessing the model and view if needed
 * 
 * @returns {Object} containing controller functions to be used in mapping to/from data-view
 */
const controllerDef = function( controller_api ) 
{
        /**
         * 
         * called in controller routing updates from view
         * 
         * @param {Object} view object sent from view, containing information needed to create the data
         * @param {*} isNew (optional) flag to indicate that this is a new object (maybe we can remove this...)
         * 
         * @returns new data object, mapped from view
         */
        function fromView(viewObj)
        { 
            let parentData = controller_api.modelGet( viewObj.parent );

            let dataObj;
            
            if( controller_api.modelHas( viewObj.id ) )
                dataObj = controller_api.modelGet( viewObj.id )
            else
            {
                dataObj = {
                    id: viewObj.id,
                    class: viewObj.class,
                    parent: viewObj.parent,
                    contents: []
                }
            }

            let time = (viewObj.cx * x2time) + parentData.time + parentData.duration;
            let pitch = viewObj.cy * y2pitch; 

            let data = {
                ...dataObj,
                time,
                duration: 1
            }

            return {
                data
            }
        }

        /**
         * 
         * will be called when creating the view from the data (not implemented yet)
         * 
         * @param {Object} data object sent from model to create the view
         */
        function fromData(data) {
            return {
                view: {
                    
                }
            }
        }

         // used to sort child objects
         function comparator (a,b) {
            return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1))
        }

    
        return {
            className,
            palette,
            fromView,
            fromData,
            comparator
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
const uiDef = function(renderer_api) 
{

    
    function dataReqeust(refObject)
    {
        const container = renderer_api.getCurrentContext();
        const eventElement = container.querySelector('.contents');
        return [ eventElement.id ]
    }
    /**
     * called when drawing this symbol to draw into the palette 
     * 
     * @returns drawsocket format object which will sit inside an HTML div
     */
    function getPaletteIcon()
    {
        return {
            key: "svg",
            val: viewDisplay(25, 25, default_r)
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
    function getInfoDisplay(dataObj, viewElement)
    {
        return renderer_api.makeDefaultInfoDisplay(dataObj, viewElement.getBoundingClientRect() );
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
    function creatNewFromMouseEvent(event)
    {
        const cx = event.clientX;
        const cy = event.clientY;
        const r = default_r; 

        const uniqueID = `${className}_u_${renderer_api.fairlyUniqueString()}`;

        const container = renderer_api.getCurrentContext();
        const eventElement = container.querySelector('.contents');

        // create new symbol in view
        renderer_api.drawsocketInput([
            {
                key: "remove", 
                val: `${className}-sprite`
            },
            {
                key: "svg",
                val: {
                    class: className,
                    id: uniqueID,
                    parent: eventElement.id,
                    ...viewDisplay(cx, cy, r)
                }
            }
        ])

        const containerDisplay = container.querySelector('.display');
        const bbox = containerDisplay.getBoundingClientRect();

        const rel_x = cx - bbox.x;
        // normalizing Y to container to simplify mapping
        const rel_y = (cy - bbox.y) / bbox.height; 

        // make relative for controller
        // the send command should be wrapped in the controller probably
        renderer_api.sendToController({
            key: "toData",
            val: {
                class: className,
                id: uniqueID,
                parent: eventElement.id,
                ...viewDisplay(rel_x, rel_y, r)
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
                    id: `${className}-sprite`,
                    ...viewDisplay(e.clientX, e.clientY, default_r)
                }
            })
        }

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
            renderer_api.drawsocketInput({
                key: "remove", 
                val: `${className}-sprite`
            })

        }
    }



    function enter (){
        window.addEventListener("mousedown", down);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        document.body.addEventListener("keydown", keyDown);
        document.body.addEventListener("keyup", keyUp);
    }

    function exit (){
        
        renderer_api.drawsocketInput({
            key: "remove", 
            val: `${className}-sprite`
        })


        window.removeEventListener("mousedown", down);
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        document.body.removeEventListener("keydown", keyDown);
        document.body.removeEventListener("keyup", keyUp);
    }

    // exported functions used by the symbolist renderer
    return {
        className,
        palette,
        getPaletteIcon,
        getInfoDisplay,
       // newFromClick,
        enter,
        exit
    }

}

module.exports = {
    controller: controllerDef,
    ui: uiDef
}


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
