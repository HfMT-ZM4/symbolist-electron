
/**
 * Methods called from Controller:
 * 
 * class
 * palette
 * paletteSelected
 * getPaletteIcon
 * fromData
 * editMode
 * selected
 * applyTransformToData
 * currentContext
 * updateAfterContents
 * drag
 * getInfoDisplay
 */

'use strict';
class SymbolBase
{
    constructor()
    {
        this.class = "template";
        this.palette = [];
        this.m_mode = '';
        this.mouseListening = false;
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
     * internal method, should be re-defined in subclass
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
      //  console.log('template fromData', container, dataObj);
        // merging with defaults in case the user forgot to include something
        const data_union = {
            ...this.structs.data,
            ...dataObj
        };
        
        const viewParams = this.dataToViewParams(data_union, container);
        
        const viewObj = this.display(viewParams);        
        
        const drawObj = (preview ? 
            ui_api.svgPreviewFromViewAndData(viewObj, data_union) : 
            ui_api.svgFromViewAndData(viewObj, data_union) );

        ui_api.drawsocketInput( drawObj );
    }


    /**
     * internal mapping function data->viewParams
     * 
     * @param {Object} data 
     * @param {Element} container 
     * 
     * @returns object of view params
     * 
     */
    dataToViewParams(data, container)
    {
        const parentDef = ui_api.getDefForElement(container);
        //console.log('dataToViewParams', data, container);

        return {
            ...this.structs.view, // defaults
            ...ui_api.filterByKeys(data, Object.keys(this.structs.view) ), // gets view values that might in the data
            ...parentDef.childDataToViewParams(container, data),
            
            // other mappings that the parent doesn't know about might be added here

            id: data.id,
            container: data.container // set container/parent id
        }
     
    /**
     * note: This template prototype works only for child objects, the top level element object 
     * is the application which has no built in knowledge of time, duration etc. and so the 
     * childToViewParameters function will not apply the mapping. In the case of top-level symbols,
     * you will need to create your own mapping and put it in the dataToViewParams function
     */

    }


    /**
     * internal mapping function viewParams->data
     * 
     * @param {Object}  viewParams 
     * @param {Element} container
     * @param {Event}   event (optional) include the mouse event for mode handling
     * 
     * returns data object
     * 
     * note that the view params should be able to generate a data object from the view params without access to the element dataset.
     * in some cases, this menas that drawing coeficients need to be pulled in the getElementViewParams function
     * 
     */
    viewParamsToData(viewParams, container, event = null)
    {
        const parentDef = ui_api.getDefForElement(container);

        return {
            ...this.structs.data, // defaults
            ...ui_api.filterByKeys(viewParams, Object.keys(this.structs.data) ), // gets data values that might in the view
            ...parentDef.childViewParamsToData(container, viewParams, event),

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
     * @param {Event}   event (optional) include the mouse event for mode handling
     */
    childViewParamsToData(this_element, child_viewParams, event = null) {
        const this_element_container = ui_api.getContainerForElement(this_element);
        const parentDef = ui_api.getDefForElement(this_element_container);
        return parentDef.childViewParamsToData(this_element_container, child_viewParams, event);
        
        // by default pass on to the parent, since we don't have anything to add
        // the top level will return the child's data fully
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
        const this_element_container = ui_api.getContainerForElement(this_element);
        const parentDef = ui_api.getDefForElement(this_element_container);
        return parentDef.childDataToViewParams(this_element_container, child_data);
        // by default pass on to the parent, since we don't have anything to add
        // the top level will return the child's data fully
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
     * API function called from controller
     * called when the user hits [i] when selecting an object
     * 
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    getInfoDisplay( viewElement )
    {
       // console.log('getInfoDisplay', viewElement );
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement)
        )
        
    }

    /**
     * 
     * API function called from info panel
     * on update
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    updateFromDataset(element)
    {
        const container = ui_api.getContainerForElement(element);        
        let data = ui_api.getElementData(element, container);
     
        //console.log(element.id, 'updateFromDataset', data);

        this.fromData(data, container);

        // update data 
        ui_api.sendToServer({
            key: "data",
            val: data
        })

        let contents = element.querySelector('.contents');
        let children = contents.children;
        //console.log(element.id, 'contents', children);

        for( let i = 0; i < children.length; i++)
        {
            const child_def = ui_api.getDefForElement(children[i]);
            child_def.updateFromDataset(children[i]);
        }

    }

    /**
     * 
     * internal method
     * called from createNewFromMouseEvent and mousemove in palette mode
     * 
     * @param {Event} event 
     * @param {Element} container 
     */
    mouseToData( event, container )
    {
        const pt = ui_api.getSVGCoordsFromEvent(event);
        const parent_def = ui_api.getDefForElement(container);

        if( !parent_def )
        {
            console.error(`could not find def for container ${container}`);
        }

        return {
            ...this.structs.data, // set defaults, before overwriting with parent's mapping
            ...parent_def.childViewParamsToData(container, 
                {
                    ...this.structs.view, //get defaults
                    ...pt
                }, 
                event ), 
            id: `${this.class}_u_${ui_api.fairlyUniqueString()}`,
            container: container.id
        }    
    }


    /**
     * (internal method)
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Event} event mouse event from click
     * 
     * returns new view object in drawsocket format, to be drawn
     * 
     * 
     */
    createNewFromMouseEvent(event)
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

        return data;
    }

    /**
     * (internal method)
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
     * @param {Event} event mouse event, with added delta_pos x/y point
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    drag(element, event = { delta_pos: {x:0, y:0} } ) 
    {
        if( this.m_mode == "edit" )
        {
            //console.log('drag in edit mode');
        }
        else
        {
         //   console.log('drag in mode', this.m_mode);

            // maybe rename... sets translation in transform matrix, but doesn't apply it
            ui_api.translate(element, event.delta_pos);

            let viewParams =  this.getElementViewParams(element);

            // this can be resused in most cases
            // if x and y are in the viewParams
            viewParams.x += event.delta_pos.x;
            viewParams.y += event.delta_pos.y;

            let container = ui_api.getContainerForElement(element);
            let data = this.viewParamsToData(viewParams, container, event);

            ui_api.drawsocketInput(
                ui_api.getDataTextView(data)
            )
        }

       
        return true; // return true if you are handling your own translation
    }

    /**
     * 
     * API function called from controller
     * on mouseup after drag
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
     * when user selects a symbol
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

    
    mouseListeners(enable = false )
    {
        if( enable && !this.mouseListening )
        {
            window.addEventListener("mousedown",    this );
            window.addEventListener("mousemove",    this );
            window.addEventListener("mouseup",      this);
            window.addEventListener("keydown",      this);
            window.addEventListener("keyup",        this);

            this.mouseListening = true;
        }
        else
        {
            ui_api.removeSprites();
            window.removeEventListener("mousedown",     this);
            window.removeEventListener("mousemove",     this);
            window.removeEventListener("mouseup",       this);
            window.removeEventListener("keydown",       this);
            window.removeEventListener("keyup",         this);
            this.mouseListening = false;
        }
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
            this.mouseListeners(enable);
        }
        else
        {
            this.m_mode = 'exited palette';
            this.mouseListeners(enable);
        }
    }

    
    /**
     * 
     * (internal method)
     * 
     * handleEvents is a default JS method for handling mouse events
     * 
     * @param {Event} e mouse event
     * 
     * routes and handles events by type, 
     * and program logic
     * 
     * currently only used in palette mode but could be used in other 
     * cases
     * 
     */
    handleEvent(e) {
        switch(e.type)
        {
            case 'keyup':
                if( e.key == "Meta" ){
                    ui_api.removeSprites();
                    console.log('na?');
                }
            break;
            case 'mousedown':
                if( e.metaKey ){
                    this.createNewFromMouseEvent(e);
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
     * when user hits the [e] button
     * 
     * here we are only setting the status
     * the implementation is in the subclasses
     * 
     * @param {SVG/HTML Element} element 
     * @param {Boolean} enable 
     */
    editMode( element, enable = false )
    {
        if( enable )
        {
            this.m_mode = 'edit';
            this.mouseListeners(enable);
        }
        else
        {
            this.m_mode = 'exited edit';
            this.mouseListeners(enable);
        }

        return true; 
        // return true in subclass
        // otherwise edit mode is not set in the controller
    }


    /**
     * 
     * API function called from controller
     * when user hits the [e] button
     * 
     * here we are only setting the status
     * the implementation is in the subclasses
     * 
     * @param {SVG/HTML Element} element 
     * @param {Boolean} enable 
     */
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

            params.phase = (params.time - start) / obj_ref.duration;
            let ret = [{
                ...obj_ref,
                phase: params.phase
            }];


            if( typeof obj_ref.contents != "undefined" )
            {
                obj_ref.contents.forEach( obj => {
                    const def = io_api.defGet(obj.class);
                    const event = def.lookup(params, obj);
                    if( event )
                    {
                        ret.push(event);
                    }
                });
            
            }

            return ret;
        }

        return null;
    }


    default_container_lookup( params, obj_ref )
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

    default_container_getFormattedLookup(params, obj_ref )
    {
        let ret_by_type = {};

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                if( typeof ret_by_type[obj.class] == "undefined" ){
                    ret_by_type[obj.class] = {};
                }

                const event = def.getFormattedLookup(params, obj);
                if( event )
                {
                    Object.keys(event).forEach( k => {

                        if( typeof ret_by_type[obj.class][k] == "undefined" ){
                            ret_by_type[obj.class][k] = [];
                        }

                        ret_by_type[obj.class][k].push(event[k]);
                    })
                }
            });
        
        }
        else
        {
            ret_by_type = {
                lookup_error: `no contents element with id "${obj_ref.contents}" found`
            };
        }

        let ret_obj = {};
        ret_obj[obj_ref.id] = ret_by_type;
        
        return ret_obj;
    }
    
}

module.exports = {
    SymbolBase,
    IO_SymbolBase
};
