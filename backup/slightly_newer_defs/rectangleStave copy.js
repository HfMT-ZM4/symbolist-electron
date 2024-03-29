
// make time/pixel scalar something that can be adjusted in the UI

/**
 * new version, where staves are joined into a single object
 * or maybe for now dont' allow multiple staves??
 * 
 * staves serve a *visual* function, in that their spatial placement is for reading on pages
 * therefore they need to contain some visual information in their dataset
 */

'use strict';


const className = "rectangleStave";

const palette = [ "rectangleStaveEvent", "rectangleStaveAzimuth" ]; //, "otherRectangleStaveEvent"


const default_duration = 1;
const default_height = 200;

let x2time = 0.001;
let time2x = 1000;

/**
 * maybe eventually we will want to use this dataInstance signature 
 * to conform data when it arrives via udp
 */
let dataInstace = {
    // class name, refering to the definition below
    className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 1,
    x: 100,
    y: 100
}


/** 
 * viewDisplay is just the view part, for containers, it's used for sprites, palette, but the viewContainer is what is used in the DOM
 */
const viewDisplay = function(id, x, y, width, height, overwrite = true)
{
    return {
        new: (overwrite ? "g" : undefined),
        id,
        class: `${className} display`, // the display container, using the 'display' class as a selector
        children: [{
            new: (overwrite ? "rect" : undefined),
            id: `${id}-rect`,
            x,
            y,
            width,
            height,
            style: {
                fill: "white"
            }
        }]
    }

}

/*
*/
const viewContainer = function(id, x, y, width, height, overwrite = true) 
{
    /**
     * container objects us a group to contain their child objects, separate from their display
     * if overwriting, the whole container will be rewritten, which will also remove all the events
     * 
     * on update from data, the view might change, and the dataset, but not the conents
     * therefore it's more useful to have the id for the viewDisplay system rather than the display <g>
     * 
     */
    return {
        new: (overwrite ? "g" : undefined), 
        id, // use same reference id as data object
        class: `${className} symbol container`, // the top level container, using the 'container' class for type selection if needed
        children: [
            viewDisplay(`${id}-display`, x, y, width, height, overwrite),
            {
                new: (overwrite ? "g" : undefined),
                id: `${id}-contents`,
                class: `${className} contents` // the contents container, using the 'contents' class as a selector
                // removed empty children array since if we are updating the object, we don't want to overwrite the children
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
 * @param {Object} ui_api api object passed in to def on initialization from ui controller
 * 
 * ui def defines sorting and interaction scripts that run in the editor browser
 */
const ui_def = function( ui_api ) 
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
            val: viewDisplay(`${className}-pal-disp`, 0, 0, 25, 25)
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
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement, ui_api.scrollOffset)
        )
    }


    function mapToView(data, container, id, overwrite = true)
    {

        const containerDisplay = container.querySelector('.display');
        const bbox = ui_api.getBBoxAdjusted(containerDisplay);

        const x = bbox.x + parseFloat(data.x);
        const y = bbox.y + parseFloat(data.y);

        const width = parseFloat(data.duration) * time2x;
        const height = default_height;

        console.log('width', width, container);

        return viewContainer(id, x, y, width, height, overwrite)
        //viewDisplay(id, x, y, width, height, overwrite);
            
    }

    function getContainerForData(dataObj)
    {
        let containers = document.querySelectorAll(`.${className}.symbol`);
        let insertAtIndex = ui_api.insertIndex(
            dataObj, containers,
            (a,b) => {
                return (a.time < b.dataset.time) ? -1 : (a.time == b.dataset.time ? 0 : 1) ;
            });
        
        if( insertAtIndex < 0 ) 
            insertAtIndex = 0;

        return containers[insertAtIndex];
    }

    /**
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Object} event mouse event from click
     * 
     * returns new view object in drawsocket format, to be drawn
     */
    function createNewFromMouseEvent(event)
    {
        const mousePt = ui_api.getSVGCoordsFromEvent(event);

        const x = mousePt.x;
        const y = mousePt.y;
        const width = default_duration * time2x; // default w
        const height = default_height; // default h

        const uniqueID = `${className}_u_${ui_api.fairlyUniqueString()}`;

        const container = ui_api.getCurrentContext();
        const eventElement = container.querySelector('.contents');

        const prevLen = eventElement.children.length;

/*
        ax < bx
*/

    //    console.log(eventElement);

        const insertAtIndex = ui_api.insertIndex(
            { x, y, width, height, right: x+width }, eventElement.children,
            (a,b) => {
                const bbox = ui_api.getBBoxAdjusted(b);
//                    console.log(a,b,    `${a.y} > ${bbox.bottom}) || (${a.x} >= ${bbox.right})`);
                return ( (a.y > bbox.y) || (a.x >= bbox.right) ) ? 1 : -1;
            });

        
//        console.log('insertAtIndex', insertAtIndex, eventElement.children);


        let prevStaveEndTime = 0;
        if( insertAtIndex > -1 ){
            const prevStave = eventElement.children[insertAtIndex];
            prevStaveEndTime = parseFloat(prevStave.dataset.time) + parseFloat(prevStave.dataset.duration);
        }
      
        let dataObj = {
            time: prevStaveEndTime,
            duration: default_duration,
            x: x,
            y: y
        }
        
        // create new symbol in view
        ui_api.drawsocketInput([
            {
                key: "remove", 
                val: `${className}-sprite`
            },
            {
                key: "svg",
                val: {
                    parent: eventElement.id,
                    ...viewContainer(uniqueID, x, y, width, height ),
                    ...ui_api.dataToHTML(dataObj)
                }
            }
        ])
        

        let newItem = document.getElementById(uniqueID);
        if( insertAtIndex == -1 )
            eventElement.prepend( newItem )
        else
        {
            eventElement.children[insertAtIndex].after( newItem );
        }


        const ourID = insertAtIndex+1;
            
     //   eventElement.children[nextID].before( newItem );

        if( insertAtIndex != -1 && ourID < prevLen )
        {   
            const newLen = eventElement.children.length;
            let nextTime = dataObj.time + dataObj.duration;

            for( let i = ourID+1; i < newLen; i++ )
            {
                eventElement.children[i].dataset.time = nextTime;
                nextTime += parseFloat(eventElement.children[i].dataset.duration);
                // no need to update positions, but we could do that here if needed
            }
        }
        

        /*
        note: server uses container instead of parent, currently, to reinforce that the container can be a differnt value
        either the class name or the id        
        */
        ui_api.sendToServer({
            key: "data",
            val: {
                class: [className, "container"],
                id: uniqueID,
                container: [ ...container.classList], 
                ...dataObj
            }
        })

    }


    function fromData(dataObj, container)
    {
        const contentElement = container.querySelector('.contents');

        // filtering the dataObj since the id and parent aren't stored in the dataset
        let dataset = {
            time: dataObj.time,
            duration: dataObj.duration,
            x: dataObj.x,
            y: dataObj.y
        }

        let isNew = true;
        
        let currentElement =  document.getElementById(dataObj.id) ;
       // console.log(currentElement);

        if(currentElement) {
            isNew = false;
        }

        let newView = mapToView(dataset, container, dataObj.id, isNew );

      //  console.log(newView);


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

    function move(e)
    {
        if( e.metaKey && ui_api.getCurrentContext().classList[0] != className )
        {
            const mousePt = ui_api.getSVGCoordsFromEvent(e);

            let preview = viewDisplay(`${className}-sprite`, mousePt.x, mousePt.y, default_duration * time2x, default_height);

            preview.children[0].style.fill = "none";
            preview.children[0].style.stroke = "white";
            preview.children[0].style['stroke-width'] = 1;

            drawsocket.input({
                key: "svg", 
                val: {
                    class: 'sprite',
                    parent: 'symbolist_overlay',
                    ...preview
                }
            })
        }

    }

    function down(e) 
    {
        if( e.metaKey )
        {
            createNewFromMouseEvent(e);
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
            ui_api.drawsocketInput({
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

        // this is a container, so to get the enclosing container, we need to go to the parent first
        const container = element.parentNode.closest('.container');

        const id = element.id;
        const parent = element.parentNode.id;

        let newView = mapToView(data, container, id, false);
        
         // send out before sending to drawsocket, because we overwrite the element
         ui_api.sendToServer({
            key: "data",
            val: {
                id,
                container: [ ...container.classList],
                class: [className, "container"],
                ...data
            }
        })

        ui_api.drawsocketInput({
            key: "svg",
            val: {
//                id, // id is in the view now
                parent,
                class: element.classList,
                ...newView,
                ...ui_api.dataToHTML(data)
            }
        });



    }

    // exported functions used by the symbolist renderer
    return {
        className,
        dataInstace,
        palette,
        getPaletteIcon,
        getInfoDisplay,
       // newFromClick, << I guess should/could be defined in mouse handler
        paletteSelected,
        
        updateFromDataset,
        fromData,

        // selected
        // drag
        // contextSelected

        getContainerForData
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
     * comparator for sorting instances of this class type (rectangleStave)
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
      */
    function lookup( lookup_params, obj_ref )
    {
        return null; // we aren't using the lookup for staves, so we can return null here,
        // or alternatively dont' define a lookup
    }

/**
     * 
     * @param {Object} params values to use for the lookup, user definable
     * 
     * in the current example, the only params we use are time, but there could
     * be others in future, for example, by angle, or ???
     * 
     * could use the same comparator as above
     * if comparator(params, prev_obj) == -1 && comparator(params, obj) >= 0 
     *      => note_on
     * 
     */


    return {
        className,
        comparator,
        lookup
    }
}

module.exports = {
    ui_def,
    io_def
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
