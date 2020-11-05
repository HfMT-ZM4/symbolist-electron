/**
 * at some point we could consider putting the ui code in here rather than splitting into two files.
 * 
 * new format idea: tag data and view info to make double clear what is being returned
 */

const sym_utils = root_require('utils')
const thereminClef = require('./thereminStave')

module.exports = {

    class : "thereminStave_path",

    // this path gets converted to an absoulte path after loading
    // OR maybe this reference should be in the json file?? still not sure
    uiFile : "path-ui.js",

    paramTypes : {
        points : "Array", //actually an array of objects, but we use JSON parse so it's ok
        time: "Number",
    },

    default : {
        time: 0,
        points : []
    },
    
    scalar : thereminClef.scalar,

    map : thereminClef.map,

    // "event" here means stave event
    /**
     * note that there is an onclick script that gets called when you select the palette symbol
     * symbolist.setClass is one of the gobally available functions exported from the renderer module
     */
    
     getEventIcon: () => {
         return {
             view: {
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
            }
        }
    },


    // info display should be Edit or Inspector, or IDK maybe info is fine...

    getInfoDisplay: function(dataobj, view_bbox) {
        
        // enter edit mode here

        return {
            view : sym_utils.make_default_infoDisplay(dataobj, view_bbox),
            event: {  
                key: "signal-gui-script",
                val: {
                    call: "enterEditMode",
                    args: dataobj
                } 
            }
        }
    },

    // context_data_ref not actaully used here.... 
    fromData: function(dataobj, data_context, view_context ) {        

        return {
            view: {
                key: 'svg',
                val: {
                    new : "path",
                    class : "thereminStave_path",
                    id : dataobj.id,
                    points: dataobj.points,
                    parent : view_context.id + "-events"
                }
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


        /// maybe better to send a message to start from here rather than load the file
        /// better to load the file when you click the symbol type ... 
        // so if you select a different type in the score itself, the palette should also automatically change
        // it's a mode

        // so also the scriptAttr shouldn't be here

        /*
            could later be able to trigger GUI events from here
            but for now I'm going to create a set of default UI event callbacks for ui scripts

            could return an array to control processing order maybe... not needed yet
        */        

        const data = {
            class : "thereminStave_path",
            id : gui_event.id,
            parent: data_context.id, 
            points: [{
                moveTo: true,
                x: gui_event.xy[0],
                y: gui_event.xy[1]
            }]
        };

         return {
            data,
            event: {  
                key: "signal-gui-script",
                val: {
                    call: "enterEditMode",
                    args: data
                } 
            }
        }
     },
 
     // maybe make context an object with data and view params
     transform: function(_transformMatrix, viewobj, data_context, view_context){        
        
        let transformedPoints = viewobj.points.map( pt => {
            let xy_ = sym_utils.applyTransform( _transformMatrix, [pt.x, pt.y]);
            pt.x = xy_[0];
            pt.y = xy_[1];

            if( pt.curve && pt.curve.type == "quadratic")
            {
                let cxy_ = sym_utils.applyTransform( _transformMatrix, [pt.curve.x1, pt.curve.y1]);
                pt.curve.x1 = cxy_[0];
                pt.curve.y1 = cxy_[1];
            }

            return pt;
        })
                
         return {
            data: {
                class : "thereminStave_path",
                id : viewobj.id,
                parent: data_context.id, 
                //time : this.map.x2time( data_context, view_context, xy[0] - this.map.amp2r(this.default.amp) ),
                points : transformedPoints
            }
        }

     }

}