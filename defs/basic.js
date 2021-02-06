
'use strict';


const className = "basic";


const ui_def = function( ui_api ) 
{

    function getPaletteIcon()
    {
        return {
            key: "svg",
            val: {
                new: "circle",
                id: `circle-palette-icon`,
                cx: 10,
                cy: 10,
                r: 4,
                fill: "red"
            }
        }
    }

    function paletteSelected (enable = false) {
        
    }

    /**
     * 
     * @param {Object} dataObj data object
     * @param {SVG/HTML Element} container 
     */
    function fromData(dataObj, container)
    {
        let rect = document.getElementById(`${container.id}-rect`)
        let bbox = ui_api.getBBoxAdjusted(rect);

//        let containerDef = ui_api.getDefForElement(container);
//        let offset = containerDef.getContainerPositionFromData(dataObj);
        
        console.log(dataObj);

        ui_api.drawsocketInput({
            key: "svg",
            val: {
                new: "circle",
                id: dataObj.id,
                parent: `${container.id}-contents`,
                cx: dataObj.thumb + bbox.x,
                cy: dataObj.thumb + bbox.y,
                r: 4,
                fill: "red"
            }
        })

    }



    return {
        class: className,
       
        fromData,

    }

}

module.exports = {
    ui_def
}

