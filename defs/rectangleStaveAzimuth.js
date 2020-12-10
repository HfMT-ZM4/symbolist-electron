
// make time/pixel scalar something that can be adjusted in the UI

'use strict';


//const sym_utils = root_require('utils')

const className = "rectangleStaveAzimuth";

const palette = [ ] //"rectangleStaveAzim", "otherRectangleStaveEvent"

const x2time = 0.001;
const time2x = 1000;

const y2pitch = 127.; // y is normalized 0-1
const pitch2y = 1 / 127.;

const default_r = 2;
const default_dist = 5;

const default_duration = 0.1;


/**
 * maybe eventually we will want to use this dataInstance signature 
 * to conform data when it arrives via udp
 */
let dataInstace = {
    // class name, refering to the definition below
    class: className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 0.1,
    pitch: 60,
    amp: 1,
    azim: 0
}

// container objects no longer have the contents in the data object, but rather the contents
// are in the containers lookup object in the io controller

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
 * @param {Object} ui_api api object passed in to def on initialization from ui controller
 * 
 * ui def defines sorting and interaction scripts that run in the editor browser
 * 
 * returns methods which can be called by the ui controller
 * 
 */
const ui_def = function(ui_api) 
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
            val: viewDisplay(`${className}-pal-disp`, 25, 25, default_r, 25, 25 - 10)
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
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement, ui_api.scrollOffset)
        )
        
    }


    // could probably incorporate this into elementToData, but the element will need to be created first
    function mapToData(viewData, container)
    {
        const containerDisplay = container.querySelector('.display');
        const bbox = ui_api.getBBoxAdjusted(containerDisplay);

        const time = ((viewData.cx-bbox.x) * x2time) + parseFloat(container.dataset.time);// + parseFloat(container.dataset.duration);
        
        const pitch = (1 - ((viewData.cy-bbox.y) / bbox.height)) * y2pitch; 
        
        const azim = Math.atan2(viewData.x2 - viewData.cx, 
                                viewData.y2 - viewData.cy )

        const duration = default_duration;

        return {
            time, 
            pitch,
            azim,
            duration
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
        const bbox = ui_api.getBBoxAdjusted(containerDisplay);

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
            azim: dataObj.azim,
            duration: default_duration
        }

        let isNew = true;
        
        let currentElement =  document.getElementById(dataObj.id) ;
       // console.log(currentElement);

        if(currentElement) {
            isNew = false;
        }

        let newView = mapToView(dataset, container, dataObj.id, isNew );

       //   console.log('newView', newView);


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
        const container = element.parentNode.closest('.container');

        const id = element.id;
        const parent = element.parentNode.id;

        let newView = mapToView(data, container, id, false);
        
         // send out before sending to drawsocket, because we overwrite the element
         
         ui_api.sendToServer({
            key: "data",
            val: {
                id,
                container: container.id,
                class: className,
                ...data
            }
        })

        ui_api.drawsocketInput({
            key: "svg",
            val: {
                parent, // parent is an id
                class: element.classList,
                ...newView, // note view has id internally
                ...ui_api.dataToHTML(data)
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

        const pt = ui_api.getSVGCoordsFromEvent(event);
        const cx = pt.x;
        const cy = pt.y;
        const r = default_r; 
        const x2 = cx + r;
        const y2 = cy - 10;

        const uniqueID = `${className}_u_${ui_api.fairlyUniqueString()}`;

        const container = ui_api.getCurrentContext();
        const eventElement = container.querySelector('.contents');

        const dataObj = mapToData({ cx, cy, r, x2, y2 }, container );
/*
// example of creating an extra point via internal scripting
        let viewObj = mapToView({
                            time: dataObj.time + 0.1, 
                            pitch: dataObj.pitch, 
                            azim: dataObj.azim + 1
                       }, container, uniqueID+'_test' );
*/
       
        // create new symbol in view
        ui_api.drawsocketInput([
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
                    ...ui_api.dataToHTML(dataObj)//,
                    //onclick: function(e){ console.log('ello', e)}

                }
            }
            /* // example of creating an extra point via internal scripting
            ,
            { 
                key: "svg",
                val: {
                    class: `${className} symbol`,
                    parent: eventElement.id,
                    ...viewObj
                }
            }*/
        ])

        // send out
        ui_api.sendToServer({
            key: "data",
            val: {
                class: className,
                id: uniqueID,
                container: container.id,
                ...dataObj
            }
        })

    }


    function move(e)
    {
        if( e.metaKey && m_mode == "palette" )
        {

            let sprite = document.getElementById(`${className}-sprite`);

            const pt = ui_api.getSVGCoordsFromEvent(e);

            const x = pt.x;
            const y = pt.y;

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
    
            const container = ui_api.getCurrentContext();
        
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

    function selected(element, state)
    {
        console.log('select state', state);

    }


    function applyTransformToData(element)
    {
        ui_api.applyTransform(element);

        let data = elementToData(element);

        ui_api.drawsocketInput({
            key: "svg",
            val: {
                id: element.id,
                ...ui_api.dataToHTML(data)
            }
        })

        // send out
        ui_api.sendToServer({
            key: "data",
            val: {
                id: element.id,
                class: className,
                container: element.parentNode.closest('.container').id,
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

        let mousePt = ui_api.getSVGCoordsFromEvent(event);

        let azim = Math.atan2( mousePt.x - x1, mousePt.y - y1);

        let newX = x1 + Math.sin(azim) * default_dist;
        let newY = y1 + Math.cos(azim) * default_dist;

        line.setAttribute('x2', newX);
        line.setAttribute('y2', newY);

        element.dataset.azim = azim;

        ui_api.drawsocketInput({
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
        // delta_pos needes to be adjusted for scale also
       
        if( m_mode == "edit" )
        {
            //rotate(element, delta_pos);
        }
        else
        {
                // maybe rename... sets translation in transform matrix, but doesn't apply it
            ui_api.translate(element, delta_pos);
        
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
            

            ui_api.drawsocketInput({
                key: "svg",
                val: {
                    new: "text",
                    id: `${className}-sprite`,
                    parent: "symbolist_overlay",
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
            ui_api.drawsocketInput({
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

            ui_api.drawsocketInput({
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
        //let element = ui_api.getSelected()[0]; // first object only for now...

        if( enable )
        {
            m_mode = 'edit';

            const line = element.querySelector('line')
            const x2 = parseFloat(line.getAttribute('x2'));
            const y2 = parseFloat(line.getAttribute('y2'));
    
            ui_api.drawsocketInput({
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

            ui_api.drawsocketInput({
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
        class: className,
        dataInstace,

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
        
        translate,
        applyTransformToData
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
     * comparator for sorting instances of this class type (rectangleStaveAzimuth)
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
      * return null if lookup params don't match the obj_ref
      * 
      */
    function lookup( params, obj_ref )
    {
        const start = obj_ref.time;
        const end = start + obj_ref.duration;
     //   console.log( start, end, params.time);
        if( start <= params.time && end >= params.time )
        {
            return {
                ...obj_ref,
                phase: (params.time - start) / obj_ref.duration
            }
        }

        return null;
    }
 

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
