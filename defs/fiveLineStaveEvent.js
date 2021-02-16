const Template = require('../lib/symbol-template') 


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
        //this.default_duration = 0.1;
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

            console.log('ledgerLine_g', obj);

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
    
    drag(element, delta_pos = {x:0,y:0}) 
    {

        const container = ui_api.getContainerForElement(element);
        const stepSpacing = parseFloat(container.dataset.lineSpacing) * 0.5;

        const snapPt = {
            x: delta_pos.x,
            y: Math.floor(delta_pos.y / stepSpacing) * stepSpacing
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