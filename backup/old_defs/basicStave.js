const sym_utils = root_require('utils')

// note for using the `this` parameter, you need to use the function(){} defition not () => {}

module.exports = {

    class: 'basicStave',

    uiFile : "basicStave-ui.js",


    palette : [], // placeholder for child symbols

    paramTypes : {
        offsetInParent_x: "Number",
        offsetInParent_y: "Number",
        time: "Number",
        duration: "Number"
    },

    defaults: {
        offsetInParent_x: 0,
        offsetInParent_y: 0,
        time: 0,
        duration: 1
    },


    scalar : {
        time2pix : 1000.,
        pix2time : 0.001
    },
    
    map : {

        x2time : function(clefdata, clefview, x) { 
            const staffline = sym_utils.getChildByValue(clefview, 'class', 'basic-staffline');            
            return clefdata.time + ((x - staffline.x1) *  0.001);
        },
            
        time2x : function(clefdata, clefview, t) {
            const staffline = sym_utils.getChildByValue(clefview, 'class', 'basic-staffline');
            return staffline.x1 + ((t - clefdata.time) * 1000);
        }
    },


    comparator: (a, b) => {
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1));
    },

// onclick should be the same for all the icons, so move it out of here later
    getStaveIcon: () => ({
        view: {
            key: "html",
            val: {
                new: "div",
                id: "basicStave-paletteIcon",
                parent: "palette-clefs",
                onclick: `
                        console.log('select basicStave'); 
                        symbolist.setClass('basicStave');
                    `,
                children : {
                    new : "svg",
                    id : "basicStave-icon",
                    style : {
                        height : 20,
                        width : 16,
                        top : "calc(50% - 2px)",
                        left : "calc(50% - 8px)"
                    },
                    children : {            
                        new : "g",
                        class : "staffline-icon",
                        children : [
                            {
                                new : "line",
                                class : "basic-staffline-start",
                                x1 : 1,
                                y1 : 0,
                                x2 : 1,
                                y2 : 10,
                                style: {
                                    stroke: "white"
                                }
                            },
                            {
                                new : "line",
                                class : "basic-staffline",
                                x1 : 1,
                                y1 : 5,
                                x2 : 16,
                                y2 : 5,
                                style: {
                                    stroke: "white"
                                }
                            },
                            {
                                new : "line",
                                class : "basic-staffline-end",
                                x1 : 16,
                                y1 : 0,
                                x2 : 16,
                                y2 : 10,
                                style: {
                                    stroke: "white"
                                }
                            }
                        ]
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


    fromData: function(dataobj, data_context, view_context ) {
       //console.log('input dataobj', dataobj, 'view ref', view_context);
        
        const x = view_context.bbox.x + dataobj.offsetInParent_x + this.scalar.time2pix * dataobj.time; // sorting of staves?
        const width = (this.scalar.time2pix * dataobj.time) + (this.scalar.time2pix * dataobj.duration);        
        const y = view_context.bbox.y + dataobj.offsetInParent_y; // << obviously we're not done here

        return {
            view: {
                key: 'svg',
                val: {
                    new : "g",
                    class : "basicStave stave",
                    id : dataobj.id,
                    children : [
                        {
                            new : "g",
                            class : "stave_display",
                            id: dataobj.id + "-staveDisplay",
                            children : [{
                                new : "line",
                                class : "basic-staffline-start",
                                x1 : x,
                                x2 : x,
                                y1 : y-5,
                                y2 : y+5,
                                style : {
                                    stroke: "white",
                                    "stroke-width" : 3
                                } 
                            },
                            {
                                new : "line",
                                class : "basic-staffline",
                                x1 : x,
                                x2 : x + width,
                                y1 : y,
                                y2 : y,
                                style : {
                                    stroke: "white",
                                    "stroke-width" : 1
                                }
                            },{
                                new : "line",
                                class : "basic-staffline-end",
                                x1 : x + width,
                                x2 : x + width,
                                y1 : y-5,
                                y2 : y+5,
                                style : {
                                    stroke: "white",
                                    "stroke-width" : 2
                                }
                            }]   
                        },
                        {   // top stave layer for events
                            new : "g",
                            id : dataobj.id + "-events",
                            class : "stave_content"
                        }
                    ]
                }
                
            }
        }
    },


    // could be called from custom creation mode
    newFromClick: function(gui_event, data_context) {
        //console.log('hello?');
       
        return {
            data: {
                class : "basicStave",
                id : gui_event.id,
                offsetInParent_x : gui_event.xy[0],
                offsetInParent_y : gui_event.xy[1],
                time : 0.,  // time start here should be calculated based on sorting system
                duration : 1.
            }
        }
    },

    transform: function(_transformMatrix, viewobj, _data_context, view_context) {        
        const staffline = sym_utils.getChildByValue(viewobj, "class", "basic-staffline")     

        // not sure this should be allowed, how is the y axis organized between staves?     
        const xy = sym_utils.applyTransform( _transformMatrix, [staffline.x1, staffline.y1] )
        return {
            data : {
                class : "basicStave",
                id : viewobj.id,
                offsetInParent_x : xy[0],
                offsetInParent_y : xy[1],
                time : 0.,
                duration : 1.
            }
        }
    }

}
