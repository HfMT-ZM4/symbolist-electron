
// make time/pixel scalar something that can be adjusted in the UI

'use strict';


const className = "rectangleStave";

const palette = [ "rectangleStaveEvent", "rectangleStaveAzimuth" ]; //, "otherRectangleStaveEvent"


const default_duration = 1;

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
 * <g class='className symbol container' data-time="0.1" data-duration="1" >
 *      <g class='className display'></g>
 *      <g class='className contents'></g>
 * </g>
 * 
 * html:
 * <div class='className symbol container'>
 *      <div class='className display'></div>
 *      <div class='className contents'></div>
 * </div>
 * 
 * regular objects can be any node type
 * usually they will be in a container
 * 
 * <g class"className symbol" data-time="0.1" data-duration="1">
 *     <circle .... />
 * </g>
 * 
 * 
 * sent to browser using drawsocket format
 * 
 */



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
const uiDef = function( symbolist_ui ) 
{

    function comparator (a, b) {
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1))
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
    function getInfoDisplay(viewElement)
    {
        symbolist_ui.drawsocketInput(
            symbolist_ui.makeDefaultInfoDisplay(viewElement, symbolist_ui.scrollOffset)
        )
    }

    function getContainerForData(dataObj)
    {
        let containers = document.querySelectorAll(`.${className}.symbol`);
        const insertAtIndex = symbolist_ui.insertIndex(
            dataObj, containers,
            (a,b) => {
                return (a.time < b.dataset.time) ? -1 : (a.time == b.dataset.time ? 0 : 1) ;
            });
        
        return containers[insertAtIndex];
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
        const x = event.pageX - symbolist_ui.scrollOffset.x;
        const y = event.pageY - symbolist_ui.scrollOffset.y;
        const width = default_duration * time2x; // default w
        const height = 600; // default h

        const uniqueID = `${className}_u_${symbolist_ui.fairlyUniqueString()}`;

        const container = symbolist_ui.getCurrentContext();
        const eventElement = container.querySelector('.contents');

        const prevLen = eventElement.children.length;

/*
        ax < bx
*/

        const insertAtIndex = symbolist_ui.insertIndex(
            { x, y, width, height, right: x+width }, eventElement.children,
            (a,b) => {
                const bbox = b.getBoundingClientRect();
                return (a.y >= bbox.bottom || a.x >= bbox.right ) ? 1 : -1;
            });

        
        console.log('insertAtIndex', insertAtIndex, eventElement.children);


        let prevStaveEndTime = 0;
        if( insertAtIndex > -1 ){
            const prevStave = eventElement.children[insertAtIndex];
            prevStaveEndTime = parseFloat(prevStave.dataset.time) + parseFloat(prevStave.dataset.duration);
        }
            
      
        let dataObj = {
            time: prevStaveEndTime,
            duration: default_duration
        }
        // create new symbol in view
        symbolist_ui.drawsocketInput([
            {
                key: "remove", 
                val: 'rectangleStave-sprite'
            },
            {
                key: "svg",
                val: {
                    ...viewContainer(x, y, width, height, uniqueID, eventElement.id),
                    ...symbolist_ui.dataToHTML(dataObj)
                }
            }
        ])
        
        const nextID = insertAtIndex+1;
        let newItem = document.getElementById(uniqueID);
        eventElement.children[nextID].before( newItem );

        if( insertAtIndex != -1 && insertAtIndex < prevLen )
        {   
            const newLen = eventElement.children.length;
            for( let i = nextID+1; i < newLen; i++ )
            {
                const currenttime = parseFloat(eventElement.children[i].dataset.time);
                console.log(i, currenttime);
                eventElement.children[i].dataset.time = currenttime + dataObj.duration;
                // no need to update positions, but we could do that here if needed
            }
        }
        

        symbolist_ui.sendToController({
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
        if( e.metaKey && symbolist_ui.getCurrentContext().classList[0] != className )
        {
            const x = e.pageX - symbolist_ui.scrollOffset.x;
            const y = e.pageY - symbolist_ui.scrollOffset.y;
            let preview = viewDisplay(x, y, default_duration * time2x, 600);

            preview.style.fill = "none";
            preview.style.stroke = "white";
            preview.style['stroke-width'] = 1;

            drawsocket.input({
                key: "svg", 
                val: {
                    parent: "symbolist_overlay",
                    id: 'rectangleStave-sprite',
                    class: 'sprite',
                    ...preview
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
            symbolist_ui.drawsocketInput({
                key: "remove", 
                val: 'rectangleStave-sprite'
            })

        }
    }




    /**
     * 
     * @param {Element} obj selected element
     */
    function paletteSelected (enable = false)
    {

        if( enable ){
            window.addEventListener("mousedown", down);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            document.body.addEventListener("keydown", keyDown);
            document.body.addEventListener("keyup", keyUp);


        }
        else
        {
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

    // exported functions used by the symbolist renderer
    return {
        className,
        palette,
        getPaletteIcon,
        getInfoDisplay,
       // newFromClick, << I guess should/could be defined in mouse handler
        paletteSelected,
        
        // updateFromDataset, //<< not implemented

        // selected
        // drag
        // contextSelected

        getContainerForData
    }

}

module.exports = {
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
