
// make time/pixel scalar something that can be adjusted in the UI

'use strict';

//const sym_utils = root_require('utils')

const className = "rectangleStaveEvent";

const palette = [ ] //"rectangleStaveEvent", "otherRectangleStaveEvent"

const x2time = 0.001;
const time2x = 1000;

const y2pitch = 127.; // y is normalized 0-1
const pitch2y = 1 / 127.;

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
        function fromView(objFromView)
        { 
            // in this case the object coming in is already formatted so we don't need to do anything
            return {
                data: objFromView
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
const uiDef = function(symbolist_ui) 
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
        return symbolist_ui.makeDefaultInfoDisplay(dataObj, symbolist_ui.getBBoxAdjusted(viewElement) );
    }

    function mapToData(cx, cy, r, container)
    {
        const containerDisplay = container.querySelector('.display');
        const bbox = symbolist_ui.getBBoxAdjusted(containerDisplay);

        const time = ((cx-bbox.x) * x2time) + parseFloat(container.dataset.time);// + parseFloat(container.dataset.duration);
        const pitch = (1 - ((cy-bbox.y) / bbox.height)) * y2pitch; 

        return {
            time, 
            pitch
        }
    }

    function mapToView(time, pitch, container)
    {
        const containerDisplay = container.querySelector('.display');
        const bbox = symbolist_ui.getBBoxAdjusted(containerDisplay);

        const cx = bbox.x + ((time - parseFloat(container.dataset.time)) * time2x);
        const cy = bbox.y + ((1. - (pitch * pitch2y)) * bbox.height);

        return viewDisplay(cx, cy, default_r)
            
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

        const uniqueID = `${className}_u_${symbolist_ui.fairlyUniqueString()}`;

        const container = symbolist_ui.getCurrentContext();
        const eventElement = container.querySelector('.contents');

      //  console.log('eventElement', eventElement);

        const dataObj = mapToData(cx, cy, r, container)
       
        let viewObject = mapToView(dataObj.time, dataObj.pitch, container);
        console.log(dataObj, viewObject)

        viewObject.cx = parseFloat(viewObject.cx) + 10;

        // create new symbol in view
        symbolist_ui.drawsocketInput([
            {
                key: "remove", 
                val: `${className}-sprite`
            },
            {
                key: "svg",
                val: {
                    class: `${className} symbol`,
                    id: uniqueID,
                    parent: eventElement.id,
                    ...viewDisplay(cx, cy, r),
                    ...symbolist_ui.dataToHTML(dataObj)//,
                    //onclick: function(e){ console.log('ello', e)}

                }
            },
            {
                key: "svg",
                val: {
                    class: `${className} symbol`,
                    id: uniqueID+'test',
                    parent: eventElement.id,
                    ...viewObject,
                    ...symbolist_ui.dataToHTML(dataObj)//,

                }
            }
        ])

        // send out
        symbolist_ui.sendToController({
            key: "new",
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
        if( e.metaKey )
        {

            const cx = e.clientX;
            const cy = e.clientY;
            const r = default_r; 
    
            const container = symbolist_ui.getCurrentContext();
        
            const dataObj = mapToData(cx, cy, r, container)

            drawsocket.input({
                key: "svg", 
                val: {
                    id: `${className}-sprite`,
                    new: "g",
                    children: [
                        viewDisplay(cx, cy, r),
                        {
                            new: "text",
                            x: cx,
                            y: cy - 20,
                            text: JSON.stringify(dataObj),
                            style: {
                                'font-size': '13px',
                                'font-family': 'Helvetica sans-serif'
                            }
                        }
                    ]
                }
            })
        }
    }

    function down(e) 
    {
        console.log('hai');
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
            symbolist_ui.drawsocketInput({
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
        
        symbolist_ui.drawsocketInput({
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
