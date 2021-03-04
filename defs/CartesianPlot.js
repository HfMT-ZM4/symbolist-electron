const Template = require(__symbolist_dirname + '/lib/SymbolTemplate'); 

class CartesianPlot extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "CartesianPlot";
        this.palette = [ "DataPoint"];

        this.margin = 20;
        this.half_margin = this.margin / 2.;

    }

    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                x_param: "centroid",
                y_param: "spread",
                x: 100,
                y: 100,
                width: 800,
                height: 600
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                height: 20, 
                width: 20
            },

            children: {
                data: {
                    centroid: 0,
                    spread: 0,
                    amplitude: 0
                },
                view: {
                    x: 0,
                    y: 0
                }
            }
        }
    }

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new:    "rect",
            id:     `${params.id}-rect`,
            class:  'CartesianPlot-rect',
            x:      params.x,
            y:      params.y,
            height: params.height,
            width:  params.width
        };

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const rect = element.querySelector('.display .CartesianPlot-rect');

        return {
            id: element.id,
            x: parseFloat(rect.getAttribute('x')),
            y: parseFloat(rect.getAttribute('y')),
            width: parseFloat(rect.getAttribute('width')),
            height: parseFloat(rect.getAttribute('height'))
        }

    }
    
    /**
     * note: this container is a "top level" DURATION container, and so for the moment we are not querying
     * the parent for info, because the here the width is determined by the duration, and the parent
     * is purely graphical, and has no knowledge of duration.
     */

    dataToViewParams(data, container)
    {      

        let viewInData = ui_api.filterByKeys(data, Object.keys(this.structs.view) );

        return {
            ...this.structs.view, // defaults
            ...viewInData, // view params passed in from data
            id: data.id
        }
     
    }

    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `CartesianPlot-palette-icon`,
                class: this.class
            })
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data)
    {
        
        const x_param = this_element.dataset.x_param;
        const y_param = this_element.dataset.y_param;

        if( ui_api.hasParam(child_data, [ x_param, y_param ] ) )
        {
            const bbox = ui_api.getBBoxAdjusted(this_element);

            let x = bbox.x + (child_data[ x_param ] * bbox.width );
            let y = bbox.y + bbox.height - (child_data[ y_param ] * bbox.height );

            return {
                x,
                y
            }
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     */
    childViewParamsToData(this_element, child_viewParams)
    {
        // no updates from view at the momement

        const x_param = this_element.dataset.x_param;
        const y_param = this_element.dataset.y_param;

        if( ui_api.hasParam(child_viewParams, [ "x", "y" ] ) )
        {
            const bbox = ui_api.getBBoxAdjusted(this_element);

            let ret = {};

            ret[x_param] = (child_viewParams.x - bbox.x) / bbox.width;
            ret[y_param] = 1 - ((child_viewParams.y - bbox.y) / bbox.height);


            return ret;
        }

    }

    /**
     * 
     * @param {Element} element 
     * 
     * called after child object has been added in order to adjust 
     * drawing of the container element
     * 
     */
    updateAfterContents( element ) {}

    updateFromDataset(element){

        /**
         * here is where we might want to change the x_ and y_ params
         * for mapping the children
         */

    }

   

}

class CartesianPlot_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "CartesianPlot";
    }
    
}


module.exports = {
    ui_def: CartesianPlot,
    io_def: CartesianPlot_IO
}

