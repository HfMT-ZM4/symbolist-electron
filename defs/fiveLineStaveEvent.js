const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 


// to do: move the lookup to the stave

const accidentalLookup = {
    flat : "&#xE260",
    natural: "&#xE261",
    sharp: "&#xE262",

// lowered 3rds for numerator (overtone) 

    'flat-5^1o': "&#xE2C2",
    'natural-5^1o': "&#xE2C1",
    'sharp-5^1o': "&#xE2C3",

    'flat-5^2o': "&#xE2CB",
    'natural-5^2o': "&#xE2CC",
    'sharp-5^2o': "&#xE2CD",

    'flat-5^3o': "&#xE2CB",
    'natural-5^3o': "&#xE2CC",
    'sharp-5^3o': "&#xE2CD",

// raised 3rds for denominator (undertone) (4/5, 16/25, 64/125)
    'flat-5^1u': "&#xE2C6",
    'natural-5^1u': "&#xE2C7",
    'sharp-5^1u': "&#xE2C8",

    'flat-5^2u': "&#xE2D0",
    'natural-5^2u': "&#xE2D1",
    'sharp-5^2u': "&#xE2D2",

    'flat-5^3u': "&#xE2DA",
    'natural-5^3u': "&#xE2DB",
    'sharp-5^3u': "&#xE2DC",

// 7ths

    '7^1o': "&#xE2DE",
    '7^2o': "&#xE2E0",

    '7^2u': "&#xE2DF",
    '7^2u': "&#xE2E1",

// 11ths

    '11^1u': "&#xE2E2",
    '11^1o': "&#xE2E3",

// 13th
    '13^1o': "&#xE2E4",
    '13^1u': "&#xE2E5"
}


class FiveLineStaveEvent extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "FiveLineStaveEvent";
        this.default_dist = 10;
        this.palette = ["PathSymbol"];
/*
        this.font = opentype.loadSync('css/fonts/Bravura.ttf');
        //console.log(this.font.glyphs.length);

        this.bravuraUnicode = new Map();

        for(let i = 0; i < this.font.glyphs.length; i++)
        {
            this.bravuraUnicode.set(this.font.glyphs.get(i).name, this.font.glyphs.get(i));
        }
*/
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                midi: 55,
                duration: 0.1,
                accid: "natural"

            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                r: 2,
                width: 100,
                ledgerLine_y: 0,
                accidental: false
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        let obj = [{
            id: `${params.id}-notehead`,
            new: "circle",
            class: "notehead",
            cx: params.x,
            cy: params.y,
            r: params.r
        },
        {
            new: "line",
            id: `${params.id}-duration`,
            class: "duration-line",
            x1: params.x,
            y1: params.y,
            x2: params.x + params.width, 
            y2: params.y
        }];

        if( params.accidental )
        {
            let oldAcc = document.getElementById(`${params.id}-accidental`);

            obj.push({
                new: "text",
                id: `${params.id}-accidental`,
                text : accidentalLookup[params.accidental], //(accidental == "sharp" ? "&#xE262" : "&#xE260"),
                class: "accidental",
                x : params.x - 15,
                y : params.y
            })

        }
        else
        {
            let oldAcc = document.getElementById(`${params.id}-accidental`);
            if( oldAcc )
                oldAcc.remove();
        }

        let ledgerLine_g_exists = document.getElementById(`${params.id}-ledgerLines`);
        if( ledgerLine_g_exists )
        {
            ui_api.drawsocketInput({
                key: "clear",
                val: `${params.id}-ledgerLines`
            })
        }

        if( params.ledgerLine_y.length > 0 )
        {
            let ledgerLine_g = {
                new: "g",
                id: `${params.id}-ledgerLines`,
                children: []  
            }

            params.ledgerLine_y.forEach( ledge_y => {
                ledgerLine_g.children.push({
                    new: "line",
                    class : "staffline",
                    x1: params.x - 15,
                    x2: params.x + 15,
                    y1: ledge_y,
                    y2: ledge_y
                })
            })

            obj.unshift( ledgerLine_g );

          //  console.log('ledgerLine_g', obj);

        }

    

        return obj;

    }
    
    getElementViewParams(element) {

        const notehead = element.querySelector('.notehead');
        const durationLine = element.querySelector('.duration-line');

        const x = parseFloat(notehead.getAttribute('cx'));
        const y = parseFloat(notehead.getAttribute('cy'));
        const x2 = parseFloat(durationLine.getAttribute('x2'));

        const width = x2 - x;

        return {
            id: element.id,
            x,
            y,
            width
            // ledgerlines
            // accidental ...
        }
    }


    /**
     * 
     * Called by child objects using the template
     * the parent/container object supplies a mapping from view params to data
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     */
    childViewParamsToData(this_element, child_viewParams) 
    {
//        return child_viewParams;
        // absolute to relative
        if( ui_api.hasParam(child_viewParams, ['points'], true) )
        {
            const notehead = this_element.querySelector('.display .notehead');
            const cx = parseFloat(notehead.getAttribute('cx'));
            const cy = parseFloat(notehead.getAttribute('cy'));

           console.log('childViewParamsToData', Points.offset(child_viewParams.points, -cx, -cy));

            return {
                points: Points.offset(child_viewParams.points, -cx, -cy)
            }
        }
        else if( ui_api.hasParam(child_viewParams, ['x', 'y'], true) )
        {
            const notehead = this_element.querySelector('.display .notehead');
            const cx = parseFloat(notehead.getAttribute('cx'));
            const cy = parseFloat(notehead.getAttribute('cy'));

            return {
                x: child_viewParams.x - cx,
                y: child_viewParams.y - cy
            }
        }

        
    }

    
    /**
     * API function called from controller to draw new data objects
     * also used internally
     * 
     * @param {Object} dataObj 
     * @param {Element} container 
     * @param {Boolean} preview -- optional flag to draw as sprite overlay and draw data text
     * 
     */
    fromData(dataObj, container, preview = false)
    {
        // merging with defaults in case the user forgot to include something
        const data_union = {
            ...this.structs.data,
            ...dataObj
        };
        
        const viewParams = this.dataToViewParams(data_union, container);
        const viewObj = this.display(viewParams);        
        const drawObj = (preview ? 
            ui_api.svgPreviewFromViewAndData(viewObj, data_union, `.notehead`) : 
            ui_api.svgFromViewAndData(viewObj, data_union) );
        ui_api.drawsocketInput( drawObj );
    }



     /**
     * 
     * Called by child objects using the template
     * the parent/container object supplies a mapping from data to view params
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     * 
     */
    childDataToViewParams(this_element, child_data) 
    {
      //  console.log('FiveLine event childDataToViewParams', child_data, ui_api.hasParam(child_data, 'points'));
 //       return child_data;
        // relative to absolute
        if( ui_api.hasParam(child_data, 'points') )
        {
            const notehead = this_element.querySelector('.display .notehead');
            const cx = parseFloat(notehead.getAttribute('cx'));
            const cy = parseFloat(notehead.getAttribute('cy'));

     //       console.log('true????', child_data.points, cx, cy);
     //       console.log('no?', Points.offset(child_data.points, cx, cy));
            return {
                points: Points.offset(child_data.points, cx, cy)
            }
        }
        else if( ui_api.hasParam(child_data, ['x', 'y'], true) )
        {
            const notehead = this_element.querySelector('.display .notehead');
            const cx = parseFloat(notehead.getAttribute('cx'));
            const cy = parseFloat(notehead.getAttribute('cy'));

            return {
                x: child_data.x + cx,
                y: child_data.y + cy
            }
        }
         

    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                id: `${this.class}-icon`,
                class: this.class,
                x: 25,
                y: 25,
                r: 2,
                width: 35,
                ledgerLine_y: [],
                accidental: false            
            })
        }
    }
    
    paletteSelected( enable = false ) 
    {
        console.log('FiveLineStaveEvent paletteSelected', enable);
        super.paletteSelected(enable);
    }

    drag(element, event) 
    {
        const container = ui_api.getContainerForElement(element);
        const stepSpacing = parseFloat(container.dataset.lineSpacing) * 0.5;

        const snapPt = {
            x: event.delta_pos.x,
            y: Math.floor(event.delta_pos.y / stepSpacing) * stepSpacing
        }

        //console.log('container', container, delta_pos.y, parseFloat(container.dataset.lineSpacing) / 2., y2midi(delta_pos.y));
        ui_api.translate(element, snapPt);

        let viewParams = this.getElementViewParams(element);

        viewParams.x += snapPt.x;
        viewParams.y += snapPt.y;

        let data = this.viewParamsToData(viewParams, container);
        ui_api.drawsocketInput(
            ui_api.getDataTextView(data)
        )

       
        return true; // return true if you are handling your own translation
    }
   
    editMode( element, enable = false )
    {
        super.editMode(element, enable);
        
        if( enable )
        {
            ui_api.createHandle( 
                // element to use for reference
                element, 
                // xy attrs to use for the handle
                { selector: `#${element.id} .duration-line`, x: "x2", y: "y2"},
                // callback function
                (element_, event) => {

                    let container = ui_api.getContainerForElement(element_);
                    const parentDef = ui_api.getDefForElement(container);

                    const line = element_.querySelector('.duration-line');
                    const x = parseFloat(line.getAttribute('x1'));
                    const y = parseFloat(line.getAttribute('y1'));
                    
                    let mousePt = ui_api.getSVGCoordsFromEvent(event);
                    let width = mousePt.x - x;

                    let dataObj = this.viewParamsToData({
                        x, y, width
                    }, container);

                    element_.dataset.duration = dataObj.duration;

                    this.updateFromDataset(element_);

                }
            );
        }


        return true; // << required if defined
    }


}




class FiveLineStaveEvent_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "FiveLineStaveEvent";
    }

    getFormattedLookup( params, obj_ref )
    {
        return {
            time: obj_ref.time,
            duration: obj_ref.duration,
            midi: obj_ref.midi
        }
    }
    
}


module.exports = {
    ui_def: FiveLineStaveEvent,
    io_def: FiveLineStaveEvent_IO
}