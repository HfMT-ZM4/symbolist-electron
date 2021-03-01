const Template = require(__symbolist_dirname + '/lib/SymbolTemplate'); 

class PathSymbol extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "PathSymbol";

        this.pts = [];
        this.currentPosition = {x:0, y:0};
        this.downTarget = null;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                points: [
                    { x: 0, y: 0, moveTo: true },
                    { x: 50, y: 50, curve: { type: 'quadratic', x1: 0, y1: 50 } },
                    { x: 50, y: 30, curve: { type: 'quadratic', x1: 0, y1: 50 } }
                  ] // need to filter the points from being sent to the svg dataset
            },
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                points: [
                    { x: 10, y: 10, moveTo: true },
                    { x: 50, y: 50, curve: { type: 'quadratic', x1: 0, y1: 50 } },
                    { x: 50, y: 30, curve: { type: 'quadratic', x1: 0, y1: 50 } }
                  ] 
            }
        }
    }



    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        console.log(params.points, SVGPoints.toPath(params.points));
        return {
            new: "path",
            class: 'trajectory',
            id: `${params.id}-notehead`,
            d: SVGPoints.toPath(params.points)
        }
    }
    
    getElementViewParams(element) {

        const trajectory = element.querySelector('.trajectory');
        const d = trajectory.getAttribute('d');
        
        const points = SVGPoints.toPoints({ 
            type: 'path',
            d
        });

        return {
            id: element.id,
            points
        }

    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                id: `${this.class}-palette-icon`,
                class: this.class,
                points: this.structs.view.points
            })
        }
    }

    handleEvent(e) {
        switch(e.type)
        {
            case 'keyup':
                if( e.key == "Meta" ){
                    ui_api.removeSprites();
                }
            break;
            case 'mousedown':
                if( this.m_mode == "palette" )
                {
                    if( e.metaKey ){
                        let newEl = this.creatNewFromMouseEvent(e);
                      //  this.editMode(newEl, true);
                    }
                }
                else if( this.m_mode == "edit" )
                {
                    this.editMouseDown(e);
                }
                
            break;
            case 'mousemove':
                if( this.m_mode == "edit")
                {
                    this.editMove(e);
                }
                else
                {
                    this.mousemove(e);
                }
            break;

        }
    }



    /**
     * 
     * internal method called from createNewFromMouseEvent and mousemove in palette mode
     * 
     * @param {Event} event 
     * @param {Element} container 
     */
    mouseToData( event, container )
    {
        const pt = ui_api.getSVGCoordsFromEvent(event);

        const parent_def = ui_api.getDefForElement(container);

        let bbox = Points.boundingBox(this.structs.data.points);
        let translated_default = Points.offset(this.structs.data.points,
                                                pt.x , 
                                                pt.y );

        return {
            ...this.structs.data, // set defaults, before overwriting with parent's mapping
            ...parent_def.childViewParamsToData(container, translated_default), 
            id: `${this.class}_u_${ui_api.fairlyUniqueString()}`,
            container: container.id
        }    
    }


    getPreviewLine()
    {
        let lastpt = this.pts[this.pts.length - 1];

        // preview line
        return {
                new: "line",
                parent: "symbolist_overlay",
                id: "preview-line",
                class: "preview-line",
                x1 : lastpt.x,
                y1: lastpt.y,
                x2: this.currentPosition.x,
                y2: this.currentPosition.y
            }
    }


    HandleRect(x,y, idx) {
        const r = 5;
        const d = r * 2;
        return {
            new: "rect",
            parent: "handle-layer",
            class: "path-handle",
            x: x - r,
            y: y - r,
            width: d,
            height: d,
            id: `handle-${idx}`,
            onclick: `console.log( "selected", this.id )`
        }
    }
    


    editMode( element, enable = false )
    {
        super.editMode(element, enable);
        
        if( enable )
        {
            let data = this.getElementViewParams(element);
            if( data.points )
            {
                this.pts = data.points;
                this.currentPosition = this.pts[ this.pts.length - 1];
            }
            else
            {
                console.error('no points found for editing');
                return;
            }
    
    
            let handles = [];
            this.pts.forEach( (p, i) => {
                handles.push( this.HandleRect(p.x, p.y, i) );
        
                if( p.curve && p.curve.type == "quadratic")
                {
                    handles.push( this.HandleRect( p.curve.x1, p.curve.y1, `quad-${i}`) );
                    handles.push( {
                        id: `quad-${i}-connector`,
                        parent: "preview-line-layer",
                        new: "path",
                        class: "preview-line",
                        points: [{
                            x: this.pts[i-1].x,
                            y: this.pts[i-1].y
                        }, 
                        {
                            x: p.curve.x1,
                            y: p.curve.y1
                        }, 
                        {
                            x: p.x,
                            y: p.y
                        }]
                    })
                }
                
            })
            
            // create new UI (probably should be on separate layer)
            ui_api.drawsocketInput({
                key: "svg",
                val: {
                    new: "g",
                    parent: "symbolist_overlay",
                    id : "path-preview-group",
                    children : [
                        {
                            new: "g",
                            id: "preview-line-layer",
                            children: {
                                new: "path",
                                id: "path-preview",
                                class: "path-preview",
                                points: this.pts
                            }
                        },
                        {
                            new: "g",
                            id: "handle-layer",
                            children: handles
                        }
                    
                    ]
                }
            });
    
            element.style.visibility = "hidden";

        }
        else // exiting edit mode
        {

            let preview = document.getElementById("path-preview");
            const d = preview.getAttribute('d');
            const preview_points = SVGPoints.toPoints({ 
                type: 'path',
                d
            });
    

            let container = ui_api.getContainerForElement(element);
            const parentDef = ui_api.getDefForElement(container);
            const relaltive_pts = parentDef.childViewParamsToData(container, {points: preview_points});

            let data = {
                id: element.id,
                class: this.class,
                container: container.id,
                points: relaltive_pts.points
            };

            this.fromData(data, container);

            // update data 
            ui_api.sendToServer({
                key: "data",
                val: data
            })

            element.style.visibility = "visible";
        }
        console.log(" edit mode", enable);

        return true;
    }



    editMove(e)
    {
    
        this.currentPosition = ui_api.getSVGCoordsFromEvent(e);

    
        if( this.downTarget == null )
            return;
    
        if( this.pts.length > 0 )
        {
    
    
            const grabHandle = this.downTarget.getAttribute("class") == "path-handle";
            if( grabHandle && !e.metaKey)
            {
                //console.log(e.target.id);
    
                let tok = this.downTarget.id.split("-");
               // console.log(tok);
    
                let idx = Number( tok[tok.length - 1] );
    
                if( e.buttons == 1 ) // drag handle
                {
                    // update point position based on handle drag, then redraw points
                    //  console.log("handle?", e.target.getAttribute("class"));
    
                    if( tok.length == 3 ) 
                    {
                        if (tok[1] == "quad") 
                        {
                            this.pts[idx].curve.x1 = this.currentPosition.x;
                            this.pts[idx].curve.y1 = this.currentPosition.y;
    
                            ui_api.drawsocketInput({
                                key: "svg",
                                val: [
                                    this.HandleRect(this.currentPosition.x, this.currentPosition.y, `quad-${idx}`),
                                    {
                                        id: "path-preview",
                                        points: this.pts
                                    },
                                    {
                                        id: `quad-${idx}-connector`,
                                        parent: "preview-line-layer",
                                        class: "preview-line",
                                        new: "path",
                                        points: [{
                                            x: this.pts[idx - 1].x,
                                            y: this.pts[idx - 1].y
                                        }, 
                                        {
                                            x: this.currentPosition.x,
                                            y: this.currentPosition.y
                                        }, 
                                        {
                                            x: this.pts[idx].x,
                                            y: this.pts[idx].y
                                        }]
                                    }
                                ]
                            });
    
                        }
                    }
                    else if( tok.length == 2 )
                    {
                        this.pts[idx].x = this.currentPosition.x;
                        this.pts[idx].y = this.currentPosition.y;
    
                        let drawArr = [
                            this.HandleRect(this.currentPosition.x, this.currentPosition.y, idx),
                            {
                                id: "path-preview",
                                points: this.pts
                            }
                        ];
    
                        if( this.pts[idx].curve )
                        {
                            drawArr.push({
                                id: `quad-${idx}-connector`,
                                parent: "preview-line-layer",
                                new: "path",
                                class: "preview-line",
                                points: [{
                                    x: this.pts[idx - 1].x,
                                    y: this.pts[idx - 1].y
                                }, 
                                {
                                    x: this.pts[idx].curve.x1,
                                    y: this.pts[idx].curve.y1
                                }, 
                                {
                                    x: this.pts[idx].x,
                                    y: this.pts[idx].y
                                }]
                            })
                        }
    
                        if( this.pts.length >= (idx + 2) && this.pts[idx+1].curve )
                        {
                            let nextPt = idx+1;
                            drawArr.push({
                                id: `quad-${nextPt}-connector`,
                                parent: "preview-line-layer",
                                new: "path",
                                class: "preview-line",
                                points: [{
                                    x: this.pts[idx].x,
                                    y: this.pts[idx].y
                                }, 
                                {
                                    x: this.pts[nextPt].curve.x1,
                                    y: this.pts[nextPt].curve.y1
                                }, 
                                {
                                    x: this.pts[nextPt].x,
                                    y: this.pts[nextPt].y
                                }]
                            })
                        }
    
    
                        ui_api.drawsocketInput({
                            key: "svg",
                            val: drawArr
                        });
                    }
    
                }
                
            }
            else if( e.buttons == 1 ) // drag path
            {
                if( e.metaKey && !grabHandle && this.pts.length > 1 ) // if not dragging handle, then we are adding a curve point
                {
                    //  console.log("not handle!", e.target.getAttribute("class"));
    
                    this.pts[this.pts.length - 1].curve = {
                        type: 'quadratic',
                        x1: this.currentPosition.x,
                        y1: this.currentPosition.y
                    }
    
                    ui_api.drawsocketInput(
                    {
                        key: "svg",
                        val: [
                            this.HandleRect(this.currentPosition.x, this.currentPosition.y, `quad-${this.pts.length - 1}`),
                            {
                                id: "path-preview",
                                points: this.pts
                            },
                            {
                                id: `quad-${this.pts.length - 1}-connector`,
                                parent: "preview-line-layer",
                                new: "path",
                                class: "preview-line",
                                points: [{
                                    x: this.pts[this.pts.length - 2].x,
                                    y: this.pts[this.pts.length - 2].y
                                }, 
                                {
                                    x: this.currentPosition.x,
                                    y: this.currentPosition.y
                                }, 
                                {
                                    x: this.pts[this.pts.length - 1].x,
                                    y: this.pts[this.pts.length - 1].y
                                }]
                            }
                        ]
                    })
                }
                
              
            }
            else if( e.metaKey )
            {
                ui_api.drawsocketInput({
                    key: "svg",
                    val: this.getPreviewLine()
                });
            }
            
            
        }
        
        //console.log('move', e.clientX, e.clientY);
    }
    
    

    editMouseDown(e)
    {
        this.currentPosition = ui_api.getSVGCoordsFromEvent(e);

        this.downTarget = e.target;
    
        if( e.metaKey )
        {
            let newPt = { ...this.currentPosition };
            
            if( this.pts.length == 0 )
                newPt.moveTo = true;
        
            this.pts.push( newPt );
        
            ui_api.drawsocketInput([{
                    key: "remove",
                    val: "preview-line"
                },
                {
                    key: "svg",
                    val: [
                        this.getPreviewLine(),
                        this.HandleRect(newPt.x, newPt.y, this.pts.length - 1)
                    ]
                }        
            ])
        
            
            console.log('new point', this.pts, this.getPreviewLine());
        }
    
    }

}

class PathSymbol_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "PathSymbol";
    }
    
    /**
     * 
     * @param {Object} params here we expect a phase value not duration
     * @param {Object} obj_ref 
     */
    lookup( params, obj_ref )
    {

        const points = obj_ref.points;
        const phase = params.phase;

        return {
            id: obj_ref.id,
            trajectory_pt: io_api.Points.position(points, phase, 1)
        }

    }
}



module.exports = {
    ui_def: PathSymbol,
    io_def: PathSymbol_IO    
}

