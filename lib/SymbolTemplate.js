
'use strict';

class SymbolBase
{
    constructor()
    {
        this.class = "template";
        this.palette = [];
        this.m_mode = '';
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
                text: "undefined"
            },

            /*
            // container symbols define the parameters they map here
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


    /**
     * internal method called when drawing
     * maps view parameters to drawing commands
     * 
     * returns drawsocket object
     * 
     * @param {Object} params 
     */
    display(params) { 
        console.error(`${this.class} display is undefined`);

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "text",
            id: `${params.id}-undefined`,
            class: "template",
            x: params.x,
            y: params.y,
            text: "undefined symbol"
        }

    }
    


    /**
     * internal method
     * 
     * gets viewParams from element
     * 
     * @param {Element} element the symbol SVG/HTML element to parse to view params
     * 
     * 
     */
    getElementViewParams(element) { 
        console.error(`${this.class} getElementViewParams is undefined`);

        const textEl = element.querySelector('text');
        
        return {
            id: element.id,
            x: parseFloat(textEl.getAttribute('x')),
            y: parseFloat(textEl.getAttribute('y')),
            text: textEl.innerHTML
        }
    }

    /**
     * API function called from controller
     * 
     */
    getPaletteIcon () { 
        console.error(`${this.class} getPaletteIcon is undefined`);

        return {
            key: "svg",
            val: this.display({
                id: `template-palette-icon`,
                class: this.class,
                x: 10,
                y: 10,
                text: "template"
            })
        }

    }
    

    /**
     * API function called from controller
     * called when the user hits [i] when selecting an object
     * 
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    getInfoDisplay( viewElement )
    {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement)
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


    /**
     * 
     * Called by child objects using the template
     * the parent/container object supplies a mapping from view params to data
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     */
    childViewParamsToData(this_element, child_viewParams) {
        return child_viewParams;
        
        // as a default we're just returning the input
    }


     /**
     * 
     * Called by child objects using the template
     * the parent/container object supplies a mapping from data to view params
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     * 
     */
    childDataToViewParams(this_element, child_data) {
        return child_data;

        // as a default we're just returning the input
    }

    /**
     * 
     * API function called from controller
     * 
     * @param {Element} element 
     * 
     * called after child object has been added from the score
     * in order to adjust drawing of the container element
     * 
     */
    updateAfterContents( element ) {}

  
    /**
     * 
     * API function called from controller
     * 
     * @param {Object} dataObj 
     * 
     * called from controller in dataToView as a for containers to decide
     * which of it's kind should be the context in case there are more than one
     * 
     */
    getContainerForData(dataObj)
    {
        return document.getElementById(dataObj.container);
    }

    /**
     * 
     * internal method
     * 
     * @param {Event} event 
     * @param {Element} container 
     */
    mouseToData( event, container )
    {
        const pt = ui_api.getSVGCoordsFromEvent(event);
        const parent_def = ui_api.getDefForElement(container);

        return {
            ...this.structs.data, // set defaults, before overwriting with parent's mapping
            ...parent_def.childViewParamsToData(container, {
                ...this.structs.view, //get defaults
                ...pt
            }), 
            id: `${this.class}_u_${ui_api.fairlyUniqueString()}`,
            container: container.id
        }    
    }


    /**
     * internal method
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Event} event mouse event from click
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

    /**
     * internal method
     * 
     * @param {Event} event mouse event
     * 
     */
    mousemove(event)
    {
        if( event.metaKey && this.m_mode == "palette" )
        {
            // preview of mouse down creation
            const container = ui_api.getCurrentContext();
            let data = this.mouseToData(event, container);
            this.fromData( data, container, true); // sets preview flag to true
        }

    }



    /**
     * API function called from controller
     * 
     * @param {Element} element html/svg element to translate
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    drag(element, delta_pos = {x:0,y:0}) 
    {
        if( this.m_mode == "edit" )
        {
            //console.log('drag in edit mode');
        }
        else
        {
         //   console.log('drag in mode', this.m_mode);

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
        }

       
        return true; // return true if you are handling your own translation
    }



   /**
     * 
     * API function called from info panel
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

    /**
     * 
     * API function called from controller
     * 
     * @param {SVG/HTMLElement} element 
     */
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

        return true; // << required if defined

    }


    /**
     * 
     * API function called from controller
     * 
     * @param {SVG/HTMLElement} element 
     * @param {Boolean} state notifications on selection and deselection
     *  
     */
    selected(element, state)
    {
        console.log('select state', state);
        // return true if you want to disable the default selection
    }

    

    /**
     * 
     * API function called from controller
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
            this.m_mode = 'palette';

            window.addEventListener("mousedown",    this );
            window.addEventListener("mousemove",    this );
            window.addEventListener("mouseup",      this);
            window.addEventListener("keydown",      this);
            window.addEventListener("keyup",        this);
        }
        else
        {
            this.m_mode = 'exited palette';

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

    }

    /**
     * 
     * API function called from controller
     * 
     * @param {*} element 
     * @param {*} enable 
     */
    editMode( element, enable = false )
    {
        if( enable )
        {
            this.m_mode = 'edit';
        }
        else
        {
            this.m_mode = 'exited edit';
        }

        return false; 
        // return true in subclass
        // otherwise edit mode is not set in the controller
    }



    currentContext( element, enable = false ) 
    {
        console.log(this.class, " is context ", enable);
        if( enable )
        {
            this.m_mode = 'context';
        }
        else
        {
            this.m_mode = "exited context";
        }
    }

}


class IO_SymbolBase
{
    constructor() {
        this.class = "template"
    }

    /**
     * 
     * API function called from controller
     * 
     * @param {Object} a 
     * @param {Object} b 
     * 
     * comparator for sorting instances of this class type (rectangleStave)
     */
    comparator (a, b) {
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1))
    }


    /**
      *
      * API function called from controller
      *  
      * @param {Object} dataObj data object that has been looked up
      * 
      * script here is called when looking up symbols, and potentially could respond with
      * generative values in realtime
      * 
      */
    lookup( params, obj_ref )
    {
        const start = obj_ref.time;
        const end = start + obj_ref.duration;
        if( start <= params.time && end >= params.time )
        {
            return {
                ...obj_ref,
                phase: (params.time - start) / obj_ref.duration
            }
        }

        return null;
    }


    default_conatiner_lookup( params, obj_ref )
    {
        let ret = [];

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                const event = def.lookup(params, obj);
                if( event )
                {
                    ret.push(event);
                }
            });
        
        }
        else
        {
            ret = {
                lookup_error: `no contents element with id "${obj_ref.contents}" found`
            };
        }

        let ret_obj = {};
        ret_obj[obj_ref.id] = ret;
        
        return ret_obj;
    }


    /**
     * 
     * API function called from controller
     * 
     * @param {*} params 
     * @param {*} obj_ref 
     */
    getFormattedLookup(params, obj_ref)
    {
        console.error('getFormattedLookup not defined for class', this.class, 'using default');
        return obj_ref;
    }

    default_conatiner_getFormattedLookup(params, obj_ref)
    {
        let ret = [];

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                const event = def.getFormattedLookup(params, obj);
                if( event )
                {
                    ret.push(event)
                }
            });
        
        }
        else
        {
            ret = {
                lookup_error: `no contents element with id "${obj_ref.contents}" found`
            };
        }

      //  console.log(`${className} ret ${JSON.stringify(ret)}`);
        let ret_obj = {};
        ret_obj[obj_ref.id] = ret;
        
        return ret_obj;
    }

}

module.exports = {
    SymbolBase,
    IO_SymbolBase
};

