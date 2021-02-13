
'use strict';

class SymbolBase
{

    constructor()
    {
        this.class = "template";
        this.palette = [];
    }
    

    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                r: 2
            },

            /*
            childStructs: {
                data: {
                    time: 0
                },
                view: {
                    x: 0
                }
            }
            */
        }
    }


    display(params) {
        // checks to make sure we have all of the required params
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "circle",
            id: `${params.id}-notehead`,
            class: 'notehead',
            cx: params.x,
            cy: params.y,
            r: params.r
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
    getElementViewParams(element)
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



    getPaletteIcon()
    {
        return {
            key: "svg",
            val: this.display({
                id: `circle-palette-icon`,
                class: this.class,
                x: 10,
                y: 10,
                r: 2
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
    getInfoDisplay( viewElement )
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
    fromData(dataObj, container, preview = false)
    {
        const viewParams = this.dataToViewParams(dataObj, container);
        const viewObj = this.display(viewParams);        
        const drawObj = (preview ? 
            ui_api.svgPreviewFromViewAndData(viewObj, dataObj) : 
            ui_api.svgFromViewAndData(viewObj, dataObj) );
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
    dataToViewParams(data, container)
    {
        const parentDef = ui_api.getDefForElement(container);

        return {
            ...this.structs.view, // defaults
            ...ui_api.filterByKeys(data, Object.keys(this.structs.view) ), // gets view values that might in the data
            ...parentDef.childDataToViewParams(container, data),
            
            // other mappings that the parent doesn't know about might be added here

            id: data.id,
            container: data.container // set container/parent id
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
    viewParamsToData(viewParams, container)
    {
        const parentDef = ui_api.getDefForElement(container);

        return {
            ...this.structs.data, // defaults
            ...ui_api.filterByKeys(viewParams, Object.keys(this.structs.data) ), // gets data values that might in the view
            ...parentDef.childViewParamsToData(container, viewParams),

            // other mappings that the parent doesn't know about might be added here

            class: this.class, // overwrite the classname, since we don't want symbol or selected etc.
            container: container.id // set container/parent id
        }
    }


  
    mouseToData( event, container )
    {
        const pt = ui_api.getSVGCoordsFromEvent(event);
        const parent_def = ui_api.getDefForElement(container);

        return {
            ...this.structs.data, // set defaults, before overwriting with parent's mapping
            ...parent_def.childViewParamsToData(container, pt), 
            id: `${this.class}_u_${ui_api.fairlyUniqueString()}`,
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
    creatNewFromMouseEvent(event)
    {

        // remove preview sprite
        ui_api.drawsocketInput({
            key: "remove", 
            val: `${this.class}-sprite`
        })

        // generate objectData from Mouse Event
        const container = ui_api.getCurrentContext();
        let data =  this.mouseToData(event, container);
        
        this.fromData(data, container);

        // send new object to server
        ui_api.sendToServer({
            key: "data",
            val: data
        })

    }


    mousemove(event)
    {
        if( event.metaKey )
        {
            // preview of mouse down creation
            const container = ui_api.getCurrentContext();
            let data = this.mouseToData(event, container);
            this.fromData( data, container, true); // sets preview flag to true
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
    drag(element, delta_pos = {x:0,y:0}) 
    {
        // maybe rename... sets translation in transform matrix, but doesn't apply it
        ui_api.translate(element, delta_pos);

        let viewParams =  this.getElementViewParams(element);

        // this can be resused in most cases
        // if x and y are in the viewParams
        viewParams.x += delta_pos.x;
        viewParams.y += delta_pos.y;

        let container = ui_api.getContainerForElement(element);
        let data =  this.viewParamsToData(viewParams, container);
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
    updateFromDataset(element)
    {
        const container = ui_api.getContainerForElement(element);        
        let data = ui_api.getElementData(element, container);
     
        this.fromData(data, container);

        // update data 
        ui_api.sendToServer({
            key: "data",
            val: data
        })

    }

    applyTransformToData(element)
    {
        ui_api.applyTransform(element);

        let viewParams =  this.getElementViewParams(element);
        let container = ui_api.getContainerForElement(element);
        let data =  this.viewParamsToData(viewParams, container);

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



    selected(element, state)
    {
        console.log('select state', state);

    }

    

    /**
     * 
     * @param {Boolean} enable called when entering  "palette" or  "edit"  mode
     * 
     * creation mode starts when the symbol is sected in the palette
     * edit mode is when the symbols is when one symbol is selected (or when you hit [e]?)
     */
    paletteSelected( enable = false ) 
    {

        if( enable )
        {
            window.addEventListener("mousedown",    this );
            window.addEventListener("mousemove",    this );
            window.addEventListener("mouseup",      this);
            window.addEventListener("keydown",      this);
            window.addEventListener("keyup",        this);
        }
        else
        {
            ui_api.removeSprites();

            window.removeEventListener("mousedown",     this);
            window.removeEventListener("mousemove",     this);
            window.removeEventListener("mouseup",       this);
            window.removeEventListener("keydown",       this);
            window.removeEventListener("keyup",         this);

        }
    }

    handleEvent(e) {
        switch(e.type)
        {
            case 'keyup':
                if( e.key == "Meta" ){
                    ui_api.removeSprites();
                }
            break;
            case 'mousedown':
                if( e.metaKey ){
                    this.creatNewFromMouseEvent(e);
                }
            break;
            case 'mousemove':
                this.mousemove(e);
            break;

        }
//        console.log('handleEvent', e.type);

    }

/*
    return {
        class: this.class,
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
*/
}

module.exports = {
    SymbolBase
}
