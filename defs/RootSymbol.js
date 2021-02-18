const Template = require('../lib/SymbolTemplate') 

/**
 * top level symbol has no display
 * and allows any child to place itself wherever it wants
 * the root symbol controls the palette and tool menus which are created
 * when a context is selected.
 * the top most context is set in the init.json or score file
 * 
 */

class RootSymbol extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "RootSymbol";

        /**
         * the palette is created in the json file
         * however the user might want to set the tools/palette
         * for the base 
         * 
         * so, probably the tools/palette and metadata should be
         * in the data object, and changeable from the editor
         */
        
        // 
    }

    get structs () {
        return {
            data: {
                class: this.class,
                id : `${this.class}-0`,
                about: "",
                name: "",
                tools: [],
                palette: []
            },
            view: {
                class: this.class,
                id : `${this.class}-0`
            }
        }
    }


    display(params) {
        return {
            new: "g",
            id: `${params.id}`,
            class: "RootSymbol"
        }

    }

    drag(element, pos){}


     /**
     * note: this container is a "top level" container, and so for the moment we are not querying
     * the parent for info, because there is not a default class for the top svg yet,
     * eventually that is probably the way to do it rather than calculating the bbox here
     * for non-top levell symbols you can use the default definition in the template
     */
    dataToViewParams(data, container)
    {
        /**
         * note: this container is a "top level" container, and so for the moment we are not querying
         * the parent for info, because there is not a default class for the top svg yet,
         * eventually that is probably the way to do it rather than calculating the bbox here
         */

        return {
            ...this.structs.view, // defaults
            id: data.id
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
        // RootSymbol view is the palettes?
        const viewParams = this.dataToViewParams(dataObj, container);
        const viewObj = this.display(viewParams);        
        const drawObj = (preview ? 
            ui_api.svgPreviewFromViewAndData(viewObj, dataObj) : 
            ui_api.svgFromViewAndData(viewObj, dataObj) );
        ui_api.drawsocketInput( drawObj );
    }


    getElementViewParams(element) {}
    
    getPaletteIcon() {}
    

    /**
     * 
     * how to select the top level? needs a menu command probably
     * 
     * @param {*} viewElement 
     */
    getInfoDisplay( viewElement )
    {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement)
        )
    }
    
    getElementViewParams(element) {}


   
    childDataToViewParams(this_element, child_data)
    {
        return child_data;
    }

    childViewParamsToData(this_element, child_viewParams)
    {
        return child_viewParams;
    }

}

class RootSymbol_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "RootSymbol";
    }
    
    comparator(a,b){}
    lookup(params, obj_ref){}

}


module.exports = {
    ui_def: RootSymbol,
    io_def: RootSymbol_IO
}

