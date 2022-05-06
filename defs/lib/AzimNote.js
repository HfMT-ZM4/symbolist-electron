const Template = require('./SymbolTemplate') 

class AzimNote extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "AzimNote";
        this.default_dist = 10;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                pitch: 55,
                azim: 3.14,
                duration: 0.1
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                r: 2,
                azim: 3.14
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [{
            id: `${params.id}-notehead`, // << make sure to give the sub-elements ids
            class: 'notehead',
            new: "circle",
            cx: params.x,
            cy: params.y,
            r: params.r
        },
        {
            new: "line" ,
            id: `${params.id}-azim`, // << make sure to give the sub-elements ids
            class: 'azimLine',
            x1: params.x,
            y1: params.y,
            x2: params.x + Math.sin(params.azim) * this.default_dist,
            y2: params.y + Math.cos(params.azim) * this.default_dist
        }]

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const circle = element.querySelector('.notehead');
        const azim_line = element.querySelector('.azimLine');

        const x = parseFloat(circle.getAttribute('cx'));
        const y = parseFloat(circle.getAttribute('cy'));
        const r = parseFloat(circle.getAttribute('r'));

        const x2 = parseFloat(azim_line.getAttribute('x2'));
        const y2 = parseFloat(azim_line.getAttribute('y2'));

        const azim = Math.atan2(x2-x, y2-y);

        return {
            id: element.id,
            x,
            y,
            r,
            azim
        }

    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                id: `${this.class}-icon`,
                class: this.class,
                x: 10,
                y: 10,
                r: 2,
                azim: 0.15
            })
        }
    }


    editMode( element, enable = false )
    {
        super.editMode(element, enable);
        
        if( enable )
        {
            ui_api.createHandle( 
                // element to use for reference
                element, 
                // xy attrs to use for the handle
                { selector: `#${element.id} .azimLine`, x: "x2", y: "y2"},
                // callback function
                (element_, event) => {
                    const line = element_.querySelector('.azimLine');
                    const x1 = parseFloat(line.getAttribute('x1'));
                    const y1 = parseFloat(line.getAttribute('y1'));
                    
                    let mousePt = ui_api.getSVGCoordsFromEvent(event);
                    
                    let azim = Math.atan2( mousePt.x - x1, mousePt.y - y1);
                    element_.dataset.azim = azim;

                    this.updateFromDataset(element_);

                }
            );
        }
        else
        {
            ui_api.removeHandles();
        }


        return true; // << required if defined
    }
}



class AzimNote_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "AzimNote";
    }
    
}


module.exports = {
    ui_def: AzimNote,
    io_def: AzimNote_IO
}