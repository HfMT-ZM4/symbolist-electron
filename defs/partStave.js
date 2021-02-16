const Template = require('../lib/symbol-template') 

class PartStave extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "PartStave";
        this.palette = [ "AzimNote", "BasicSymbol" ];


        this.left_margin = 20;

        this.x2time = 0.001;
        this.time2x = 1000;
        this.y2pitch = 127.; // y is normalized 0-1
        this.pitch2y = 1 / 127.;

    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                duration: 1,
                height: 100
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
                    pitch: 60,
                    duration: 1
                },
                view: {
                    x: 0,
                    y: 0,
                    width: 100
                }
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [{
            new:    "rect",
            class: 'partStave-rect',
            id:     `${params.id}-rect`,
            x:      params.x,
            y:      params.y,
            width:  params.width,
            height: params.height
        },
        {
            new:    "text",
            class:  'staveLabel',
            id:     `${params.id}-label`,
            x:      params.x - this.left_margin,
            y:      params.y + (params.height / 2),
            text:   params.id
        }];

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const circle = element.querySelector('.notehead');
        const x = parseFloat(circle.getAttribute('cx'));
        const y = parseFloat(circle.getAttribute('cy'));
        const r = parseFloat(circle.getAttribute('r'));

        return {
            id: element.id,
            x,
            y,
            r
        }

    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `newPartStave-palette-icon`,
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
        if( ui_api.hasParam(child_data, ['pitch', 'time']) )
        {
            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));
            const bbox_y = parseFloat(containerRect.getAttribute('y'));
            const bbox_height = parseFloat(containerRect.getAttribute('height'));

            let ret = {
                y: bbox_y + ((1. - (child_data.pitch * this.pitch2y)) * bbox_height),
                x: bbox_x + ((child_data.time - parseFloat(this_element.dataset.time)) * this.time2x)
            }

            if( ui_api.hasParam(child_data, "duration" ) )
            {
                ret.width = child_data.duration * this.time2x;
            }

            return ret;

        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     */
    childViewParamsToData(this_element, child_viewParams)
    {
        if( ui_api.hasParam(child_viewParams, ['x', 'y']) ) 
        {

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));
            const bbox_y = parseFloat(containerRect.getAttribute('y'));
            const bbox_height = parseFloat(containerRect.getAttribute('height'));

            let ret = {
                pitch: (1 - ((child_viewParams.y-bbox_y) / bbox_height)) * this.y2pitch,
                time: ((child_viewParams.x-bbox_x) * this.x2time) + parseFloat(this_element.dataset.time)            
            }

            if( ui_api.hasParam(child_viewParams, "width" ) )
            {
                ret.duration = child_viewParams.width * this.x2time;
            }

            return ret;
        }
    }


}

class PartStave_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "PartStave";
        this.lookup = super.default_conatiner_lookup;
    }
    
}


module.exports = {
    ui_def: PartStave,
    io_def: PartStave_IO
}

