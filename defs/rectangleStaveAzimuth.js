
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

// all symbols must be wrapped in <g> containers
// any additional UI elements will be grouped with the symbol,  so that when somehting is clicked it is still
// part of the symbol heirarchy, where the top level has includes the 'symbol' class

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

    // UI mode, "creation" or "edit", passed from renderer
    let m_mode = null;

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

    /**
     * 
     * @param {Element} element 
     * @param {Element} container 
     * 
     * called when updating data
     * 
     */
    function elementToData(element)
    {
        const container = renderer_api.getCurrentContext();
        const circle = element.querySelector('circle');
        const line = element.querySelector('line');

        const cx = parseFloat(circle.getAttribute('cx'));
        const cy = parseFloat(circle.getAttribute('cy'));
        const x2 = parseFloat(line.getAttribute('x2'));
        const y2 = parseFloat(line.getAttribute('y2'));

        return mapToData(cx, cy, default_r, x2, y2, container);

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

        return;

    }


    function deselected(element)
    {
        console.log('deselected');
        renderer_api.drawsocketInput({
            key: "remove", 
            val: `${element.id}-rotation-handle`
        })
    }


    function applyTransformToData(element)
    {
        let matrix = element.getCTM();
        renderer_api.applyTransform(element, matrix);

        let data = elementToData(element);


        renderer_api.drawsocketInput({
            key: "svg",
            val: {
                id: element.id,
                ...renderer_api.dataToHTML(data)
            }
        })

        // send out
        renderer_api.sendToController({
            key: "update",
            val: {
                id: element.id,
                class: `${className} symbol`,
                parent: element.parentNode.id,
                ...data
            }
        })

        return true;

    }


    function rotate(element, delta_pos)
    {

        let azim = Math.atan2( delta_pos.x, delta_pos.y );

        let transformlist = element.transform.baseVal; 

        let matrix = element.getCTM();
        matrix.rotateSelf(azim, 0, 0);

        const transformMatrix = svgObj.createSVGTransformFromMatrix(matrix);
        transformlist.initialize( transformMatrix );


        return;
        /*
        
        let line = element.querySelector('line');

        let x1 = parseFloat(line.getAttribute('x1'));
        let y1 = parseFloat(line.getAttribute('y1'));
        let x2 = parseFloat(line.getAttribute('x2'));
        let y2 = parseFloat(line.getAttribute('y2'));

        
        let azim = Math.atan2( delta_pos.x, delta_pos.y );
        let newX = x1 + Math.sin(azim) * default_dist;
        let newY = y1 + Math.cos(azim) * default_dist;

        line.setAttribute('x2', newX);
        line.setAttribute('y2', newY);
        element.dataset.azim = azim;

        renderer_api.drawsocketInput({
            key: 'svg',
            val: {
                id: `${element.id}-rotation-handle`,
                x: newX,
                y: newY
            }
        })

        

        // display handles
        // note: because these are just going into the main-svg the selection getTopLayer gets messed up 
        // getting the top layer is still a good idea, but needs some improvement
        renderer_api.drawsocketInput({
            key: "svg", 
            val: {
                id: `${element.id}-rotation-handle`,
                new: "rect",
                class: "handle",
                parent: element.id, 
                x: x2 - 4,
                y: y2 - 4,
                width: 8,
                height: 8,
                onclick: (event) => { console.log(test, event.target); },
                onmousemove: (event) => {
                    
            }
        })
        console.log('ello', element);
        */
    }


    /**
     * 
     * @param {Element} element html/svg element to translate
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    function translate(element, delta_pos = {x:0,y:0}) 
    {
       
        if( m_mode == "edit" )
        {
            rotate(element, delta_pos);
        }
        else
        {
                // maybe rename... sets translation in transform matrix, but doesn't apply it
            renderer_api.translate(element, delta_pos);
        
            const circ = element.querySelector('circle');
            const line = element.querySelector('line');

            const cx = parseFloat(circ.getAttribute('cx')) + delta_pos.x;
            const cy = parseFloat(circ.getAttribute('cy')) + delta_pos.y;
            const x2 = parseFloat(line.getAttribute('x2')) + delta_pos.x;
            const y2 = parseFloat(line.getAttribute('y2')) + delta_pos.y;

            let container = element.closest('.container');
            let dataObj = mapToData(cx, cy, default_r, x2, y2, container);

            renderer_api.drawsocketInput({
                key: "svg",
                val: {
                    new: "text",
                    id: `${className}-sprite`,
                    x: cx,
                    y: cy - 20,
                    text: JSON.stringify(dataObj),
                    style: {
                        'font-size': '13px',
                        'font-family': 'Helvetica sans-serif'
                    }
                }
            })
            
        }
       
        // option for default translation
       // console.log('translate', element, delta_pos);
        return true; // return true if you are handling your own translation
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

    /**
     * 
     * @param {Boolean} enable called when entering  "palette" or  "edit"  mode
     * 
     * creation mode starts when the symbol is sected in the palette
     * edit mode is when the symbols is when one symbol is selected (or when you hit [e]?)
     */
    function paletteSelected( enable = false ) {
        m_mode = 'palette';

        console.log(`enter ${className} ${m_mode}`);

        if( enable ){
            window.addEventListener("mousedown", down);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            document.body.addEventListener("keydown", keyDown);
            document.body.addEventListener("keyup", keyUp);
        }
        else
        {
            console.log(`exit ${className} ${m_mode}`);

            renderer_api.drawsocketInput({
                key: "remove", 
                val: `${className}-sprite`
            })            

            window.removeEventListener("mousedown", down);
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            document.body.removeEventListener("keydown", keyDown);
            document.body.removeEventListener("keyup", keyUp);

            m_mode = null;
        }
    }

    function editMode( enable = false )
    {
        if( enable )
        {
            let element = renderer_api.getSelected()[0]; // first object only for now...

            const line = element.querySelector('line')
            const x2 = parseFloat(line.getAttribute('x2'));
            const y2 = parseFloat(line.getAttribute('y2'));
    
            renderer_api.drawsocketInput({
                key: "svg", 
                val: {
                    id: `${element.id}-rotation-handle`,
                    new: "rect",
                    class: "handle",
                    parent: element.id, 
                    x: x2 - 4,
                    y: y2 - 4,
                    width: 8,
                    height: 8,
                    onclick: (event) => { console.log(test, event.target); }                        
                }
            })
        }
        else
        {
           
        }
        
    }


    // exported functions used by the symbolist renderer
    return {
        className,
        palette,

        getPaletteIcon,
        
        getInfoDisplay,

        //newFromClick,  // << another optional callback in case you don't want to deal with mouse events
        
       // enter edit mode

        paletteSelected, // arg true/false to enter exit

        editMode, // 1/0 to enter/exit

        
    //    enter,
    //    exit,

        selected,
        deselected,
        
        translate,
        applyTransformToData
    }

}

module.exports = {
    controller: controllerDef,
    ui: uiDef
}
