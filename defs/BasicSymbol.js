const Template = require('./SymbolTemplate') 

class BasicSymbol extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "BasicSymbol";
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
                r: 2
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "circle",
            class: 'notehead',
            id: `${params.id}-notehead`,
            cx: params.x,
            cy: params.y,
            r: params.r
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

        return {
            id: element.id,
            x,
            y,
            r
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
                r: 2
            })
        }
    }


    getDataTextView(dataObj, relativeTo = null)
    {

        let ret = {};
        ret.key = "svg";
        ret.val = [];

        Object.keys(dataObj).forEach( key => {
            ret.val.push({  
                new: "text",
                class: "data_text sprite",
                container: `symbolist_overlay`,
                relativeTo : (relativeTo ? relativeTo : `#${dataObj.id}`),
                id: `${dataObj.id}-${key}-data_text`,
                x: 0,
                y: -20,
                text: key + String(dataObj[key])
            })
        });

        console.log(ret);

        return ret;
    }
    
    svgPreviewFromViewAndData(view, dataObj, relativeTo = null)
    {
        let drawing = ui_api.svgFromViewAndData(view, 
            {
                ...dataObj,
                class: `${dataObj.class} sprite`, // << sprite flags the object to be deleted
                id: `${dataObj.class}-sprite`,
                container: 'symbolist_overlay' // << temp overlay layer gets cleared also
            }, 
            true /* overwrite*/ 
        );
        
        if( relativeTo )
        {
            relativeTo = `#${dataObj.class}-sprite ${relativeTo}`;
        }
            
        let text_drawing = this.getDataTextView({
            ...dataObj,
            id: `${dataObj.class}-sprite`
        }, relativeTo );
    
        return [ drawing, text_drawing ];
    }


    fromData(dataObj, container, preview = false)
    {
      //  console.log('template fromData', container, dataObj);
        // merging with defaults in case the user forgot to include something
        const data_union = {
            ...this.structs.data,
            ...dataObj
        };
        
        const viewParams = this.dataToViewParams(data_union, container);
        
        const viewObj = this.display(viewParams);        
        
        const drawObj = (preview ? 
            this.svgPreviewFromViewAndData(viewObj, data_union) : 
            ui_api.svgFromViewAndData(viewObj, data_union) );

        ui_api.drawsocketInput( drawObj );
    }


}

class BasicSymbol_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "BasicSymbol";
    }
    
}



module.exports = {
    ui_def: BasicSymbol,
    io_def: BasicSymbol_IO    
}

