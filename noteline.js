const thereminClef = require('./thereminClef')

// inheriting clef base values
let noteline = thereminClef;

module.exports = {

    class : "noteline",

    map : thereminClef.map,

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