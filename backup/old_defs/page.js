const sym_utils = root_require('utils')

// note for using the `this` parameter, you need to use the function(){} defition not () => {}

module.exports = {

    class: 'page',

    palette : [], // placeholder for palette of possible child symbols

    paramTypes : {
        x: "Number",
        y: "Number",
        width: "Number",
        height: "Number"
    },

    defaults: {
        x: 0,
        y: 0,
        width: 800,
        height:600
    },

    scalar : {},
    map : {},


    // sorts children by spatial position, top to bottom, left to right
    comparator: (a, b) => {
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1));
    },
    
// onclick should be the same for all the icons, so move it out of here later
    getStaveIcon: () => ({
        view: {
            key: "html",
            val: {
                new: "div",
                id: "page-paletteIcon",
                parent: "palette-clefs",
                onclick: `
                        console.log('select page'); 
                        symbolist.setClass('page');
                    `,
                child: {
                    new: "img",
                    id: "page-display",
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
        
        const x = view_context.bbox.x + dataobj.offsetInParent_x + this.scalar.time2pix * dataobj.time; // sorting of staves?
        const width = (this.scalar.time2pix * dataobj.time) + (this.scalar.time2pix * dataobj.duration);        
        const y = view_context.bbox.y + dataobj.offsetInParent_y; // << obviously we're not done here
        const height = this.scalar.pitch2pix * dataobj.pitchRange;

        return {
            view: {
                key: 'svg',
                val: {
                    new : "g",
                    class : "page stave",
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
                class : "page",
                id : gui_event.id,
                children: this.children,
                offsetInParent_x : gui_event.xy[0],
                offsetInParent_y : gui_event.xy[1],
                time : 0.,
                duration : 1., // seconds
                pitchRange : 127 // min implied as zero
            }
        }
    },

    transform: function(_transformMatrix, viewobj, _data_context, view_context) {        
        const staff = sym_utils.getChildByValue(viewobj, "class", "thereminStaff")                
        const xy = sym_utils.applyTransform( _transformMatrix, [staff.x, staff.y] )
        return {
            data : {
                class : "page",
                id : viewobj.id,
                offsetInParent_x : xy[0],
                offsetInParent_y : xy[1],
                time : 0.,
                duration : 1., // seconds
                pitchRange : 127 // min implied as zero
            }
        }
    }

}