
const sym_utils = require('./utils')


function ThereminStave(){

    this.class = 'thereminClef'

    this.defaults = {
        offsetInParent: {
            x: 0,
            y: 0
        },
        timeStart: 0,
        timeDur: 1,
        pitchRange: 127
    }


    this.scalar = {
        time2pix : 1000.,
        pix2time : 0.001,
        pitch2pix : (400. / 127.),
        pix2pitch : (127. / 400.)
    }
    
    this.map = {
        // this does't work here
        x2time : (clefdata, clefview, x) => {            
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return clefdata.timeStart + ((x - rect.x) * this.scalar.pix2time);
        },
            
        time2x : (clefdata, clefview, x) => {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return rect.x + ((t - clefdata.timeStart) * this.scalar.time2pix);
        },

        y2pitch : (clefdata, clefview, y) => {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return (rect.y + rect.height - y) * this.scalar.pix2pitch
        },

        pitch2y : (clefdata, clefview, pitch) => {
            const rect = sym_utils.getChildByValue(clefview, 'class', 'thereminStaff');
            return rect.y + rect.height - (pitch * this.scalar.pitch2pix)
        }

    }

    this.getIcon = () => ({
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
    })

    this.fromData = (dataobj, view_ref, context_data_ref) => {
        const x = view_ref.bbox.x + dataobj.offsetInParent.x + this.scalar.time2pix * dataobj.timeStart; // sorting of staves?
        const width = (this.scalar.time2pix * dataobj.timeStart) + (this.scalar.time2pix * dataobj.timeDur);
        const y = view_ref.bbox.y + dataobj.offsetInParent.y; // << obviously we're not done here
        const height = this.scalar.pitch2pix * dataobj.pitchRange;
        return {
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
                }]
        }
    },

    this.fromGUI = (viewobj, gui_event, data_ref) => {
        switch(gui_event.symbolistAction)
        {
            case "newFromClick_down":
                console.log('yoooo');
                
                return {
                    class : "thereminStave",
                    id : gui_event.id,
                    offsetInParent : {
                        x : gui_event.xy[[0]],
                        y : gui_event.xy[[1]]
                    },
                    timeStart : 0.,
                    timeSur : 1., // seconds
                    pitchRange : 127 // min implied as zero
                }
            break;

        }
    }


}

module.exports = { ThereminStave }
