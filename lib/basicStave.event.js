const sym_utils = require('./utils')
const thereminClef = require('./basicStave')

module.exports = {

    class : "basicStave_event",

    paramTypes : {
        time : "Number"
    },

    default : {
        time: 0,
        r: 4
    },
    
    scalar : thereminClef.scalar,

    map : thereminClef.map,

    // "event" here means stave event
    /**
     * note that there is an onclick script that gets called when you select the palette symbol
     * symbolist.setClass is one of the gobally available functions exported from the renderer module
     */
    getEventIcon: () => ({
        view: {
            key : "html",
            val : {
                new : "div",
                id : "basicStave_event-paletteIcon",
                parent : "palette-symbols",
                onclick : `
                    console.log('select basicStave_event'); 
                    symbolist.setClass('basicStave_event');
                `,
                children : {
                    new : "svg",
                    id : "basicStave_event-icon",
                    style : {
                        height : 4,
                        width : 16,
                        top : "calc(50% - 2px)",
                        left : "calc(50% - 8px)"
                    },
                    children : {            
                        new : "circle",
                        class : "basicStave_event",
                        parent : "basicStave_event-icon",
                        fill : "white",
                        r : 2,
                        cy : 2,
                        cx : 2                       
                    }
                }
            
            }
        }
    }),

    getInfoDisplay: function(dataobj, view_bbox) {
        return {
            view: sym_utils.make_default_infoDisplay(dataobj, view_bbox)
        }
    },

    // context_data_ref not actaully used here.... 
    fromData: function(dataobj, data_context, view_context ) {
        const x = this.map.time2x( data_context, view_context, dataobj.time);
        const y = sym_utils.getChildByValue(view_context, 'class', 'basic-staffline').y1;            

        console.log('noteline from data');
        
        return {
            view: {
                key: 'svg',
                val: {            
                    class : "basicStave_event",
                    id : dataobj.id,
                    parent :  view_context.id + "-events",
                    new : "circle",
                    fill : "white",
                    r : this.default.r,
                    cy : y,
                    cx : x                       
                }
            }
        }
    },

     newFromClick: function(gui_event, data_context) {
         return {
             data : {
                class : "basicStave_event",
                id : gui_event.id,
                parent: data_context.id, 
                time : this.map.x2time( data_context, gui_event.context, gui_event.xy[0] - this.default.r )
             }  
        }
     },
 
     // maybe make context an object with data and view params
     transform: function(_transformMatrix, viewobj, data_context, view_context){        
         const xy = sym_utils.applyTransform( _transformMatrix, [viewobj.cx, viewobj.cy] )
            
         return {
            data : {
                class : "basicStave_event",
                id : viewobj.id,
                parent: data_context.id, 
                time : this.map.x2time( data_context, view_context, xy[0] - this.default.r )
            }
        }

     }

}