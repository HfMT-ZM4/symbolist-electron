const sym_utils = require('./utils')
const thereminClef = require('./thereminStave')

module.exports = {

    class : "thereminStave_path",

    customUI : "path-ui.js",

    paramTypes : {
        points : "Array", //actually an array of objects, but we use JSON parse so it's ok
        time: "Number",

    },

    default : {
        time: 0,
        points : []
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

        return {
            key: 'svg',
            val: {
                new : "path",
                class : "thereminStave_path",
                id : dataobj.id,
                points: dataobj.points,
                parent : view_context.id + "-events"
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
             scriptAttr : "customUI",
             data : {
                class : "thereminStave_path",
                id : gui_event.id,
                parent: data_context.id, 
                points: [{
                    moveTo: true,
                    x: gui_event.xy[0],
                    y: gui_event.xy[1]
                }]
            }
        }
     },
 
     // maybe make context an object with data and view params
     transform: function(_transformMatrix, viewobj, data_context, view_context){        
        
        let transformedPoints = viewobj.points.map( pt => {
            let xy_ = sym_utils.applyTransform( _transformMatrix, [pt.x, pt.y]);
            pt.x = xy_[0];
            pt.y = xy_[1];
            return pt;
        })
                
         return {
            class : "thereminStave_path",
            id : viewobj.id,
            parent: data_context.id, 
            //time : this.map.x2time( data_context, view_context, xy[0] - this.map.amp2r(this.default.amp) ),
            points : transformedPoints
        }

     }

}