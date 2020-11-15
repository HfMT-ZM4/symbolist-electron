
// make time/pixel scalar something that can be adjusted in the UI

'use strict';

//const sym_utils = root_require('utils')

const className = "rectangleStaveAzimuth";

const palette = [ ] //"rectangleStaveAzim", "otherRectangleStaveEvent"

const x2time = 0.001;
const time2x = 1000;

const y2pitch = 127.; // y is normalized 0-1
const pitch2y = 1 / 127.;

const default_r = 4;
const default_dist = 10;

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
    amp: 1,
    azim: 0
}


const viewDisplay = function(cx, cy, r, x2, y2)
{
    return {
        new: "g",
        children : [{
            new: "circle",
            cx,
            cy,
            r
        },
        {
            new: "line",
            x1: cx,
            y1: cy,
            x2, 
            y2
        }]
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
            val: viewDisplay(25, 25, default_r, 25, 0)
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

    function mapToData(cx, cy, r, x2, y2, container)
    {
        const containerDisplay = container.querySelector('.display');
        const bbox = containerDisplay.getBoundingClientRect();

        const time = ((cx-bbox.x) * x2time) + parseFloat(container.dataset.time);// + parseFloat(container.dataset.duration);
        const pitch = (1 - ((cy-bbox.y) / bbox.height)) * y2pitch; 
        const azim = Math.atan2(x2 - cx, y2 - cy)

        return {
            time, 
            pitch,
            azim
        }
    }

    function mapToView(time, pitch, azim, container)
    {
        const containerDisplay = container.querySelector('.display');
        const bbox = containerDisplay.getBoundingClientRect();

        const cx = bbox.x + ((time - parseFloat(container.dataset.time)) * time2x);
        const cy = bbox.y + ((1. - (pitch * pitch2y)) * bbox.height);

        const x2 = cx + Math.sin(azim) * default_dist;
        const y2 = cy + Math.cos(azim) * default_dist;

        return viewDisplay(cx, cy, default_r, x2, y2)
            
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

      //  console.log('eventElement', eventElement);

        const dataObj = mapToData(cx, cy, r, cx + r, cy - 10, container)

        let viewObj = mapToView(dataObj.time + 0.1, dataObj.pitch, dataObj.azim + 1, container);

       
        // create new symbol in view
        renderer_api.drawsocketInput([
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
                    ...viewDisplay(cx, cy, r, cx + r, cy - 10),
                    ...renderer_api.dataToHTML(dataObj)//,
                    //onclick: function(e){ console.log('ello', e)}

                }
            },
            { 
                key: "svg",
                val: {
                    class: `${className} symbol`,
                    id: uniqueID+'_test',
                    parent: eventElement.id,
                    ...viewObj
                }
            }
        ])

        // send out
        renderer_api.sendToController({
            key: "new",
            val: {
                class: `${className} symbol`,
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

            let sprite = document.getElementById(`${className}-sprite`);

            let cx, cy, azim;

            if( sprite && e.altKey )
            {
                let circle = sprite.querySelector('circle');
                cx = circle.getAttribute('cx');
                cy = circle.getAttribute('cy');
                azim = Math.atan2( e.clientX - cx, e.clientY - cy );
                //${className}-sprite
            }
            else
            {
                cx = e.clientX;
                cy = e.clientY;
                azim = 0;
            }

         
            const r = default_r; 
    
            const container = renderer_api.getCurrentContext();
        
            const dataObj = mapToData(cx, cy, r, cx + r, cy - 10, container);
            dataObj.azim = azim;

            let viewObj = mapToView(dataObj.time, dataObj.pitch, azim, container);

            drawsocket.input({
                key: "svg", 
                val: {
                    id: `${className}-sprite`,
                    new: "g",
                    children: [
                        viewObj, //viewDisplay(cx, cy, r, cx + r, cy - 10),
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

    function selected(element)
    {

        let line = element.querySelector('line');

        let x2 = line.getAttribute('x2');
        let y2 = line.getAttribute('y2');

        const test = 'hi!';

        // display handles
        // note: because these are just going into the main-svg the selection getTopLayer gets messed up 
        // getting the top layer is still a good idea, but needs some improvement
        renderer_api.drawsocketInput({
            key: "svg", 
            val: {
                new: "rect",
                x: x2 - 4,
                y: y2 - 4,
                width: 8,
                height: 8,
                onclick: (event) => { console.log(test, event.target); }
            }
        })
        console.log('ello', element);
    }

    function translate(element)
    {
        // option for default translation
    }

    function down(e) 
    {
        console.log('haiaz');
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
        exit,
        selected
    }

}

module.exports = {
    controller: controllerDef,
    ui: uiDef
}
