/**
 * actually te snap points should be in the container object, not in the overlay since there could be multiple layers of snapping
 */

const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 

class SnapPoint extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "SnapPoint";
        this.palette = [];
        this.height = 5;
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
                y: 0
            }
        }
    }

    drag(element, pos){}

    display(params) {

        console.log(params);
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "line",
            id : `${params.id}-snapline`,
            class: 'snapline', 
            x1: params.x,
            x2: params.x,
            y1: params.y ,
            y2: params.y + this.height
        };
    }
/*
    fromData(dataObj, container, preview = false)
    {
     //   console.log('container', container, dataObj);
        // merging with defaults in case the user forgot to include something
        const data_union = {
            ...this.structs.data,
            ...dataObj
        };
        
        const viewParams = this.dataToViewParams(data_union, container);
        const viewObj = this.display(viewParams);        
        ui_api.drawsocketInput({
            key: "svg",
            val: {
                container: "floating-overlay",
                ...viewObj
            }
        } );
    }
*/
    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `newSnapPoint-palette-icon`,
                class: this.class
            })
        }
    }

}

module.exports = {
    ui_def: SnapPoint,
    io_def: null
}

