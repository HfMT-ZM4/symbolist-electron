
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

// I added the id and overwrite here to deal with situations where you are storing a reference to the element
// if new is undefined, drawsocket can use the id to update the values and keep the reference in place
const viewDisplay = function(id, cx, cy, r, x2, y2, overwrite = true)
{
    return {
        id,
        new: (overwrite ? "g" : undefined),
        children : [{
            id: `${id}-notehead`,
            new: (overwrite ? "circle" : undefined),
            cx,
            cy,
            r
        },
        {
            new: (overwrite ? "line" : undefined),
            id: `${id}-azim`,
            x1: cx,
            y1: cy,
            x2, 
            y2
        }]
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
            val: viewDisplay(`${className}-pal-disp`, 25, 25, default_r, 25, 0)
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
    function getInfoDisplay( viewElement )
    {
        symbolist_ui.drawsocketInput(
            symbolist_ui.makeDefaultInfoDisplay(viewElement, symbolist_ui.scrollOffset)
        )
        
    }


    // could probably incorporate this into elementToData, but the element will need to be created first
    function mapToData(viewData, container)
    {
        const containerDisplay = container.querySelector('.display');
        const bbox = containerDisplay.getBoundingClientRect();

        const time = ((viewData.cx-bbox.x) * x2time) + parseFloat(container.dataset.time);// + parseFloat(container.dataset.duration);
        
        const pitch = (1 - ((viewData.cy-bbox.y) / bbox.height)) * y2pitch; 
        
        const azim = Math.atan2(viewData.x2 - viewData.cx, 
                                viewData.y2 - viewData.cy )

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
        const container = element.closest('.container');
        const circle = element.querySelector('circle');
        const line = element.querySelector('line');

        const cx = parseFloat(circle.getAttribute('cx'));
        const cy = parseFloat(circle.getAttribute('cy'));
        const x2 = parseFloat(line.getAttribute('x2'));
        const y2 = parseFloat(line.getAttribute('y2'));

        return mapToData(
            { 
                cx, 
                cy, 
                r: default_r, 
                x2, 
                y2 
            }, 
            container
        );

    }

    function mapToView(data, container, id, overwrite = true)
    {
       // console.log('data', data);
        const containerDisplay = container.querySelector('.display');
        const bbox = containerDisplay.getBoundingClientRect();

        const cx = bbox.x + ((data.time - parseFloat(container.dataset.time)) * time2x);
        const cy = bbox.y + ((1. - (data.pitch * pitch2y)) * bbox.height);

        const x2 = cx + Math.sin(data.azim) * default_dist;
        const y2 = cy + Math.cos(data.azim) * default_dist;

        return viewDisplay(id, cx, cy, default_r, x2, y2, overwrite)
            
    }


    function fromData(dataObj, container)
    {
        const contentElement = container.querySelector('.contents');

        // filtering the dataObj since the id and parent aren't stored in the dataset
        const dataset = {
            time: dataObj.time,
            pitch: dataObj.pitch,
            azim: dataObj.azim
        }

        let isNew = true;
        
        let currentElement =  document.getElementById(dataObj.id) ;
        console.log(currentElement);

        if(currentElement) {
            isNew = false;
        }

        let newView = mapToView(dataset, container, dataObj.id, isNew );

        console.log(newView);


        symbolist_ui.drawsocketInput({
            key: "svg",
            val: {
                parent: contentElement.id,
                class: `${className} symbol`,
                ...newView,
                ...symbolist_ui.dataToHTML(dataset)
            }
        });

    }

    // do we need a separate one for creating a new object from data? (i.e. from udp)
    // problem here is that we overwrite the element, which deletes the handle
    function updateFromDataset(element)
    {
        // assuming that we have all the data
        let data = element.dataset;
        const container = element.closest('.container');

        const id = element.id;
        const parent = element.parentNode.id;

        let newView = mapToView(data, container, id, false);
        
         // send out before sending to drawsocket, because we overwrite the element
         symbolist_ui.sendToController({
            key: "update",
            val: {
                id,
                parent,
                class: [...element.classList],
                ...data
            }
        })

        symbolist_ui.drawsocketInput({
            key: "svg",
            val: {
//                id, // id is in the view now
                parent,
                class: element.classList,
                ...newView,
                ...symbolist_ui.dataToHTML(data)
            }
        });



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
        const cx = event.pageX - symbolist_ui.scrollOffset.x;
        const cy = event.pageY - symbolist_ui.scrollOffset.y;
        const r = default_r; 

        const uniqueID = `${className}_u_${symbolist_ui.fairlyUniqueString()}`;

        const container = symbolist_ui.getCurrentContext();
        const eventElement = container.querySelector('.contents');

      //  console.log('eventElement', eventElement);

        const dataObj = mapToData(
            {
                cx, 
                cy, 
                r, 
                x2: cx + r, 
                y2: cy - 10
            }, 
            container 
        );

        let viewObj = mapToView({
                            time: dataObj.time + 0.1, 
                            pitch: dataObj.pitch, 
                            azim: dataObj.azim + 1
                       }, container, uniqueID+'_test' );

       
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
                    parent: eventElement.id,
                    ...viewDisplay(uniqueID, cx, cy, r, cx + r, cy - 10),
                    ...symbolist_ui.dataToHTML(dataObj)//,
                    //onclick: function(e){ console.log('ello', e)}

                }
            },
            { 
                key: "svg",
                val: {
                    class: `${className} symbol`,
                    parent: eventElement.id,
                    ...viewObj
                }
            }
        ])

        // send out
        symbolist_ui.sendToController({
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
        if( e.metaKey && m_mode == "palette" )
        {

            let sprite = document.getElementById(`${className}-sprite`);

            const x = e.pageX - symbolist_ui.scrollOffset.x;
            const y = e.pageY - symbolist_ui.scrollOffset.y;

            let cx, cy, azim;

            if( sprite && e.altKey )
            {
                let circle = sprite.querySelector('circle');
                cx = circle.getAttribute('cx');
                cy = circle.getAttribute('cy');
                azim = Math.atan2( x - cx, y - cy );
                //${className}-sprite
            }
            else
            {
                cx = x;
                cy = y;
                azim = 0;
            }

         
            const r = default_r; 
    
            const container = symbolist_ui.getCurrentContext();
        
            let dataObj = mapToData({
                    cx, 
                    cy, 
                    r, 
                    x2: cx + r, 
                    y2: cy - 10
                },
                container
            );

            dataObj.azim = azim;

            let viewObj = mapToView(dataObj, container, `${className}-sprite-disp`);

            drawsocket.input({
                key: "svg", 
                val: {
                    id: `${className}-sprite`,
                    class: 'sprite',
                    parent: 'symbolist_overlay',
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
               /*
        symbolist_ui.drawsocketInput({
            key: "remove", 
            val: [`${element.id}-rotation-handle`, `${className}-sprite`]
        })
        */
    }

    function applyTransformToData(element)
    {
        let matrix = element.getCTM();
        symbolist_ui.applyTransform(element, matrix);

        let data = elementToData(element);


        symbolist_ui.drawsocketInput({
            key: "svg",
            val: {
                id: element.id,
                ...symbolist_ui.dataToHTML(data)
            }
        })

        // send out
        symbolist_ui.sendToController({
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


    function rotate(element, event)
    {

        let line = element.querySelector('line');

        let x1 = parseFloat(line.getAttribute('x1'));
        let y1 = parseFloat(line.getAttribute('y1'));
        
        let x2 = parseFloat(line.getAttribute('x2'));
        let y2 = parseFloat(line.getAttribute('y2'));

        let azim = Math.atan2( event.clientX - x1, event.clientY - y1);

        let newX = x1 + Math.sin(azim) * default_dist;
        let newY = y1 + Math.cos(azim) * default_dist;

        line.setAttribute('x2', newX);
        line.setAttribute('y2', newY);

        element.dataset.azim = azim;

        symbolist_ui.drawsocketInput({
            key: "svg", 
            val: {
                id: `${element.id}-rotation-handle`,
                x: newX - 4,
                y: newY - 4
            }
        })

        updateFromDataset(element);
        
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
            //rotate(element, delta_pos);
        }
        else
        {
                // maybe rename... sets translation in transform matrix, but doesn't apply it
            symbolist_ui.translate(element, delta_pos);
        
            const circ = element.querySelector('circle');
            const line = element.querySelector('line');

            const cx = parseFloat(circ.getAttribute('cx')) + delta_pos.x;
            const cy = parseFloat(circ.getAttribute('cy')) + delta_pos.y;
            const x2 = parseFloat(line.getAttribute('x2')) + delta_pos.x;
            const y2 = parseFloat(line.getAttribute('y2')) + delta_pos.y;

            let container = element.closest('.container');
            let dataObj = mapToData(
                { 
                    cx, 
                    cy, 
                    r: default_r, 
                    x2, 
                    y2 
                }, 
                container
            ); //mapToData(cx, cy, default_r, x2, y2, container);
            

            symbolist_ui.drawsocketInput({
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
            symbolist_ui.drawsocketInput({
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

        console.log(`enter ${className} ${m_mode}`);

        if( enable ){
            m_mode = 'palette';

            window.addEventListener("mousedown", down);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            document.body.addEventListener("keydown", keyDown);
            document.body.addEventListener("keyup", keyUp);
        }
        else
        {
            console.log(`exit ${className} ${m_mode}`);

            symbolist_ui.drawsocketInput({
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

    let cb = {};

    // now passing element so that edit mode can be signaled from script
    // but then how does the controlller know that it's in edit mode?
    // maybe the controller should do less but provide key event handling and pass to scripts
    function editMode( element, enable = false )
    {
        //let element = symbolist_ui.getSelected()[0]; // first object only for now...

        if( enable )
        {
            m_mode = 'edit';

            const line = element.querySelector('line')
            const x2 = parseFloat(line.getAttribute('x2'));
            const y2 = parseFloat(line.getAttribute('y2'));
    
            symbolist_ui.drawsocketInput({
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
                    onmousedown: (event) => { 
                        console.log('ello', element);
                        console.log('register');

                        document.addEventListener('mousemove', 
                            cb[`${element.id}-moveHandler`] = function (event) {
                                console.log(`${element.id}-moveHandler`);
                                if( event.buttons == 1 ) {
                                    rotate(element, event);
                                }
                            }
                        );
                    }                        
                }
            })



        }
        else
        {
            console.log('deregister');

            symbolist_ui.drawsocketInput({
                key: "remove", 
                val: `${element.id}-rotation-handle`,
            }) 


            document.removeEventListener('mousemove', cb[`${element.id}-moveHandler`]);
            delete cb[`${element.id}-moveHandler`];
//            console.log(`removing ${element.id}-moveHandler, ${cb[`${element.id}-moveHandler`]}`);

        }
        
    }


    // exported functions used by the symbolist renderer
    return {
        className,
        palette,

        fromData,

        getPaletteIcon,
        
        getInfoDisplay,

        updateFromDataset,
        
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

/**
 * 
 * @param {Object} controller_api reference to object containing method functions for accessing the model and view if needed
 * 
 * @returns {Object} containing controller functions to be used in mapping to/from data-view
 */
const controllerDef = function( controller_api ) 
{
        // currently not used
}


module.exports = {
    ui: uiDef
}
