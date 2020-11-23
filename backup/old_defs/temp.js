// dual version

const sym_utils = root_require('utils')

/**
 * Exports used by the controller or UI (the script is used in both contexts)
 */

/**
 * className : name of class
 */
const className = 'threeLineStave'


/**
 * paramTypes : object containing types, these will be used to cast the values from strings
 */
const paramTypes = {
    offsetInParent_x: "Number", 
    offsetInParent_y: "Number",
    timeStart: "Number",
    timeDur: "Number"
}
// note: the offset in parent here is a little confusing because it is a view parameter.. but there is no rule against it
// eventually if there is a 'page' context, the child stave would probably be automatically calculated from that

/**
 * palette : placeholder array to hold child symbols
 *              not really used very extensively now, this could possibly replace 
 *                  or be replaced by palette in json file
 */
let palette = []


/**
 * local defaults for use by this class
 */
const defaults = {
    offsetInParent_x: 0,
    offsetInParent_y: 0,
    timeStart: 0,
    timeDur: 1,
    stafflineSpacing: 5
}

const scalar = {
    time2pix : 1000.,
    pix2time : 0.001
}

function svgView( start_cx, start_cy, end_cx )
{
    return [{
                new : "line",
                class : "threeLineStave-start",
                x1 : start_cx,
                y1 : start_cy - defaults.stafflineSpacing,
                x2 : start_cx,
                y2 : start_cy + defaults.stafflineSpacing,
                style: {
                    stroke: "white"
                }
            },
            {
                new : "line",
                class : "threeLineStave-staffline-1",
                x1 : start_cx,
                y1 : start_cy - defaults.stafflineSpacing,
                x2 : end_cx,
                y2 : start_cy - defaults.stafflineSpacing,
                style: {
                    stroke: "white"
                }
            },
            {
                new : "line",
                class : "threeLineStave-staffline-2",
                x1 : start_cx,
                y1 : start_cy,
                x2 : end_cx,
                y2 : start_cy,
                style: {
                    stroke: "white"
                }
            },
            {
                new : "line",
                class : "threeLineStave-staffline-3",
                x1 : start_cx,
                y1 : start_cy + defaults.stafflineSpacing,
                x2 : end_cx,
                y2 : start_cy + defaults.stafflineSpacing,
                style: {
                    stroke: "white"
                }
            }]
}


module.exports = { 
    controller: {


    /**
     * map : object holding mapping functions
     * 
     * if the view is doing the view-to-data mapping, this would be handled differently
     * maybe it's still better to do it all from the controller, becuase then we don't have to 
     * calculate the parent's data information to do the mapping
     * 
     * so maybe the top level exports should be 
     * controller: {},
     * view: {}
     * 
     * 
     * running on the controller the mapping functions get passed the data object and 
     * corresponding the view object, captured in the mouse event
     * 
     * exported because child symbols will use the same mapping rules
     * and have their values be based on the mappings of the stave (but could also include other parameters)
     * 
     */
        map: {

            x2time : function(data, view, x) { 
                const staffline = sym_utils.getChildByValue(view, 'class', 'basic-staffline');            
                return data.timeStart + ((x - staffline.x1) *  0.001);
            },
                
            time2x : function(data, view, t) {
                const staffline = sym_utils.getChildByValue(view, 'class', 'basic-staffline');
                return staffline.x1 + ((t - data.timeStart) * 1000);
            },
        },


    /**
     * sortDataComparator : used for sorting objects using data parameters
     * in the simplest case this could be time
     */
        sortDataComparator: (a, b) => {
            return a.time < b.time;
        },


        getStaveIcon: () => {
            return {
                view: {
                    key: "html",
                    val: {
                        new: "div",
                        id: "threeLineStave-palette-div",
                        parent: "palette-clefs",
                        onclick: `
                                console.log('select threeLineStave'); 
                                symbolist.setClass('threeLineStave');
                            `,
                        children : {
                            new : "svg",
                            id : "threeLineStave-icon",
                            style : {
                                height : 20,
                                width : 16,
                                top : "calc(50% - 2px)",
                                left : "calc(50% - 8px)"
                            },
                            children : svgView(0, 10, 16, 'threeLineStave-palette-display')
                        }
                    }
                }
            }
        },

        getInfoDisplay: function(dataobj, view_bbox) {
            return {
                view: sym_utils.make_default_infoDisplay(dataobj, view_bbox)
            }
        },


        fromData: (dataobj, data_context, view_context ) => {
            //console.log('input dataobj', dataobj, 'view ref', view_context);
            
            const x = view_context.bbox.x + dataobj.offsetInParent_x + scalar.time2pix * dataobj.timeStart; // sorting of staves?
            const width = (scalar.time2pix * dataobj.timeStart) + (scalar.time2pix * dataobj.timeDur);        
            const y = view_context.bbox.y + dataobj.offsetInParent_y; // << obviously we're not done here

            return {
                view: {
                    key: 'svg',
                    val: {
                        new : "g",
                        class : "threeLineStave stave",
                        id : dataobj.id,
                        children : [
                            {  // first layer for stave display
                                new : "g",
                                class : "stave_display",
                                id: dataobj.id + "-display",
                                children : svgView(x, y, x+width) 
                            },
                            {   // top layer for stave events
                                new : "g",
                                class : "stave_content",
                                id : dataobj.id + "-events"
                            }
                        ]
                    }
                    
                }
            }
        }
    },

    view: {



        enter: () => {},

        exit: () => {},



    }
}