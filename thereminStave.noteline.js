const thereminClef = require('./thereminStave')

// inheriting clef base values
let noteline = thereminClef;

module.exports = {

    class : "thereminStave.noteline",

    default : {
        start: 0,
        dur : 100,
        amp : 1
    },
    
    scalar : { ... thereminClef.scalar},

    map : { ...thereminClef.map, ... { 
        amp2r: function(amp) {
            return (amp / 100) * 15 + 5; //scale(dataobj./amp, 0., 100, 5., 20.),
        }
    }},

    getEventIcon: () => ({
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
    }),


    fromData: function(dataobj, view_context, context_data_ref) {

        console.log('noteline fromData:', dataobj);
        
        const r = this.map.amp2r(dataobj.amp);
        const y = this.map.pitch2y( context_data_ref, view_context, dataobj.pitch);
        const x1 = this.map.time2x( context_data_ref, view_context, dataobj.time);
        const x2 = this.map.time2x( context_data_ref, view_context, dataobj.time + dataobj.dur);

        return {
            key: 'svg',
            val: {
                new : "g",
                class : "thereminStave.noteline",
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
                        y2 : y
                    }
                ]
            }
        }
    },

     newFromClick: function(gui_event, data_context) {
         console.log('newFromClick', gui_event, data_context);
         
         return {
            class : "thereminStave.noteline",
            id : gui_event.id,
            time : this.map.x2time( data_context, gui_event.context, gui_event.xy[[0]] - this.map.amp2r(this.default.amp) ),
            pitch : this.map.y2pitch( data_context, gui_event.context, gui_event.xy[[1]] ),
            dur : this.default.dur,
            amp : this.default.amp
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
                 time : 0.,
                 dur : 1., // seconds
                 pitchRange : 127 // min implied as zero
             }
         ]
     },



}