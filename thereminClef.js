const sym_utils = require('./utils')

// note for using the `this` parameter, you need to use the function(){} defition not () => {}

module.exports = {

    class: 'thereminClef',

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
            return clefdata.timeStart + ((x - rect.x) * this.scalar.pix2time);
        },
            
        time2x : function(clefdata, clefview, x) {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return rect.x + ((t - clefdata.timeStart) * this.scalar.time2pix);
        },

        y2pitch : function(clefdata, clefview, y) {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return (rect.y + rect.height - y) * this.scalar.pix2pitch
        },

        pitch2y : function(clefdata, clefview, pitch) {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return rect.y + rect.height - (pitch * this.scalar.pitch2pix)
        }

    },

// onclick should be the same for all the icons, so move it out of here later
    getIcon: () => ({
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

    newFromClick: function(gui_event) {
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


    palette: {

        noteline: {

            getIcon: () => ({
                key : "html",
                val : {
                    new : "div",
                    id : "thereminStave.noteline-paletteIcon",
                    parent : "palette-symbols",
                    onclick : `
                        console.log('select noteline'); 
                        symbolist.setClass('thereminStave.noteline');
                    `,
                    children : {
                        new : "svg",
                        id : "noteline-icon",
                        style : {
                            height : 4,
                            width : 16,
                            top : "calc(50% - 2px)",
                            left : "calc(50% - 8px)"
                        },
                        children : {            
                            new : "g",
                            class : "noteline",
                            parent : "noteline-icon",
                            children : [
                                {
                                    new : "circle",
                                    class : "notehead",
                                    fill : "white",
                                    r : 2,
                                    cy : 0,
                                    cx : 0
                                },
                                {
                                    new : "line",
                                    class : "durationLine",
                                    stroke: "white",
                                    x1 : 0,
                                    y1 : 0,
                                    x2 : 16,
                                    y2 : 0
                                }
                            ]
                        }
                    }
                
                }
            })

        }
    }
}