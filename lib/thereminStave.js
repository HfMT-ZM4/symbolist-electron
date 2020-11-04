const sym_utils = require('./utils')

// note for using the `this` parameter, you need to use the function(){} defition not () => {}

module.exports = {

    class: 'thereminStave',

    palette : [], // placeholder for child symbols

    paramTypes : {
        offsetInParent_x: "Number",
        offsetInParent_y: "Number",
        timeStart: "Number",
        timeDur: "Number",
        pitchRange: "Number"
    },

    defaults: {
        offsetInParent_x: 0,
        offsetInParent_y: 0,
        timeStart: 0,
        timeDur: 1,
        pitchRange: 127
    },


    scalar : {
        time2pix : 1000.,
        pix2time : 0.001,
        pitch2pix : (400. / 127.),
        pix2pitch : (127. / 400.)
    },
    
    eventSortingFunction: (a, b) => {
        return a.time < b.time;
    },
    
    map : {

        x2time : function(clefdata, clefview, x) { 
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');            
            return clefdata.timeStart + ((x - rect.x) *  0.001);
        },
            
        time2x : function(clefdata, clefview, t) {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return rect.x + ((t - clefdata.timeStart) * 1000);
        },

        y2pitch : function(clefdata, clefview, y) {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return (rect.y + rect.height - y) * (127. / 400.)
        },

        pitch2y : function(clefdata, clefview, pitch) {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return rect.y + rect.height - (pitch * (400. / 127.))
        }

    },

// onclick should be the same for all the icons, so move it out of here later
    getStaveIcon: () => ({
        view: {
            key: "html",
            val: {
                new: "div",
                id: "thereminStave-paletteIcon",
                parent: "palette-clefs",
                onclick: `
                        console.log('select thereminStave'); 
                        symbolist.setClass('thereminStave');
                    `,
                child: {
                    new: "img",
                    id: "thereminStave-display",
                    src: "assets/thereminClef.svg",
                    style: {
                        width: "100%",
                        height: "100%"
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
        
        const x = view_context.bbox.x + dataobj.offsetInParent_x + this.scalar.time2pix * dataobj.timeStart; // sorting of staves?
        const width = (this.scalar.time2pix * dataobj.timeStart) + (this.scalar.time2pix * dataobj.timeDur);        
        const y = view_context.bbox.y + dataobj.offsetInParent_y; // << obviously we're not done here
        const height = this.scalar.pitch2pix * dataobj.pitchRange;

        return {
            view: {
                key: 'svg',
                val: {
                    new : "g",
                    class : "thereminStave stave",
                    id : dataobj.id,
                    children : [
                        {
                            new : "g",
                            class : "stave_display",
                            id: dataobj.id + "-staveDisplay",
                            children : [{
                                new : "rect",
                                class : "thereminStaff",
                                x : x,
                                width : width,
                                y : y,
                                height : height,
                                style : {
                                    fill: "white"
                                }
                            },
                            {
                                new : "line",
                                class : "thereminClef",
                                x1 : x + 10,
                                y1 : y,
                                x2 : x + 10,
                                y2 : y + height
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

    newFromClick: function(gui_event, data_context) {
        //console.log('hello?');
        return {
            data: {
                class : "thereminStave",
                id : gui_event.id,
                offsetInParent_x : gui_event.xy[0],
                offsetInParent_y : gui_event.xy[1],
                timeStart : 0.,
                timeDur : 1., // seconds
                pitchRange : 127 // min implied as zero
            }
        }
    },

    transform: function(_transformMatrix, viewobj, _data_context, view_context) {        
        const staff = sym_utils.getChildByValue(viewobj, "class", "thereminStaff")                
        const xy = sym_utils.applyTransform( _transformMatrix, [staff.x, staff.y] )
        return {
            data : {
                class : "thereminStave",
                id : viewobj.id,
                offsetInParent_x : xy[0],
                offsetInParent_y : xy[1],
                timeStart : 0.,
                timeDur : 1., // seconds
                pitchRange : 127 // min implied as zero
            }
        }
    }

}