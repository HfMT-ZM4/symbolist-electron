const Template = require('./SymbolTemplate') 

class BasicSymbolOverridePreview extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "BasicSymbolOverridePreview";
    }


    get structs () {
        return {

            data: {
                class: this.class,      // required for all instances
                id : `${this.class}-0`, // required (unique) for all instances
                time: 0,                // optional defaults for each class type
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

        ui_api.hasParam(params, Object.keys(this.structs.view) ); // check that all view params are present 
        
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

        let infoBoxChildren = [];

        let showData = ui_api.filterDataset(dataObj);
        let id = dataObj.id;
        let dataKeys = Object.keys(showData);

        dataKeys.map(param => {
            infoBoxChildren = infoBoxChildren.concat( [{
                new : "label",
                class : "infoparam",
                for : id+"-"+param+"-input",
                text : param
            }, {
                new : "input",
                class : "infovalue",
                type : "text",
                id : id+"-"+param+"-input",
                value : showData[param],
            }] )
        });
        
        return {
            key : "html",
            val : {
                parent : "floating-forms",
                new : "div",
                relativeTo : (relativeTo ? relativeTo : `#${id}`),
                id : id+"-infobox",
                class : "infobox sprite",
                children : infoBoxChildren
            }
        }

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

        if( !preview ) {
            let outObj = {};
            outObj[dataObj.id] = viewParams;
            ui_api.outlet({ viewParams: outObj });
        }

    }


}

class BasicSymbolOverridePreview_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "BasicSymbolOverridePreview";
    }
    
}



module.exports = {
    ui_def: BasicSymbolOverridePreview,
    io_def: BasicSymbolOverridePreview_IO    
}

