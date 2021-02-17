const Template = require('../lib/symbol-template') 

class TextSymbol extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "TextSymbol";
    }

    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                text: "",
                x: 55,
                y: 0.1
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                text: "",
                x: 55,
                y: 0.1
            }
        }
    }

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );

        return {
            new: "foreignObject",
            id: `${params.id}-foreign`,
            x: params.x,
            y: params.y,
            width: "100%",
            height: "100%",
            children: {
                new: "html:div",
                id: `${params.id}-textWrapper`,
                class: "textWrapper",
                ondblclick: function() {
                    let t = this.querySelector('textarea');
                    console.log('dbclick', t);
                    t.removeAttribute('disabled'); 
                },
                children: {
                    new: "html:textarea",
                    id: `${params.id}-textarea`,
                    class: "textarea",
                    disabled: "true",
                    oninput: function() {
                        this.style.height = "";
                        this.style.height = this.scrollHeight + "px";
                    }, 
                    onblur: function() {
                        console.log('out');
                        this.disabled = true; 
                    },
                    text: params.text
                }
            } 
        }
    }
    
    getElementViewParams(element) {

        const textEdit = element.querySelector('.display .textEdit');
        const x = parseFloat(textEdit.getAttribute('x'));
        const y = parseFloat(textEdit.getAttribute('y'));

        const text = textEdit.querySelector('.textarea').innerHTML;

        return {
            id: element.id,
            x,
            y,
            text
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
                text: "text"
            })
        }
    }

/*
    fromData(dataObj, container, preview = false)
    {
        const viewParams = this.dataToViewParams(dataObj, container);
        const viewObj = this.display(viewParams);        
        const drawObj = ui_api.htmlFromViewAndData(viewObj, dataObj);
        ui_api.drawsocketInput( drawObj );
    }
*/

    dataToViewParams(data, container)
    {
        data.container = container.id;
        return data;
    }

    viewParamsToData(viewParams, container)
    {
        viewParams.container = container.id;
        return viewParams;
    }

    mouseToData( event, container )
    {
        const pt = ui_api.getSVGCoordsFromEvent(event);

        return {
            ...this.structs.data, // set defaults, before overwriting with parent's mapping
            ...pt,
            id: `${this.class}_u_${ui_api.fairlyUniqueString()}`,
            container: container.id
        }    
    }

    
}

class TextSymbol_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "TextSymbol";
    }
    
}



module.exports = {
    ui_def: TextSymbol,
    io_def: TextSymbol_IO    
}

