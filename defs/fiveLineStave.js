const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 


const sharpSteps =          [ 0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6 ];
const flatSteps =           [ 0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7 ];
const chromaAccidList =     [ 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1 ];
//const midiMiddleLine =      71;


class FiveLineStave extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "FiveLineStave";
        this.palette = ["FiveLineStaveEvent" ];

        this.left_margin = 20;

        this.x2time = 0.001;
        this.time2x = 1000;

        this.midiMiddleLine = 71;

    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                duration: 1,
                height: 100,
                lineSpacing: 10
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                height: 100, 
                width: 100,
                lineSpacing: 10
            },

            children: {
                data: {
                    time: 0,
                    midi: 60,
                    duration: 1
                },
                view: {
                    x: 0,
                    y: 0,
                    width: 100
                }
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        let centerY = params.y + (params.height / 2);

        return [{
                new: "rect",
                id: `${params.id}-rect`,
                class: `staveBox`,
                x: params.x,
                y: params.y,
                width: params.width,
                height: params.height
            },{
                new: "text",
                id: `${params.id}-label`,
                class: 'staveLabel',
                x: params.x - this.left_margin,
                y: centerY,
                text: params.id
            }, {
                new: "image",
                id: `${params.id}-clef`,
                href: "defs/assets/g_clef.svg",
                x: params.x,
                y: params.y
        
            },
            {
                new: "g",
                id: `${params.id}-staffline-group`,
                children: [{
                    new: "line",
                    id: `${params.id}-line-1`,
                    class : "staffline",
                    x1: params.x,
                    y1: centerY - params.lineSpacing * 2,
                    x2: params.x + params.width,
                    y2: centerY - params.lineSpacing * 2
                },
                {
                    new: "line",
                    id: `${params.id}-line-2`,
                    class : "staffline",
                    x1: params.x,
                    y1: centerY - params.lineSpacing,
                    x2: params.x + params.width,
                    y2: centerY - params.lineSpacing
                },
                {
                    new: "line",
                    id: `${params.id}-line-3`,
                    class : "staffline",
                    x1: params.x,
                    y1: centerY,
                    x2: params.x + params.width,
                    y2: centerY
                },
                {
                    new: "line",
                    id: `${params.id}-line-4`,
                    class : "staffline",
                    x1: params.x,
                    y1: centerY + params.lineSpacing,
                    x2: params.x + params.width,
                    y2: centerY + params.lineSpacing
                },
                {
                    new: "line",
                    id: `${params.id}-line-5`,
                    class : "staffline",
                    x1: params.x,
                    y1: centerY + params.lineSpacing * 2,
                    x2: params.x + params.width,
                    y2: centerY + params.lineSpacing * 2
                }]
            }];

    }
    
    getElementViewParams(element) {

        const rect = element.querySelector('.staveBox');

        return {
            id: element.id,
            x: parseFloat(rect.getAttribute('x')),
            y: parseFloat(rect.getAttribute('y')),
            width: parseFloat(rect.getAttribute('width')),
            height: parseFloat(rect.getAttribute('height')),
            lineSpacing: parseFloat(element.dataset.lineSpacing)
        }

    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `fiveLine-palette-icon`,
                class: this.class
            })
        }
    }




    midi2y(midi, stepSpacing, accidentalType = "sharp")
    {
        const midiNote = midi - this.midiMiddleLine;
        let chroma = Math.floor(midiNote) % 12;
        if( chroma < 0 )
        {
            chroma += 12;
        }
        
        const octShift = Number(midiNote < 0);
        const oct = Math.floor( midiNote / 12 );

        // line offset from B natural

        const lineOffset = accidentalType == "sharp" ? sharpSteps : flatSteps; 

        const lineYoffset = lineOffset[ chroma ] * stepSpacing;
        const octaveYoffset = oct * (stepSpacing * 7);

//        console.log(chroma, lineYoffset, octaveYoffset);
        // add num ledgerlines here?

        const accidental = chromaAccidList[ chroma ] ? accidentalType : null;

        return {
            yOffset: octaveYoffset + lineYoffset,
            accidental
        }
    }

    // note, we don't have a good way to know whether a y point is an accidental or not...
    y2midi(y, container, accidentalType = "sharp")
    {
        const middleLine = document.getElementById(`${container.id}-line-3`);

        /*
            0.25 is a rough scalar since the actual position depends on the
            accidentals which aren't linear in the staff
        */
        const stepSize = container.dataset.lineSpacing * 0.25;

        const y_pix = parseFloat(middleLine.getAttribute('y1')) - y;
        
        const y_steps = Math.floor( y_pix / stepSize);

        return  this.midiMiddleLine + y_steps;

    }



    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data)
    {

        if( child_data.class == "Measure" || child_data.class == "SnapPoint" ){
           

            let ret = {};
            if( child_data.class == "Measure" )
            {
                const topLine = document.getElementById(`${this_element.id}-line-1`);
                const bottomLine = document.getElementById(`${this_element.id}-line-5`);
                
                ret.y = parseFloat(topLine.getAttribute('y1')); 
                let y2 =  parseFloat(bottomLine.getAttribute('y1'));
                ret.height = y2 - ret.y;

                ret.x = parseFloat(topLine.getAttribute('x1')) + ((child_data.time - parseFloat(this_element.dataset.time)) * this.time2x);
                ret.width = child_data.duration * this.time2x;

                
            }
            else
            {
                const containerRect = document.getElementById(`${this_element.id}-rect`);
                ret.y = parseFloat(containerRect.getAttribute('y')); 
                ret.x = parseFloat(containerRect.getAttribute('x')) + ((child_data.time - parseFloat(this_element.dataset.time)) * this.time2x);
            }

            return ret;

        }
        else if( ui_api.hasParam(child_data, ['time', 'duration', 'midi']) )
        {

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));
       
            const middleLine = document.getElementById(`${this_element.id}-line-3`);
            const lineSpacing = parseFloat(this_element.dataset.lineSpacing);
            const stepSize = lineSpacing * 0.5;

            // accidental type (sharp/flat) should be settable somewhere
            const pitchInfo = this.midi2y( Math.round(child_data.midi), stepSize, "sharp"); 
            const y = parseFloat(middleLine.getAttribute('y1')) - pitchInfo.yOffset;

            const n_ledgerLines = Math.floor( Math.abs(pitchInfo.yOffset) / lineSpacing) - 2;
            let sign = pitchInfo.yOffset < 0 ? -1 : 1;

            let starty = parseFloat(middleLine.getAttribute('y1')) - (lineSpacing * 3) * sign;

            let ledgerLine_y = [];
            for( let i = 0; i < n_ledgerLines; i++)
            {
                ledgerLine_y.push( starty - (i * lineSpacing) * sign );
            }
     
            const x = bbox_x + ((child_data.time - parseFloat(this_element.dataset.time)) * this.time2x);
            const width = child_data.duration * this.time2x;

            let ret = {
                y,
                x,
                width,
                r: stepSize - 2,
                ledgerLine_y,
                accidental: pitchInfo.accidental
            }

            return ret;

        }
    }

    /**
     * 
     * Called by child objects using the template
     * the parent/container object supplies a mapping from view params to data
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     * @param {Event}   event (optional) include the mouse event for mode handling
     */
     childViewParamsToData(this_element, child_viewParams, event = null) 
     {
        if( ui_api.hasParam(child_viewParams, ['x', 'y', 'width']) ) 
        {

            let child_x = child_viewParams.x;

            if( event && event.shiftKey )
            {
                const snapPoints = this_element.querySelectorAll('.contents .snapline');
                if( snapPoints )
                {

                    let choose_x = 100000;
                    snapPoints.forEach( e => {
                        let snap_x = parseFloat( e.getAttribute("x1") );
                        if( Math.abs(child_x - snap_x) < Math.abs(child_x - choose_x) ) 
                        {
                            choose_x = snap_x;
                        }
                    })
                    child_x = choose_x;

                }
            }

            const stepSpacing = parseFloat(this_element.dataset.lineSpacing) * 0.5;
    
            let child_y = Math.floor(child_viewParams.y / stepSpacing) * stepSpacing;
    
            // note, we don't have a good way to know whether the moved point is an accidental or not...
            const midi = this.y2midi(child_y, this_element); 

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));

            const time = ((child_x-bbox_x) * this.x2time) + parseFloat(this_element.dataset.time);
            const duration = child_viewParams.width * this.x2time;

            return {
                midi,
                time,
                duration
            };
        }
    }


    /**
     * 
     * @param {object} params passed in from call/method syntax
     */
    playbar(params)
    {
        if( typeof params.id != "undefined" && typeof params.time != "undefined" )
        {
            let rect = document.getElementById(`${params.id}-rect`);
            let bbox = ui_api.getBBoxAdjusted(rect);
            ui_api.drawsocketInput({
                key: "svg",
                val: {
                    id: `${params.id}-playbar`,
                    class: "playbar",
                    parent: params.id,
                    new: "line",
                    x1: bbox.x + params.time * this.time2x,
                    x2: bbox.x + params.time * this.time2x,
                    y1: bbox.top,
                    y2: bbox.bottom
                }
            })
        }
    }

    drag(element, pos){}


}

class FiveLineStave_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "FiveLineStave";
        this.lookup = super.default_conatiner_lookup;

    }
    

    getFormattedLookup(params, obj_ref )
    {

        let ret = {
            time: [],
            duration: [],
            midi: []
        };

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                const event = def.getFormattedLookup(params, obj);
                if( event )
                {
                    ret.time.push(event.time);
                    ret.duration.push(event.duration);
                    ret.midi.push(event.midi);
                }
            });
        
        }
        else
        {
            ret = {
                lookup_error: `no contents element with id "${obj_ref.contents}" found`
            };
        }

        let ret_obj = {};
        ret_obj[obj_ref.id] = ret;
        
        return ret_obj;
    }
}


module.exports = {
    ui_def: FiveLineStave,
    io_def: FiveLineStave_IO
}

