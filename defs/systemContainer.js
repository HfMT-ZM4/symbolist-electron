const Template = require('../lib/symbol-template') 

class SystemContainer extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "SystemContainer";
        this.palette = [ "PartStave"];

        this.margin = 20;
        this.half_margin = this.margin / 2.;

        this.x2time = 0.001;
        this.time2x = 1000;

    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                duration: 1,
                height: 100,
                x: 100,
                y: 100,
                x_offset: this.margin * 2
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
                    time: 0,
                    height: 100,
                    duration: 1
                },
                view: {
                    x: 0,
                    y: 0,
                    height: 100
                }
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [{
            new:    "rect",
            id:     `${params.id}-rect`,
            class:  'systemContainer-rect',
            x:      params.x,
            y:      params.y,
            height: params.height,
            width:  params.width
        },
        {
            new: "path",
            id: `${params.id}-bracket`,
            class: 'systemContainer-bracket',
            d: `M ${params.x+this.margin} ${params.y+this.half_margin} h -${this.half_margin} v ${params.height - this.margin} h ${this.half_margin}`
        }];

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const rect = element.querySelector('.systemContainer-rect');

        return {
            id: element.id,
            x: parseFloat(rect.getAttribute('x')),
            y: parseFloat(rect.getAttribute('y')),
            width: parseFloat(rect.getAttribute('width')),
            height: parseFloat(rect.getAttribute('height'))
        }

    }
    
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
        const containerDisplay = container.querySelector('.display');
        const bbox = ui_api.getBBoxAdjusted(containerDisplay);

        return {
            ...this.structs.view, // defaults
            id: data.id,
            x: bbox.x + parseFloat(data.x),
            y: bbox.y + parseFloat(data.y),
            width: (2 * this.margin) + parseFloat(data.duration) * this.time2x,
            height: this.margin + (typeof data.height != 'undefined' ? parseFloat(data.height) : this.structs.data.height)
        }
     
    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `SystemContainer-palette-icon`,
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
        if( ui_api.hasParam(child_data, Object.keys(this.structs.children.data)) )
        {

            const container = ui_api.getContainerForElement(this_element);
            const this_data = ui_api.getElementData(this_element);

            const viewParams = this.dataToViewParams(this_data, container);

            const contents = this_element.querySelector('.contents');
            const n_childStaves = contents.children.length;

            let y_offset = 0;
            if( n_childStaves > 0 )
            {
                y_offset = this.margin + ui_api.getBBoxAdjusted(contents.children[n_childStaves - 1]).bottom - viewParams.y;
            }

            return {
                y: viewParams.y + y_offset,
                x: viewParams.x + this.margin,
                width: viewParams.width,
                height: child_data.height
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
    }

    /**
     * 
     * @param {Element} element 
     * 
     * called after child object has been added in order to adjust 
     * drawing of the container element
     * 
     */
    updateAfterContents( element )
    {
        const contents = element.querySelector('.contents');
        const contents_bbox = ui_api.getBBoxAdjusted(contents);

        let dataObj = {
            id: element.id, // I don't love this, but the dataObj needs the id
            duration: element.dataset.duration,
            x: element.dataset.x,
            y: parseFloat(element.dataset.y) - 20,
            height: contents_bbox.height + 40,
            x_offset: element.dataset.x_offset

        }

        const container = ui_api.getContainerForElement(element);

        this.fromData(dataObj, container);

    }

    updateFromDataset(element){}


    /**
     * 
     * @param {object} params passed in from call/method syntax
     */
    playbar(params)
    {
        if( typeof params.id != "undefined" && typeof params.time != "undefined" )
        {
            let rect = document.getElementById(`${params.id}-rect`);
            let bbox = ui_api.getBBoxAdjusted(rect);
            ui_api.drawsocketInput({
                key: "svg",
                val: {
                    id: `${params.id}-playbar`,
                    parent: params.id,
                    new: "line",
                    x1: bbox.x + params.time * this.time2x,
                    x2: bbox.x + params.time * this.time2x,
                    y1: bbox.top,
                    y2: bbox.bottom,
                    class: "playbar"
                    
                }
            })
        }
    }


}

class SystemContainer_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "SystemContainer";
        this.lookup = super.default_conatiner_lookup;
        this.getFormattedLookup = super.default_conatiner_getFormattedLookup;
    }
    
}


module.exports = {
    ui_def: SystemContainer,
    io_def: SystemContainer_IO
}

