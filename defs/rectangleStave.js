
// make time/pixel scalar something that can be adjusted in the UI

'use strict';

//const sym_utils = root_require('utils')

const className = "rectangleStave";

const palette = [ "rectangleStaveEvent", "rectangleStaveAzimuth" ]; //, "otherRectangleStaveEvent"


let x2time = 0.001;
let time2x = 1000;

let objectDataTypes = {
    time: "Number",
    duration: "Number"
}



const viewDisplay = function(x, y, width, height)
{
    return {
        new: "rect",
        x,
        y,
        width,
        height,
        style: {
            fill: "white"
        }
    }
}

const viewContainer = function(x, y, width, height, id, parentID) 
{
    // prepend data to keys
    return {
        new: "g", // container objects us a group to contain their child objects, separate from their display
        id, // use same reference id as data object
        class: `${className} symbol container`, // the top level container, using the 'container' class for type selection if needed
        parent: parentID,
        children: [
            {
                new: "g",
                class: `${className} display`, // the display container, using the 'display' class as a selector
                children : viewDisplay(x,y,width,height)
            },
            {
                new: "g",
                id: `${id}-contents`,
                class: `${className} contents`, // the contents container, using the 'contents' class as a selector
                children: [] // empty for now
            }
            ]  
    }
}


/**
 * view container model (stave/page/etc)
 * 
 * svg:
 * <g class='className container'>
 *      <g class='className display'></g>
 *      <g class='className contents'></g>
 * </g>
 * 
 * html:
 * <div class='className container'>
 *      <div class='className display'></div>
 *      <div class='className contents'></div>
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
         * 
         * 
         * from:
         * {
                id: uniqueID,
                class: className,
                parent: eventNode.id,
                new: "rect",
                x,
                y,
                width,
                height
         }

         to: 
            {
                className,
                id,
                parent,

                // container objects 
                contents = [],
                
                time: 0,
                duration: 1
            }
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

            let time = 0; //(viewObj.x * x2time) + parentData.time + parentData.duration;

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

    

    /**
     * called when drawing this symbol to draw into the palette 
     * 
     * @returns drawsocket format object which will sit inside an HTML div
     */
    function getPaletteIcon()
    {
        return {
            key: "svg",
            val: viewDisplay(0, 0, 25, 25)
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
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Object} event mouse event from click
     * 
     * returns new view object in drawsocket format, to be drawn
     */
    function creatNewFromMouseEvent(event)
    {
        const x = event.clientX;
        const y = event.clientY;
        const width = 800; // default w
        const height = 600; // default h

        const uniqueID = `${className}_u_${renderer_api.fairlyUniqueString()}`;

        const container = renderer_api.getCurrentContext();
        const eventElement = container.querySelector('.contents');


        // figure out the time value of this container
        // ideally this should be determined by the parent container, but we don't have a top level container yet
        // let allOfThisType = container.querySelectAll(`.${className}.container`);
        // for now the events will just be relative to their container

        let dataObj = {
            time: 0,
            duration: 1
        }
        // create new symbol in view
        renderer_api.drawsocketInput([
            {
                key: "remove", 
                val: 'rectangleStave-sprite'
            },
            {
                key: "svg",
                val: {
                    ...viewContainer(x, y, width, height, uniqueID, eventElement.id),
                    ...renderer_api.dataToHTML(dataObj)
                }
            }
        ])

        //let t = document.getElementById(uniqueID);
        //console.log('test value', t.dataset.test);


        const containerDisplay = container.querySelector('.display');
        const bbox = containerDisplay.getBoundingClientRect();

        // make relative for controller
        // the send command should be wrapped in the controller probably
        renderer_api.sendToController({
            key: "toData",
            val: {
                class: className,
                id: uniqueID,
                parent: eventElement.id,
                ...dataObj
            }
        })

    }


    function move(e)
    {
        if( e.metaKey && renderer_api.getCurrentContext().classList[0] != className )
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
                val: 'rectangleStave-sprite'
            })

        }
    }



    /**
     * 
     * @param {Element} obj selected element
     */
    function enter (obj){
        console.log('entered with context', obj);

        window.addEventListener("mousedown", down);
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        document.body.addEventListener("keydown", keyDown);
        document.body.addEventListener("keyup", keyUp);
    }

    function exit (){
        
        renderer_api.drawsocketInput({
            key: "remove", 
            val: 'rectangleStave-sprite'
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
