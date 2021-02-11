
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


const display = function(params)
{
    return {
        new: "circle",
        cx: params.x,
        cy: params.y,
        r: (params.r ? params.r : default_r)
    }
}


const ui_def = function( ui_api ) 
{

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

    function paletteSelected (enable = false) {}


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
                            ui_api.getPreviewDataSVG( viewObj, dataObj ) :
                            ui_api.getViewDataSVG( viewObj, dataObj );
        
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


    /**
     * 
     * gets viewParams from element
     * 
     * @param {Element} element 
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




    return {
        class: className,
       
        fromData,

    }

}

module.exports = {
    ui_def
}

