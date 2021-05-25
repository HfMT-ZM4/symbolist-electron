const Template = require('./SymbolTemplate') 

class PartStave extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "PartStave";
        this.palette = [ "AzimNote", "BasicSymbol", "ColorPitch", "BetaEnv"];

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

    drag(element, pos){}

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

        let ret = {};
        const containerRect = this_element.querySelector('.partStave-rect');

        if( ui_api.hasParam(child_data, 'pitch', true) )
        {
            const bbox_y = parseFloat(containerRect.getAttribute('y'));
            const bbox_height = parseFloat(containerRect.getAttribute('height'));

            ret.y = bbox_y + ((1. - (child_data.pitch * this.pitch2y)) * bbox_height);
        }

        if( ui_api.hasParam(child_data, 'time', true) )
        {
            const bbox_x = parseFloat(containerRect.getAttribute('x'));

            ret.x = bbox_x + ((child_data.time - parseFloat(this_element.dataset.time)) * this.time2x);
        }

        if( ui_api.hasParam(child_data, "duration" ) )
        {
            ret.width = child_data.duration * this.time2x;
        }

        if( child_data.class == "Measure" || child_data.class == "SnapPoint" ){
            ret.y = parseFloat(containerRect.getAttribute('y'));
            ret.height = parseFloat(containerRect.getAttribute('height'));
        }

       // console.log(ret);
        return ret;

    }

    /**
     * 
     * Called by child objects using the template
     * the parent/container object supplies a mapping from view params to data
     * 
     * @param {Element} this_element instance of this element
     * @param {Object}  child_viewParams child data object, requesting information about where to put itself
     * @param {Event}   event (optional) include the mouse event for mode handling
     */
     childViewParamsToData(this_element, child_viewParams, event = null) 
     {
        if( ui_api.hasParam(child_viewParams, ['x', 'y']) ) 
        {

            let child_x = child_viewParams.x;

            if( event && event.shiftKey )
            {
                const snapPoints = this_element.querySelectorAll('.contents .snapline');
                if( snapPoints )
                {

                    let choose_x = 100000;
                    snapPoints.forEach( e => {
                        let snap_x = parseFloat( e.getAttribute("x1") );
                        if( Math.abs(child_x - snap_x) < Math.abs(child_x - choose_x) ) 
                        {
                            choose_x = snap_x;
                        }
                    })
                    /*
                    var closest = counts.reduce( function(prev, curr) {
                        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                      });
                      */
                    child_x = choose_x;

                }
            }

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));
            const bbox_y = parseFloat(containerRect.getAttribute('y'));
            const bbox_height = parseFloat(containerRect.getAttribute('height'));

            let ret = {
                pitch: (1 - ((child_viewParams.y-bbox_y) / bbox_height)) * this.y2pitch,
                time: ((child_x-bbox_x) * this.x2time) + parseFloat(this_element.dataset.time)            
            }

            if( ui_api.hasParam(child_viewParams, "width" ) )
            {
                ret.duration = child_viewParams.width * this.x2time;
            }

            return ret;
        }
    }


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

    fooFN(params)
    {
        console.log('hi I have your ', params);
    }


}

class PartStave_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "PartStave";
        this.lookup = super.default_container_lookup;
    }
    
    getFormattedLookup(params, obj_ref )
    {

        let ret = {
            time: [],
            duration: [],
            pitch: []
        };

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

                    /*
                    ret.time.push(event.time);
                    ret.duration.push(event.duration);
                    ret.pitch.push(event.pitch);
                    */
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
    ui_def: PartStave,
    io_def: PartStave_IO
}

