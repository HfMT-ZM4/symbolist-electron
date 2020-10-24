const sym_utils = require('./utils')
const thereminClef = require('./thereminStave')

module.exports = {

    class : "thereminStave_path",

    customUI : "drawing-mode.js",

    paramTypes : {
        time : "Number",
        pitch : "Number",
        dur : "Number",
        amp : "Number",
        mod : "Number"

    },

    default : {
        start: 0,
        dur : 0.1,
        amp : 1,
        time: 0,
        mod : 0.5
    },
    
    scalar : thereminClef.scalar,

    map : { ...thereminClef.map, ... { 
        amp2r: function(amp) {
            return (amp / 100) * 15 + 5; //scale(dataobj./amp, 0., 100, 5., 20.),
        },

        mod2color: function(mod) {            
            return `rgb( ${(mod * 255)}, 0, 0 )`; //scale(dataobj./amp, 0., 100, 5., 20.),
        },

        color2mod: function(color) {
            let rgb = sym_utils.getCSSFunctionArgs(color, "rgb");
            
            return rgb[0] / 255.;
        }

    }},

    // "event" here means stave event
    /**
     * note that there is an onclick script that gets called when you select the palette symbol
     * symbolist.setClass is one of the gobally available functions exported from the renderer module
     */
    
     getEventIcon: () => ({
        key : "html",
        val : {
            new : "div",
            id : "thereminStave_path-paletteIcon",
            parent : "palette-symbols",
            onclick : `
                console.log('select path'); 
                symbolist.setClass('thereminStave_path');
            `,
            children : {
                new : "svg",
                id : "path-icon",
                style : {
                    height : 4,
                    width : 16,
                    top : "calc(50% - 2px)",
                    left : "calc(50% - 8px)"
                },
                children : {            
                    new : "g",
                    class : "path",
                    parent : "path-icon",
                    children : [
                        {
                            new : "circle",
                            class : "notehead",
                            fill : "white",
                            r : 2,
                            cy : 2,
                            cx : 2
                        },
                        {
                            new : "line",
                            class : "durationLine",
                            x1 : 2,
                            y1 : 2,
                            x2 : 16,
                            y2 : 2,
                            style: {
                                stroke: "white"
                            }

                        }
                    ]
                }
            }
        
        }
    }),

    getInfoDisplay: function(dataobj, view_bbox) {
        return sym_utils.make_default_infoDisplay(dataobj, view_bbox);
    },

    // context_data_ref not actaully used here.... 
    fromData: function(dataobj, data_context, view_context ) {        
        const r = this.map.amp2r(dataobj.amp);
        const y = this.map.pitch2y( data_context, view_context, dataobj.pitch);
        const x1 = this.map.time2x( data_context, view_context, dataobj.time);
        const x2 = this.map.time2x( data_context, view_context, dataobj.time + dataobj.dur);
        const color = this.map.mod2color( dataobj.mod );    
            
        return {
            key: 'svg',
            val: {
                new : "g",
                class : "thereminStave_path",
                id : dataobj.id,
                parent : view_context.id + "-events",
                children : [
                    {
                        new : "circle",
                        class : "notehead",
                        r : r,
                        cy : y,
                        cx : x1 + r
                    },
                    {
                        new : "line",
                        class : "durationLine",
                        x1 : x1 ,
                        y1 : y,
                        x2 : x2,
                        y2 : y,
                        style: {
                            "stroke-width": 2,
                            stroke: color
                        }
                        
                    }
                ]
            }
        }
    },

     newFromClick: function(gui_event, data_context) {
        // go into path drawing mode
        // but in order to get notified back we need a callback function 
        // so what we could is either return a special value that triggers the draw interface, secondhand, triggered from the calling process
        // or maybe better would be to trigger the custom interface **somehow in the renderer**
        // so then maybe this returns a basic version of the object which gets edited by the interface
        // 

         return {
             script : "customUI",
             create : {
                class : "thereminStave_path",
                id : gui_event.id,
                parent: data_context.id, 
                time : this.map.x2time( data_context, gui_event.context, gui_event.xy[0] - this.map.amp2r(this.default.amp) ),
                pitch : this.map.y2pitch( data_context, gui_event.context, gui_event.xy[1] ),
                dur : this.default.dur,
                amp : this.default.amp,
                mod: this.default.mod
             }
        }
     },
 
     // maybe make context an object with data and view params
     transform: function(_transformMatrix, viewobj, data_context, view_context){        
         const notehead = sym_utils.getChildByValue(viewobj, "class", "notehead")                
         const durationLine = sym_utils.getChildByValue(viewobj, "class", "durationLine")                
         const xy = sym_utils.applyTransform( _transformMatrix, [notehead.cx, notehead.cy] )
         const color = durationLine.style.stroke;
            
         return {
            class : "thereminStave_path",
            id : viewobj.id,
            parent: data_context.id, 
            time : this.map.x2time( data_context, view_context, xy[0] - this.map.amp2r(this.default.amp) ),
            pitch : this.map.y2pitch( data_context, view_context, xy[1] ),
            dur : this.default.dur,
            amp : this.default.amp,
            mod : this.map.color2mod( color)
        }

     }

}