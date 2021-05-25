const Template = require('./SymbolTemplate') 

class Measure extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "Measure";
        this.palette = [ "AzimNote", "BasicSymbol", "ColorPitch", "BetaEnv"];
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                duration: 1,
                barlineType: "barline"
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                height: 20, 
                width: 20, 
                barlineType: "barline"
            },

            children: {
                data: {
                    time: 0,
                    duration: 1
                },
                view: {
                    x: 0,
                    width: 100
                }
            }
        }
    }

    drag(element, pos){}

    display(params) {

        console.log(params);
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [{
            new: "rect",
            id : `${params.id}-meterbox`,
            class: 'meterbox', 
            x: params.x,
            width: params.width,
            y: params.y,
            height: params.height
        }, {
            new: "line",
            id : `${params.id}-barline`,
            class: params.barlineType, 
            x1: params.x,
            x2: params.x,
            y1: params.y ,
            y2: params.y + params.height
        }];
    }
    
    getElementViewParams(element) {

        const rect = element.getElementById(`${params.id}-meterbox`);
        const line = element.getElementById(`${params.id}-barline`);

        return {
            id: element.id,
            barlineType: line.dataset.barlineType,
            x: parseFloat(rect.getAttribute('x')),
            y: parseFloat(rect.getAttribute('y')),
            height: parseFloat(rect.getAttribute('height')),
            width: parseFloat(rect.getAttribute('width'))
        }
    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `newMeasure-palette-icon`,
                class: this.class
            })
        }
    }

}

class Measure_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "Measure";
        this.lookup = super.default_container_lookup;
    }
    
    getFormattedLookup(params, obj_ref )
    {

        let ret = {
            time: [],
            duration: [],
            pitch: []
        };

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                const event = def.getFormattedLookup(params, obj);
                if( event )
                {
                    ret.time.push(event.time);
                    ret.duration.push(event.duration);
                    ret.pitch.push(event.pitch);
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
}


module.exports = {
    ui_def: Measure,
    io_def: Measure_IO
}

