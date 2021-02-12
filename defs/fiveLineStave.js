


'use strict';

const className = "fiveLineStave";

const palette = [ "fiveLineStaveEvent" ]; //, "otherRectangleStaveEvent"


const default_duration = 1;
const default_height = 100;

const left_margin = 20;
const top_margin = 20;

let x2time = 0.001;
let time2x = 1000;


let dataInstance = {
    // class name, refering to the definition below
    class: className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 1,
    height: 100 ,
    lineSpacing: 8
}

/**
 * data used to draw expected by display function
 */
let viewParamsInstance = {
    id: `${className}-0`,
    x: 0,
    y: 0,
    height: 100, 
    width: 100,
    lineSpacing: 8
}

let mappingParams = {
    time: 0,        // -> x
    midi: 60,       // -> y

    duration: 1
}

/** 
 * viewDisplay is just the view part, for containers, it's used for sprites, palette, but the viewContainer is what is used in the DOM
 */
const display = function(params)
{
    // note, stafflines can be generated computationally later, just hand wrote them for now
    let centerY = params.y + (params.height / 2);
    return [{
            new: "rect",
            id: `${params.id}-rect`,
            x: params.x,
            y: params.y,
            width: params.width,
            height: params.height
        },{
            new: "text",
            id: `${params.id}-label`,
            class: 'staveLabel',
            x: params.x - left_margin,
            y: centerY,
            text: params.id
        }, {
            new: "image",
            id: `${params.id}-clef`,
            href: "defs/g_clef.svg",
            x: params.x,
            y: params.y
    
        },
        {
            new: "g",
            id: `${params.id}-staffline-group`,
            children: [{
                new: "line",
                id: `${params.id}-staffline-1`,
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
        }]
}


/**
 * 
 * @param {Object} ui_api api object passed in to def on initialization from ui controller
 * 
 * ui def defines sorting and interaction scripts that run in the editor browser
 */
const ui_def = function( ui_api ) 
{

    /**
     * called when drawing this symbol to draw into the palette 
     * 
     * @returns drawsocket format object which will sit inside an HTML div
     */
    function getPaletteIcon(){}


    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    function getInfoDisplay(viewElement)
    {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement, ui_api.scrollOffset)
        )
    }


    // rename: dataToDrawingParams? or dataToDisplayParams
    function dataToViewParams(data, container)
    {

        const parentDef = ui_api.getDefForElement(container);

        return {
            ...parentDef.childDataToViewParams(container, data),
            // other view params that the parent doesn't deal with:
            id: data.id,
            lineSpacing: data.lineSpacing
        }
     
    }


 /**
     * 
     * @param {Object} dataObj data object to use to create new or update element
     * @param {Element} container HTML/SVG element context for this element
     * 
     * called when creating new element, or updating values 
     * 
     * 
     */
    function fromData(dataObj, container)
    {

        let viewParams = dataToViewParams(dataObj, container);
        
        ui_api.drawsocketInput( 
            ui_api.svgFromViewAndData( display(viewParams), dataObj )
        );

    }


    function getContainerForData(dataObj)
    {

        return document.getElementById(dataObj.container);

    }



    const sharpSteps =          [ 0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6 ];
    const flatSteps =           [ 0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7 ];
    const chromaAccidList =     [ 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1 ];
    const midiMiddleLine = 71;

    function midi2y(midi, stepSpacing, accidentalType = "sharp")
    {
        const midiNote = midi - midiMiddleLine;
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
    function y2midi(y, container, accidentalType = "sharp")
    {
        const middleLine = document.getElementById(`${container.id}-line-3`);
        const stepSize = container.dataset.lineSpacing * 0.5;

        const y_pix = parseFloat(middleLine.getAttribute('y1')) - y;
        
        const y_steps = Math.floor( y_pix / stepSize);

        return  midiMiddleLine + y_steps;

    }



   /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    function childDataToViewParams(this_element, child_data)
    {
        if( ui_api.hasParam(child_data, ['time', 'duration', 'midi']) )
        {

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));
       
            const middleLine = document.getElementById(`${this_element.id}-line-3`);
            const lineSpacing = parseFloat(this_element.dataset.lineSpacing);
            const stepSize = lineSpacing * 0.5;

            // accidental type (sharp/flat) should be settable somewhere
            const pitchInfo = midi2y( Math.round(child_data.midi), stepSize, "sharp"); 
            const y = parseFloat(middleLine.getAttribute('y1')) - pitchInfo.yOffset;

            const n_ledgerLines = Math.floor( Math.abs(pitchInfo.yOffset) / lineSpacing) - 2;
            let sign = pitchInfo.yOffset < 0 ? -1 : 1;

            let starty = parseFloat(middleLine.getAttribute('y1')) - (lineSpacing * 3) * sign;

            let ledgerLine_y = [];
            for( let i = 0; i < n_ledgerLines; i++)
            {
                ledgerLine_y.push( starty - (i * lineSpacing) * sign );
            }
     
            const x = bbox_x + ((child_data.time - parseFloat(this_element.dataset.time)) * time2x);
            const width = child_data.duration * time2x;

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
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     * 
     * called when child object has moved graphically
     * 
     */
    function childViewParamsToData(this_element, child_viewParams)
    {
        if( ui_api.hasParam(child_viewParams, ['x', 'y', 'width']) ) 
        {
            // note, we don't have a good way to know whether the moved point is an accidental or not...
            const midi = y2midi(child_viewParams.y, this_element); 

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));

            const time = ((child_viewParams.x-bbox_x) * x2time) + parseFloat(this_element.dataset.time);
            const duration = child_viewParams.width * x2time;

            return {
                midi,
                time,
                duration
            };
        }
    }

    function getContainerForData(dataObj)
    {

        return document.getElementById(dataObj.container);

        /*
        let containers = document.querySelectorAll(`.${className}.symbol`);
        let insertAtIndex = ui_api.insertIndex(
            dataObj, containers,
            (a,b) => {
                return (a.time < b.dataset.time) ? -1 : (a.time == b.dataset.time ? 0 : 1) ;
            });
        
        if( insertAtIndex < 0 ) 
            insertAtIndex = 0;

        return containers[insertAtIndex];
        */
    }



    function move(e) {}

    function down(e) {}

    function up(e){}

    function keyDown(e){}
    
    function keyUp(e){}


    /**
     * 
     * @param {Element} obj selected element
     */
    function paletteSelected (enable = false) {}

   /**
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    function updateFromDataset(element)
    {

        console.log('fiveLineStave updateFromDataset');

    }


    /**
     * 
     * @param {object} params passed in from call/method syntax
     */
    function playbar(params)
    {
        if( typeof params.id != "undefined" && typeof params.time != "undefined" )
        {
            let rect = document.getElementById(`${params.id}-rect`);
            let bbox = ui_api.getBBoxAdjusted(rect);
            ui_api.drawsocketInput({
                key: "svg",
                val: {
                    id: `${className}-playbar`,
                    parent: params.id,
                    new: "line",
                    x1: bbox.x + params.time * time2x,
                    x2: bbox.x + params.time * time2x,
                    y1: bbox.top,
                    y2: bbox.bottom,
                    style: {
                        stroke: 'rgba(255, 0, 0, 0.5)',
                        'stroke-width': 2
                    }
                    
                }
            })
        }
    }

    // exported functions used by the symbolist renderer
    return {
        class: className,
        dataInstance,
        palette,

        getPaletteIcon,
        getInfoDisplay,

        paletteSelected,
        
        updateFromDataset,
        fromData,

        getContainerForData,

        childDataToViewParams,
        childViewParamsToData,

        playbar
    }

}


/**
 * 
 * @param {Object} io_api api object passed in to def on initialization from io controller
 * 
 * io def defines sorting and lookup scripts to be run on the server-side
 */
const io_def = (io_api) => {

    /**
     * 
     * @param {Object} a 
     * @param {Object} b 
     * 
     * comparator for sorting instances of this class type (rectangleStave)
     */
    function comparator (a, b) {
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1))
    }

     /**
      * 
      * @param {Object} dataObj data object that has been looked up
      * 
      * script here is called when looking up symbols, and potentially could respond with
      * generative values in realtime
      * 
      */
    function lookup( params, obj_ref )
    {
        let ret = [];

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                const event = def.lookup(params, obj);
                if( event )
                {
                    ret.push(event);
                }
            });
        
        }
        else
        {
            ret = {
                lookup_error: `no element with id "${params.id}" found`
            };
        }

      //  console.log(`${className} ret ${JSON.stringify(ret)}`);
        let ret_obj = {};
        ret_obj[obj_ref.id] = ret;
        
        return ret_obj;
    }

    function getFormattedLookup(params, obj_ref )
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
                lookup_error: `no element with id "${params.id}" found`
            };
        }

      //  console.log(`${className} ret ${JSON.stringify(ret)}`);
        let ret_obj = {};
        ret_obj[obj_ref.id] = ret;
        
        return ret_obj;
    }


    return {
        class: className,
        comparator,
        lookup,
        getFormattedLookup
    }
}

module.exports = {
    ui_def,
    io_def
}

