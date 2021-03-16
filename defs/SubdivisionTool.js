/**
 * idea: make tool that creates symbols
 * this is a UI element like align or spread evenly tools in Illustrator
 * 
 * acttion. click in palette then prompt to select duration object to subdivide
 * 
 */


const Template = require(__symbolist_dirname + '/lib/SymbolTemplate') 

class SubdivisionTool extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "SubdivisionTool";
        this.dividerTypes = ["Measure", "SnapDivisions"];
    }



    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-1`,
                target: "select element",
                element_time: "select element",
                element_duration: "select element",
                division_tree: "1x100", // or [1/100, 99/100]
                marker_type: "Measure"//, // one for each 
                //repeat: [0, 0, 0] // n repeats for each division (if measure type)
            },
            
             /**
             * in the case of higher order tools, the data has information about how it will apply to other objects
             * but the viewParms are not actaully used for drawing *this* object so we don't need them here
             */
            view: {}
        }
    }

/**
 * 
 * this needs to be changed since it should be a tool that places measures etc, not the actual measure
 * 
 * ... what does a measure class look like?
 * maybe it's a grouping element, or acutally they are blocks that have a frame, which is the barline
 * 
 * with a measure subdivision we can use stem markers instead?
 * then you can add noteheads to the subdivision markers, or snap notes to makers...
 *
 */
    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        let ret = [];

        params.x.forEach( x => {
            ret.push({
                new: "line",
                id : `${this.class}-marker`,
                class: params.marker_type, 
                x1: x,
                x2: x,
                y1: params.y - height / 2,
                y2: params.y + height / 2
            })
        })

        return ret;
    }
    
 


     fromData(dataObj, container, preview = false)
     {
/*
        const data_union = {
             ...this.structs.data,
             ...dataObj
         };
         
         const viewObj = this.display(viewParams);        
         ui_api.drawsocketInput( drawObj );
         */
     }
 


    getPaletteIcon() {
        return {
            key: "svg",
            val: {
                new: "image",
                href: "defs/assets/subdivideIcon.svg",
                width: "100%",
                height: "100%"
            }
        }
    }

    drag(element, delta_pos = {x:0,y:0}) 
    {
        ui_api.translate(element, delta_pos);
    }

    /*
    1. lookup division type def
    2. create n number of subdivisions of that type as contents of dividing element
    3. optional could be to update the duration of the top level... or maybe it makes sense to create the measures first before creating the staves
        but if the score is proportional notation, it doesn't matter what the beats are
    */  
    createSubdivisions(dataset)
    {
        console.log('createSubdivisions', dataset);

        
        let target = document.getElementById(dataset.target);
        // could evaluate function for the tree here

        let treeStr = dataset.division_tree;
        let tree;
        if( treeStr.indexOf("x") != -1 )
        {
            let multTreeStr = treeStr.split("x");
            let mult = parseFloat(multTreeStr[1]);
            let base = parseFloat(multTreeStr[0]);
            tree = [];
            for( let i = 0; i < mult; i++)
            {
                tree.push(base);
            }
        }
        else
        {
            tree = JSON.parse(`[${dataset.division_tree}]`);
        }

        let dur = parseFloat(dataset.element_duration);
        let element_time = parseFloat(dataset.element_time);
        
     //   console.log(tree, dur, time);

        let incr = dur / tree.length;
        let divisions = [];

        let dividerDef = ui_api.getDef(dataset.marker_type);

       // console.log(dividerDef, dataset.marker_type);

        // for better resolution, we could store the ratio in the measure, probably better
        for( let i = 0; i < tree.length; i++ )
        {
            dividerDef.fromData({
                id: `${dividerDef.class}_u_${ui_api.fairlyUniqueString()}`,
                container: target.id,
                time: element_time + incr * i,
                duration: incr
                // default barlineType
            }, target );
        }
       // console.log(divisions);
    }

    makePanel(dataobj)
    {
        
        ui_api.drawsocketInput({
            key : "html",
            val : {
                ...ui_api.dataToHTML(dataobj),
                parent : "forms",
                new : "div",
                id : `${this.class}-toolitem`,
                class : "toolitem",
                children : [
                    ...Object.keys(dataobj).map( param => {
                        
                        if( param != 'id' && param != 'class' && param != 'parent') 
                        {
                            if( param == "target" || param == "element_duration" || param == "element_time" )
                            {
                                return [{
                                    new : "span",
                                    class : "infoparam",
                                    text : param
                                }, {
                                    new : "span",
                                    id : `${this.class}-${param}`,
                                    class : "infovalue-noedit",
                                    text : dataobj[param]
                                }]
                            }
                            else if ( param == "marker_type" )
                            {
                                return [{
                                    new : "span",
                                    class : "infoparam",
                                    text : param
                                },{
                                    new: "select",
                                    name: "marker_type",
                                    class : "infovalue",
                                    id : `${this.class}-${param}`,
                                    children: this.dividerTypes.map( type => {
                                        return {
                                            new: "option",
                                            value: type,
                                            text: type
                                        }
                                    }),
                                    onchange: (event) => {
                                        let element = document.getElementById(`${dataobj.class}-toolitem`);
                                        element.dataset[param] = event.target.value;
                                    }
                                }]
                            }
                            else 
                            {
                                return [{
                                    new : "label",
                                    class : "infoparam",
                                    for : param,
                                    text : param
                                }, {
                                    new : "input",
                                    class : "infovalue",
                                    type : "text",
                                    id : `${this.class}-${param}`,
                                    value : dataobj[param],
                                    oninput : (event) => {
                                        let element = document.getElementById(`${dataobj.class}-toolitem`);
                                        element.dataset[param] = event.target.value;
                                    },
                                    onblur: 'symbolist.startDefaultEventHandlers()',
                                    onfocus: 'symbolist.stopDefaultEventHandlers()'
                                }]
                            }
                        }
                    }).flat(), // flattening map with sublists
                    {
                        new: "button",
                        class: "panelbutton",
                        text: "apply",
                        onclick: ()=> {
                            let element = document.getElementById(`${dataobj.class}-toolitem`);
                            this.createSubdivisions(element.dataset);
                        }
                    }]
            }
        });
    }

    paletteSelected( enable = false ) 
    {

        if( enable )
        {
            this.m_mode = 'palette';
            this.mouseListeners(true);
            this.makePanel(this.structs.data);

        }
        else
        {
            this.m_mode = 'exited palette';
            this.mouseListeners(false);
            ui_api.drawsocketInput({
                key : "remove",
                val : `${this.class}-toolitem`
            });
        }
    }
    
    updateFromDataset(element)
    {
        document.getElementById(`${this.class}-target`).innerHTML = element.dataset.target;
        document.getElementById(`${this.class}-element_duration`).innerHTML = element.dataset.element_duration;
        document.getElementById(`${this.class}-element_time`).innerHTML = element.dataset.element_time;

    }

    handleEvent(e) {
        switch(e.type)
        {
            case 'mousedown':
            {
                let target = ui_api.getSymbolFromElement(e.target);
                if( target && typeof target.dataset.duration != "undefined" )
                {
                    let element = document.getElementById(`${this.class}-toolitem`);

                    element.dataset.target = target.id;
                    element.dataset.element_duration = target.dataset.duration;
                    element.dataset.element_time = target.dataset.time;

                    this.updateFromDataset(element);

               //     console.log('target data', target.dataset, element.dataset);

                }

            }
            break;
        }

    }

}


module.exports = {
    ui_def: SubdivisionTool,
    io_def: null    
}

