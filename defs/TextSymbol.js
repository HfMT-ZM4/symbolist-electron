const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 

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

    /**
     * 
     * API function called from controller
     * 
     * @param {Element} element 
     * 
     * called after child object has been added from the score
     * in order to adjust drawing of the container element
     * 
     */
    updateAfterContents( element ) {
        console.log('updateAfterContents');
        const t = element.querySelector(`.display .textarea`);
        const bbox = ui_api.getBBoxAdjusted(t);
        let wrapper = element.querySelector(`.display .htmlWrapper`);
        let textWrapper = element.querySelector(`.display .textWrapper`);
        textWrapper.style.height = (t.scrollHeight+2)+"px";

        wrapper.setAttributeNS(null, "height", (t.scrollHeight+2)+"px");
       // wrapper.setAttributeNS(null, "height", bbox.height+7);
        wrapper.setAttributeNS(null, "width", bbox.width+2);
    }
    
    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );

        return {
            new: "foreignObject",
            id: `${params.id}-htmlWrapper`,
            class: "htmlWrapper",
            x: params.x,
            y: params.y,
            width: "100%",
            height: "100%",
            children: {
                new: "html:div",
                id: `${params.id}-textWrapper`,
                class: "textWrapper",
                ondblclick: () => {

                   // this.editMode(document.getElementById(`${params.id}`), true );

                    let t = document.getElementById(`${params.id}-textarea`);
                    console.log('dbclick', t);
                    t.removeAttribute('disabled'); 
                    t.focus();
                },
                children: {
                    new: "html:textarea",
                    id: `${params.id}-textarea`,
                    class: "textarea",
                    disabled: "true",
                    style: {
                        height: `16px`
                    },
                    oninput: () => {
                        let t = document.getElementById(`${params.id}-textarea`);
                        t.style.height = 0;
                        t.style.height = t.scrollHeight + "px";

                        let wrapper = document.getElementById(`${params.id}-htmlWrapper`);
                        wrapper.setAttributeNS(null, "height", t.style.height);
                    }, 
                    onblur: () => {
                        console.log('out');
                        document.getSelection().removeAllRanges();
                        let t = document.getElementById(`${params.id}-textarea`);
                        t.disabled = true; 
                    },
                    text: params.text
                }
            } 
        }
    }
    
    getElementViewParams(element) {

        const textEdit = element.querySelector('.display .htmlWrapper');
        const x = parseFloat(textEdit.getAttribute('x'));
        const y = parseFloat(textEdit.getAttribute('y'));

        const text = textEdit.querySelector('.textarea');
        //console.log('getElementViewParams', textEdit, text.value);
        return {
            id: element.id,
            x,
            y,
            text: text.value
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

    fromData(dataObj, container, preview = false)
    {
        super.fromData(dataObj, container, preview);

        if(!preview){
            console.log(dataObj, document.getElementById(dataObj.id));
            this.updateAfterContents( document.getElementById(dataObj.id) );
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

    // here we're avoiding asking the parent for information
    // but still using the template system
    // probably it would be better to stick to the template, and
    // create a graphic only container
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

