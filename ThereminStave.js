const sym_utils = require('./utils')

// note for using the `this` parameter, you need to use the function(){} defition not () => {}

module.exports = {

    class: 'thereminStave',

    palette : [], // placeholder for child symbols

    defaults: {
        offsetInParent: {
            x: 0,
            y: 0
        },
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
    }),

    fromData: function(dataobj, view_context, context_data) {
       // console.log('input dataobj', dataobj, 'view ref', view_context);
        
        const x = view_context.bbox.x + dataobj.offsetInParent.x + this.scalar.time2pix * dataobj.timeStart; // sorting of staves?
        const width = (this.scalar.time2pix * dataobj.timeStart) + (this.scalar.time2pix * dataobj.timeDur);        
        const y = view_context.bbox.y + dataobj.offsetInParent.y; // << obviously we're not done here
        const height = this.scalar.pitch2pix * dataobj.pitchRange;
        return {
            key: 'svg',
            val: {
                new : "g",
                class : "thereminStave",
                id : dataobj.id,
                children : [
                    {   // top stave layer for events
                        new : "g",
                        id : dataobj.id + "-events",
                        class : "stave_events"
                    },
                    {
                        new : "g",
                        class : "thereminStave-display",
                        children : [{
                            new : "rect",
                            class : "thereminStaff",
                            x : x,
                            width : width,
                            y : y,
                            height : height
                        },
                        {
                            new : "line",
                            class : "thereminClef",
                            x1 : x + 10,
                            y1 : y,
                            x2 : x + 10,
                            y2 : y + height
                        }]   
                    }
                ]
            }
            
        }
    },

    newFromClick: function(gui_event, data_context) {
        return {
            class : "thereminStave",
            id : gui_event.id,
            offsetInParent : {
                x : gui_event.xy[[0]],
                y : gui_event.xy[[1]]
            },
            timeStart : 0.,
            timeDur : 1., // seconds
            pitchRange : 127 // min implied as zero
        }
    },

    transform: function(_transformMatrix, viewobj){        
        const staff = sym_utils.getChildByValue(viewobj, "class", "thereminStaff")                
        const xy = sym_utils.applyTransform( _transformMatrix, [staff.x, staff.y] )
        return [
            {
                class : "thereminStave",
                id : viewobj.id,
                offsetInParent : {
                    x : xy[[0]],
                    y : xy[[1]]
                },
                timeStart : 0.,
                timeDur : 1., // seconds
                pitchRange : 127 // min implied as zero
            }
        ]
    },

    /*
    fromGUI: function (viewobj, gui_event, data_ref) {
        switch(gui_event.symbolistAction)
        {
            case "newFromClick_down":    
            // view object and current data value don't exist yet            
                return {
                    class : "thereminStave",
                    id : gui_event.id,
                    offsetInParent : {
                        x : gui_event.xy[[0]],
                        y : gui_event.xy[[1]]
                    },
                    timeStart : 0.,
                    timeDur : 1., // seconds
                    pitchRange : 127 // min implied as zero
                }
            break;
            case "transformed":
                console.log(viewobj);
                
                const transformMatrix = sym_utils.matrixFromString( viewobj.transform );
                const staff = sym_utils.getChildByValue(viewobj, "class", "thereminStaff")                
                const xy = sym_utils.applyTransform( [staff.x, staff.y] )
                return [
                    {
                        class : "thereminStave",
                        id : viewobj.id,
                        offsetInParent : {
                            x : xy[[0]],
                            y : xy[[1]]
                        },
                        timeStart : 0.,
                        timeDur : 1., // seconds
                        pitchRange : 127 // min implied as zero
                    }
                ]
                break;

        }

    },
        */

}