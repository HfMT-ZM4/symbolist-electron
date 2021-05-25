const Template = require('./SymbolTemplate') 

class DataPoint extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "DataPoint";
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                centroid: 0,
                spread: 0,
                amplitude: 0
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                r: 2
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "circle",
            class: 'notehead',
            id: `${params.id}-notehead`,
            cx: params.x,
            cy: params.y,
            r: params.r
        }

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
                id: `${this.class}-palette-icon`,
                class: this.class,
                x: 10,
                y: 10,
                r: 2
            })
        }
    }


}

class DataPoint_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "DataPoint";
    }
    
}



module.exports = {
    ui_def: DataPoint,
    io_def: DataPoint_IO    
}

