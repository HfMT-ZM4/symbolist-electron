
'use strict';


const className = "basic";


let dataInstance = {
    class: className,
    id : `${className}-0`,

    time: 0
}

let viewParamsInstance = {
    id: `${className}-0`, 
    x: 0,
    y: 0
}

const default_r = 2;


const ui_def = function( ui_api ) 
{


    // maps viewParams to the actaul drawing
    function display(params)
    {
        // expects id, x, y, optional r
        return {
            new: "circle",
            cx: params.x,
            cy: params.y,
            r: (params.r ? params.r : default_r)
        }
    }

    // maybe some way to automize getElementViewParams...

    /**
     * 
     * gets viewParams from element
     * 
     * @param {Element} element 
     * 
     * 
     */
    function getElementViewParams(element)
    {

        const circle = element.querySelector('circle');
        const x = parseFloat(circle.getAttribute('cx'));
        const y = parseFloat(circle.getAttribute('cy'));
        
        return {
            id: element.id,
            x,
            y
        }

    }



    function getPaletteIcon()
    {
        return {
            key: "svg",
            val: display({
                id: `circle-palette-icon`,
                x: 10,
                y: 10
            })
        }
    }



    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
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


    /**
     * API function called from controller to draw new data objects
     * also used internally
     * 
     * @param {Object} dataObj 
     * @param {Element} container 
     * @param {Boolean} preview -- optional flag to draw as sprite overlay and draw data text
     * 
     */
    function fromData(dataObj, container, preview = false)
    {
        const viewParams = dataToViewParams(dataObj, container);
        const viewObj = display(viewParams);
        const drawObj = preview ? 
                            ui_api.svgPreviewFromViewAndData( viewObj, dataObj ) :
                            ui_api.svgFromViewAndData( viewObj, dataObj );
        
        ui_api.drawsocketInput( drawObj );
    }


    /**
     * internal mapping function data->viewParams
     * 
     * @param {Object} data 
     * @param {Element} container 
     * 
     * returns object of view params
     * 
     */
    function dataToViewParams(data, container)
    {
        const parentDef = ui_api.getDefForElement(container);

        return {
            // in the most basic case, the container will do all the mapping
            ...parentDef.childDataToViewParams(container, data),
            // other view params that the parent doesn't deal with
            id: data.id
            // how do we know what values the parent returns?
            // maybe need to add some defaults here... 
            // there might be a way to generalize this...
            //          maybe iterate data object and check for view param keys?
            //              for example azim...
        }
     
    }


    /**
     * internal mapping function viewParams->data
     * 
     * @param {Object} viewParams 
     * @param {Element} container 
     * 
     * returns data object
     * 
     */
    function viewParamsToData(viewParams, container)
    {
        const parentDef = ui_api.getDefForElement(container);

        return {
            ...parentDef.childViewParamsToData(container, viewParams),
            // other view params that the parent doesn't deal with
            id: viewParams.id,
            class: className,
            container: container.id
            // how do we know what values the parent returns?
            // maybe need to add some defaults here... 
        }
    }


  
    function mouseToData( event, container )
    {
        const pt = ui_api.getSVGCoordsFromEvent(event);
        const parent_def = ui_api.getDefForElement(container);

        return {
            ...dataInstance, // set class, default azim, duration
            ...parent_def.childViewParamsToData(container, pt), //pitch and time from container
            id: `${className}_u_${ui_api.fairlyUniqueString()}`,
            container: container.id
        }    
    }


    /**
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Object} event mouse event from click
     * 
     * returns new view object in drawsocket format, to be drawn
     * 
     * 
     */
    function creatNewFromMouseEvent(event)
    {

        // remove preview sprite
        ui_api.drawsocketInput({
            key: "remove", 
            val: `${className}-sprite`
        })

        // generate objectData from Mouse Event
        const container = ui_api.getCurrentContext();
        let data = mouseToData(event, container);
        
        fromData(data, container);

        // send new object to server
        ui_api.sendToServer({
            key: "data",
            val: data
        })

    }


    function move(event)
    {
        if( event.metaKey )
        {
            // preview of mouse down creation
            const container = ui_api.getCurrentContext();
            let data = mouseToData(event, container);

            fromData( data, container, true); // sets preview flag to true
        }

    }



    /**
     * 
     * 
     * @param {Element} element html/svg element to translate
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    function drag(element, delta_pos = {x:0,y:0}) 
    {
        // maybe rename... sets translation in transform matrix, but doesn't apply it
        ui_api.translate(element, delta_pos);

        let viewParams = getElementViewParams(element);
        // this can be resused in most cases
        // if x and y are in the viewParams
        viewParams.x += delta_pos.x;
        viewParams.y += delta_pos.y;

        let container = ui_api.getContainerForElement(element);
        let data = viewParamsToData(viewParams, container);
        ui_api.drawsocketInput(
            ui_api.getDataTextView(data)
        )

       
        return true; // return true if you are handling your own translation
    }



   /**
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    function updateFromDataset(element)
    {

        const container = ui_api.getContainerForElement(element);        
        let data = ui_api.getElementData(element, container);
        
        fromData(data, container);

        // update data 
        ui_api.sendToServer({
            key: "data",
            val: data
        })

    }

    function applyTransformToData(element)
    {
        ui_api.applyTransform(element);

        let viewParams = getElementViewParams(element);
        let container = ui_api.getContainerForElement(element);
        let data = viewParamsToData(viewParams, container);

        ui_api.drawsocketInput({
            key: "svg",
            val: ui_api.dataToHTML(data)
        })

        // send out
        ui_api.sendToServer({
            key: "data",
            val: data
        })

        return true;

    }



    function selected(element, state)
    {
        console.log('select state', state);

    }

    

    function down(e) 
    {
        if( e.metaKey )
        {
            creatNewFromMouseEvent(e);
        }
    }


    function up(e){ }

    function keyDown(e){}
    
    function keyUp(e)
    {
        if( e.key == "Meta" )
        {
            ui_api.removeSprites();
        }
    }

    /**
     * 
     * @param {Boolean} enable called when entering  "palette" or  "edit"  mode
     * 
     * creation mode starts when the symbol is sected in the palette
     * edit mode is when the symbols is when one symbol is selected (or when you hit [e]?)
     */
    function paletteSelected( enable = false ) 
    {

        if( enable )
        {
            window.addEventListener("mousedown", down);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            window.addEventListener("keydown", keyDown);
            window.addEventListener("keyup", keyUp);
        }
        else
        {
            ui_api.removeSprites();

            window.removeEventListener("mousedown", down);
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);

        }
    }


    return {
       
        class: className,
        dataInstance,

        palette,

        fromData,

        getPaletteIcon,
        
        getInfoDisplay,

        updateFromDataset,
        

        paletteSelected, // arg true/false to enter exit

        // editMode, // 1/0 to enter/exit

        selected,
        
        drag,
        applyTransformToData

    }

}

module.exports = {
    ui_def
}

