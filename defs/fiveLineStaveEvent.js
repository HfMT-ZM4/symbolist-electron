
// make time/pixel scalar something that can be adjusted in the UI

'use strict';

const { drawsocketInput } = require("../ui_controller");


//const sym_utils = root_require('utils')

const className = "fiveLineStaveEvent";

const palette = [ ] //"rectangleStaveAzim", "otherRectangleStaveEvent"

const x2time = 0.001;
const time2x = 1000;

//const y2pitch = 127.; // y is normalized 0-1
//const pitch2y = 1 / 127.;

const default_r = 2;
const default_dist = 5;

const default_duration = 0.1;


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



let dataInstace = {
    // class name, refering to the definition below
    class: className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 0.1,
    note: 'c:5',
    midi: 60,
    ratio: '5/4',
    hz_ref: 440, // later make this assignable to another note?
    accid: "natural",
    amp: 1
}



/**
 * 
 * @param {Object} ui_api api object passed in to def on initialization from ui controller
 * 
 * ui def defines sorting and interaction scripts that run in the editor browser
 * 
 * returns methods which can be called by the ui controller
 * 
 */
const ui_def = function(ui_api) 
{


    const viewDisplay = function(id, cx, cy, r, x2, y2, ledgerLine_y = [], accidental = false, overwrite = true)
    {
        
        let obj = {
            id,
            new: (overwrite ? "g" : undefined),
            children : [{
                id: `${id}-notehead`,
                new: (overwrite ? "circle" : undefined),
                class: "notehead",
                cx,
                cy,
                r,
                style: {
                    fill : "black"
                }
            },
            {
                new: (overwrite ? "line" : undefined),
                id: `${id}-duration`,
                class: "duration-line",
                x1: cx,
                y1: cy,
                x2, 
                y2,
                style: {
                    stroke: 'black',
                    'stroke-width' : 2
                }
            }]
        };

        if( accidental )
        {
            let oldAcc = document.getElementById(`${id}-accidental`);

            obj.children.push({
                new: (overwrite || !oldAcc ? "text" : undefined),
                id: `${id}-accidental`,
                text : accidentalLookup[accidental], //(accidental == "sharp" ? "&#xE262" : "&#xE260"),
                class: "accidental",
                x : cx - 15,
                y : cy,
                style: {
                    'font-size' : "23pt", // make this more dynamic
                    'font-family' : "Bravura"
                }
            })
        }
        else
        {
            let oldAcc = document.getElementById(`${id}-accidental`);
            if( oldAcc )
                oldAcc.remove();
        }

        let ledgerLine_g_exists = document.getElementById(`${id}-ledgerLines`);
        if( ledgerLine_g_exists )
        {
            ui_api.drawsocketInput({
                key: "clear",
                val: `${id}-ledgerLines`
            })
        }

        if( ledgerLine_y.length > 0 )
        {

            let ledgerLine_g = {
                new: "g",
                id: `${id}-ledgerLines`,
                children: []  
            }

            ledgerLine_y.forEach( ledge_y => {
                ledgerLine_g.children.push({
                    new: "line",
                    class : "staffline",
                    x1: cx - 15,
                    x2: cx + 15,
                    y1: ledge_y,
                    y2: ledge_y,
                    style : {
                        'stroke-width' : 0.5,
                        stroke: 'black'
                    }
                })
            })

            obj.children.unshift( ledgerLine_g );
        }
       

        return obj;
    }

    // UI mode, "creation" or "edit", passed from renderer
    let m_mode = null;

    /**
     * called when drawing this symbol to draw into the palette 
     * 
     * @returns drawsocket format object which will sit inside an HTML div
     */
    function getPaletteIcon()
    {

        return {
            key: "svg",
            val: viewDisplay(`${className}-pal-disp`, 25, 25, default_r, 35, 25)
        }
    }

    /**
     * 
     * called when the user hits [i] when selecting an object
     * 
     * @param {Object} dataObj data object sent from controller to display in UI
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    function getInfoDisplay( viewElement )
    {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement, ui_api.scrollOffset)
        )
        
    }


    function mapToData(viewData, container)
    {
        const containerRect = document.getElementById(`${container.id}-rect`);
    
        const midi = y2midi(viewData.cy, container); 

        const bbox_x = parseFloat(containerRect.getAttribute('x'));
        const time = ((viewData.cx-bbox_x) * x2time) + parseFloat(container.dataset.time);// + parseFloat(container.dataset.duration);
        
        const duration = default_duration;

        return {
            time, 
            midi,
            duration
        }
    }

    /**
     * 
     * @param {Element} element 
     * @param {Element} container 
     * 
     * called when updating data
     * 
     */
    function elementToData(element)
    {
        const container = element.closest('.container');
        const circle = element.querySelector('circle');
        const line = element.querySelector('line');

        const cx = parseFloat(circle.getAttribute('cx'));
        const cy = parseFloat(circle.getAttribute('cy'));
        const x2 = parseFloat(line.getAttribute('x2'));
        const y2 = parseFloat(line.getAttribute('y2'));

        return mapToData(
            { 
                cx, 
                cy, 
                r: default_r, 
                x2, 
                y2 
            }, 
            container
        );

    }


    const sharpSteps =          [ 0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6 ];
    const flatSteps =           [ 0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7 ];
    const chromaAccidList =     [ 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1 ];
    const midiMiddleLine = 71;

    // maybe this should be in the parent stave? clef?

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

        const isAcc = chromaAccidList[ chroma ] ? accidentalType : null;

        return {
            yOffset: octaveYoffset + lineYoffset,
            isAcc
        }
    }

    function y2midi(y, container, accidentalType = "sharp")
    {
        const middleLine = document.getElementById(`${container.id}-line-3`);
        const stepSize = container.dataset.lineSpacing * 0.5;

        const y_pix = parseFloat(middleLine.getAttribute('y1')) - y;
        
        const y_steps = Math.floor( y_pix / stepSize);

        return  midiMiddleLine + y_steps;

    }


    function mapToView(data, container, id, overwrite = true)
    {
        const containerRect = document.getElementById(`${container.id}-rect`);
       // console.log('data', data, container);


        // don't need bbox now, since the rect has the info we need
        //const bbox = ui_api.getBBoxAdjusted(containerDisplay);

        const bbox_x = parseFloat(containerRect.getAttribute('x'));
       
        const middleLine = document.getElementById(`${container.id}-line-3`);
        const lineSpacing = parseFloat(container.dataset.lineSpacing);
        const stepSize = lineSpacing * 0.5;

        const pitchInfo = midi2y( Math.round(data.midi), stepSize, "sharp");
        const y_pix = parseFloat(middleLine.getAttribute('y1')) - pitchInfo.yOffset;
       // console.log(middleLine, pitchInfo, y_pix);

        const n_ledgerLines = Math.floor(pitchInfo.yOffset / lineSpacing) - 2;

        let starty = parseFloat(middleLine.getAttribute('y1')) - (lineSpacing * 3);
        let ledgerLine_y = [];
        for( let i = 0; i < n_ledgerLines; i++)
        {
            ledgerLine_y.push( starty - (i * lineSpacing) );
        }

        console.log('n_ledgerLines', ledgerLine_y);

        const cx = bbox_x + ((data.time - parseFloat(container.dataset.time)) * time2x);
        const cy = y_pix;

        const x2 = cx + Math.sin(data.duration) * time2x;
        const y2 = y_pix;

        const r = stepSize - 2;

        const accid = (data.accid ? data.accid : pitchInfo.isAcc);

        return viewDisplay(id, cx, cy, r, x2, y2, ledgerLine_y,  accid, overwrite)
            
    }


    function fromData(dataObj, container)
    {

         // filtering the dataObj since the id and parent aren't stored in the dataset
         let dataset = {
            time: dataObj.time,
            duration: dataObj.duration
        }

        const contentElement = container.querySelector('.contents');
        let midi = 0;

        if( dataObj.note ) // note name
        {
            midi = ui_api.ntom(dataObj.note);
            dataset.midi = midi;
            dataset.note = note;
        }
        else if( dataObj.midi )
        {
            midi = dataObj.midi;
        }
        else if( dataObj.ratio )
        {

            let ratio = ui_api.parseRatioStr( dataObj.ratio );
            let primes = ui_api.getRatioPrimeCoefs(ratio[0], ratio[1]);

            let accid = [];
            Object.keys(primes.num).forEach( p => {
                if( Number(p) > 2 )
                    accid.push( `${(p == '5' ? 'sharp-' : '')}${p}^${primes.num[p]}o` )
            })
            
            // sharp / flat needs refernece to base note pitch accidental 

            Object.keys(primes.den).forEach( p => {
                if( Number(p) > 2 )
                    accid.push( `${(p == '5' ? 'flat-' : '')}${p}^${primes.num[p]}o` )
            })
            
            console.log(accid, ui_api.reduceRatio(dataObj.ratio) );//could be way to use lookup for accidentals
            midi = ui_api.ftom( ui_api.ratio2float( dataObj.ratio ) * 440 );

            dataset.ratio = ratio;
            dataset.midi = midi;
            dataset.accid = accid;

        }

       

        let isNew = true;
        
        let currentElement =  document.getElementById(dataObj.id) ;
       // console.log(currentElement);

        if(currentElement) {
            isNew = false;
        }

        let newView = mapToView(dataset, container, dataObj.id, isNew );

       //   console.log('newView', newView);


        ui_api.drawsocketInput({
            key: "svg",
            val: {
                parent: contentElement.id,
                class: `${className} symbol`,
                ...newView,
                ...ui_api.dataToHTML(dataset)
            }
        });

    }

   /**
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    function updateFromDataset(element)
    {
        // assuming that we have all the data
        let data = element.dataset;
        const container = element.parentNode.closest('.container');

        const id = element.id;
        const parent = element.parentNode.id;

        let newView = mapToView(data, container, id, false);
        
         // send out before sending to drawsocket, because we overwrite the element
         
         ui_api.sendToServer({
            key: "data",
            val: {
                id,
                container: container.id,
                class: className,
                ...data
            }
        })

        ui_api.drawsocketInput({
            key: "svg",
            val: {
                parent, // parent is an id
                class: element.classList,
                ...newView, // note view has id internally
                ...ui_api.dataToHTML(data)
            }
        });



    }


    /**
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Object} event mouse event from click
     * 
     * returns new view object in drawsocket format, to be drawn
     */
    function creatNewFromMouseEvent(event)
    {      
        const container = ui_api.getCurrentContext();

        const stepSpacing = parseFloat(container.dataset.lineSpacing) / 2.;

        const pt = ui_api.getSVGCoordsFromEvent(event);
        const cx = pt.x;
        const cy = Math.floor( pt.y / stepSpacing) * stepSpacing ;

        const r = stepSpacing - 2; 
        const x2 = cx + dataInstace.duration * time2x;
        const y2 = cy;

        const uniqueID = `${className}_u_${ui_api.fairlyUniqueString()}`;
        
        const eventElement = container.querySelector('.contents');

        const dataObj = mapToData({ cx, cy, r, x2, y2 }, container );

     //   console.log('new cy', cy, dataObj.pitch);

        const newView = mapToView(dataObj, container, uniqueID);

        // create new symbol in view
        ui_api.drawsocketInput([
            {
                key: "remove", 
                val: `${className}-sprite`
            },
            {
                key: "svg",
                val: {
                    class: `${className} symbol`,
                    parent: eventElement.id,
                    ...newView,//viewDisplay(uniqueID, cx, cy, r, x2, cy ),
                    ...ui_api.dataToHTML(dataObj)//,
                    //onclick: function(e){ console.log('ello', e)}

                }
            }
            /* // example of creating an extra point via internal scripting
            ,
            { 
                key: "svg",
                val: {
                    class: `${className} symbol`,
                    parent: eventElement.id,
                    ...viewObj
                }
            }*/
        ])

        // send out
        ui_api.sendToServer({
            key: "data",
            val: {
                class: className,
                id: uniqueID,
                container: container.id,
                ...dataObj
            }
        })

    }


    function move(e)
    {
        if( e.metaKey && m_mode == "palette" )
        {

            let sprite = document.getElementById(`${className}-sprite`);

            const pt = ui_api.getSVGCoordsFromEvent(e);

            const x = pt.x;
            const y = pt.y;

            let cx, cy, azim;
            const container = ui_api.getCurrentContext();

            const stepSpacing = parseFloat(container.dataset.lineSpacing) / 2.;

            cx = x;
            cy = Math.floor(y / stepSpacing) * stepSpacing; 
                 
            const r = stepSpacing - 2; 
    
            let dataObj = mapToData({
                    cx, 
                    cy, 
                    r, 
                    x2: cx + 10, 
                    y2: cy
                },
                container
            );

       //     console.log('cy', cy, dataObj.pitch);

            let viewObj = mapToView(dataObj, container, `${className}-sprite-disp`);

            drawsocket.input({
                key: "svg", 
                val: {
                    id: `${className}-sprite`,
                    class: 'sprite',
                    parent: 'symbolist_overlay',
                    new: "g",
                    children: [
                        viewObj, //viewDisplay(cx, cy, r, cx + r, cy - 10),
                        {
                            new: "text",
                            x: cx,
                            y: cy - 20,
                            text: JSON.stringify(dataObj),
                            style: {
                                'font-size': '13px',
                                'font-family': 'Helvetica sans-serif'
                            }
                        }
                    ]
                }
            })
        }
       
    }

    function selected(element, state)
    {
        console.log('select state', state);

    }


    function applyTransformToData(element)
    {
        ui_api.applyTransform(element);

        let data = elementToData(element);

        ui_api.drawsocketInput({
            key: "svg",
            val: {
                id: element.id,
                ...ui_api.dataToHTML(data)
            }
        })

        // send out
        ui_api.sendToServer({
            key: "data",
            val: {
                id: element.id,
                class: className,
                container: element.parentNode.closest('.container').id,
                ...data
            }
        })

        return true;

    }

    /**
     * 
     * @param {Element} element html/svg element to translate
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    function translate(element, delta_pos = {x:0,y:0}) 
    {
        
        let container = element.closest('.container');
        
        const stepSpacing = parseFloat(container.dataset.lineSpacing) * 0.5;

        const snapY = Math.floor(delta_pos.y / stepSpacing) * stepSpacing;

        //console.log('container', container, delta_pos.y, parseFloat(container.dataset.lineSpacing) / 2., y2midi(delta_pos.y));
        ui_api.translate(element, {
            x: delta_pos.x,
            y: snapY
        });
    

        const circ = element.querySelector('circle');
        const line = element.querySelector('line');

        const cx = parseFloat(circ.getAttribute('cx')) + delta_pos.x;
        const cy = parseFloat(circ.getAttribute('cy')) + snapY;
        const x2 = parseFloat(line.getAttribute('x2')) + delta_pos.x;
        const y2 = cy;

        //console.log('cy', cy);

        let dataObj = mapToData(
            { 
                cx, 
                cy, 
                r: default_r, 
                x2, 
                y2 
            }, 
            container
        ); //mapToData(cx, cy, default_r, x2, y2, container);
        

        ui_api.drawsocketInput({
            key: "svg",
            val: {
                new: "text",
                id: `${className}-sprite`,
                parent: "symbolist_overlay",
                x: cx,
                y: cy - 20,
                text: JSON.stringify(dataObj),
                style: {
                    'font-size': '13px',
                    'font-family': 'Helvetica sans-serif'
                }
            }
        })
                
        // option for default translation
    //    console.log('translate', element, delta_pos, document.getElementById(`${className}-sprite`));
        return true; // return true if you are handling your own translation
    }

    function down(e) 
    {
        if( e.metaKey )
        {
            creatNewFromMouseEvent(e);
        }
    }

    function up(e){
       
    }

    function keyDown(e){}
    
    function keyUp(e)
    {
        if( e.key == "Meta" )
        {
            ui_api.drawsocketInput({
                key: "remove", 
                val: `${className}-sprite`
            })
        }
    }

    /**
     * 
     * @param {Boolean} enable called when entering  "palette" or  "edit"  mode
     * 
     * creation mode starts when the symbol is sected in the palette
     * edit mode is when the symbols is when one symbol is selected (or when you hit [e]?)
     */
    function paletteSelected( enable = false ) {

        console.log(`enter ${className} ${m_mode}`);

        if( enable ){
            m_mode = 'palette';

            window.addEventListener("mousedown", down);
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
            document.body.addEventListener("keydown", keyDown);
            document.body.addEventListener("keyup", keyUp);
        }
        else
        {
            console.log(`exit ${className} ${m_mode}`);

            ui_api.drawsocketInput({
                key: "remove", 
                val: `${className}-sprite`
            })            

            window.removeEventListener("mousedown", down);
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
            document.body.removeEventListener("keydown", keyDown);
            document.body.removeEventListener("keyup", keyUp);

            m_mode = null;
        }
    }


    // exported functions used by the symbolist renderer
    return {
        class: className,
        dataInstace,

        palette,

        fromData,

        getPaletteIcon,
        
        getInfoDisplay,

        updateFromDataset,
        
        //newFromClick,  // << another optional callback in case you don't want to deal with mouse events
        
       // enter edit mode

        paletteSelected, // arg true/false to enter exit


        
    //    enter,
    //    exit,

        selected,
        
        translate,
        applyTransformToData
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
     * comparator for sorting instances of this class type (rectangleStaveAzimuth)
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
      * return null if lookup params don't match the obj_ref
      * 
      */
    function lookup( params, obj_ref )
    {
        const start = obj_ref.time;
        const end = start + obj_ref.duration;
     //   console.log( start, end, params.time);
        if( start <= params.time && end >= params.time )
        {
            return {
                ...obj_ref,
                phase: (params.time - start) / obj_ref.duration
            }
        }

        return null;
    }
 

    return {
        class: className,
        comparator,
        lookup
    }
}

module.exports = {
    ui_def,
    io_def
}
