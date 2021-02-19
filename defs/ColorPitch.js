const Template = require('../lib/SymbolTemplate') 

class ColorPitch extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "ColorPitch";
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                pitch: 55,
                duration: 0.1
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                r: 2,
                color: 'rgba(255,0,255,1)'
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        console.log('test', params);

        return {
            new: "circle",
            class: 'notehead',
            id: `${params.id}-notehead`,
            cx: params.x,
            cy: params.y,
            r: params.r,
            style: {
                fill: params.color
            }
        }

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const circle = element.querySelector('.notehead');
        const x = parseFloat(circle.getAttribute('cx'));
        const y = parseFloat(circle.getAttribute('cy'));
        const r = parseFloat(circle.getAttribute('r'));
        const color = circle.style.fill;

        return {
            id: element.id,
            x,
            y,
            r,
            color
        }

    }

    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                id: `${this.class}-palette-icon`,
                class: this.class,
                x: 10,
                y: 10,
                r: 2,
                color: 'rbga(255, 0, 255, 1)'
            })
        }
    }

    dataToViewParams(data, container)
    {
        const parentDef = ui_api.getDefForElement(container);
        
        let color_val = (data.pitch / 127.) * 255;
        let color = `rgba( ${color_val}, 0, 255, 1)`;

        return {
            ...this.structs.view, // defaults
            ...ui_api.filterByKeys(data, Object.keys(this.structs.view) ), // gets view values that might in the data
            ...parentDef.childDataToViewParams(container, data),
            
            // other mappings that the parent doesn't know about might be added here
            color,
            id: data.id,
            container: data.container // set container/parent id
        }
     
    }

    /**
     * API function called from controller
     * 
     * @param {Element} element html/svg element to translate
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    drag(element, delta_pos = {x:0,y:0}) 
    {
        if( this.m_mode == "edit" )
        {
            //console.log('drag in edit mode');
        }
        else
        {
         //   console.log('drag in mode', this.m_mode);

            // maybe rename... sets translation in transform matrix, but doesn't apply it
            ui_api.translate(element, delta_pos);

            let viewParams =  this.getElementViewParams(element);

            // this can be resused in most cases
            // if x and y are in the viewParams
            viewParams.x += delta_pos.x;
            viewParams.y += delta_pos.y;

            let container = ui_api.getContainerForElement(element);
            let data = this.viewParamsToData(viewParams, container);


            /**
             * in thia example, we wanted to update the color of the notehead
             * so we used the dataToViewParams function to do the mapping from
             * pitch to color, and then update the notehead color from the mouse 
             * interaction. 
             * 
             * Since the mapping is from pitch to color only (not color to pitch), 
             * we didn't need to add the mapping in viewParamsToData.
             * 
             */
            let newView = this.dataToViewParams(data, container);

            /**
             * note that usually we would make a preview of the change from dragging
             * and not change the actual value of the symbol until mouse up, which then
             * calls the applyTransformToData function. 
             * 
             * But for the color example we are setting the notehead value directly, so the
             * value has already been updated when the applyTransformToData function is called.
             * 
             */
            let updateColor = {
                key: "svg",
                val: {
                    id: `${data.id}-notehead`,
                    style: {
                        fill: newView.color
                    }
                }
            };

            console.log('updating color', updateColor );

            ui_api.drawsocketInput([
                updateColor,
                ui_api.getDataTextView(data)
            ])
        }

       
        return true; // return true if you are handling your own translation
    }


}

class ColorPitch_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "ColorPitch";
    }
    
}



module.exports = {
    ui_def: ColorPitch,
    io_def: ColorPitch_IO    
}

