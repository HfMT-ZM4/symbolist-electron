/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 254:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"about":"symbolist will read a json file to configure the palette setup, this can be used to dynamically change also (eventually)","id":"Score","tools":[],"palette":["SubdivisionTool","BasicSymbolGL"],"class":"RootSymbol","contents":{"id":"trio","class":"SystemContainer","x":200,"y":100,"duration":20,"time":0,"contents":[{"id":"oboe","class":"FiveLineStave","height":100,"lineSpacing":10,"duration":20,"time":0,"contents":[]},{"id":"bassoon","class":"PartStave","height":100,"time":0,"duration":20,"contents":[]},{"id":"synth","class":"PartStave","height":200,"time":0,"duration":20,"contents":[]}]}}');

/***/ }),

/***/ 934:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 

class AzimNote extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "AzimNote";
        this.default_dist = 10;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                pitch: 55,
                azim: 3.14,
                duration: 0.1
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                r: 2,
                azim: 3.14
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [{
            id: `${params.id}-notehead`, // << make sure to give the sub-elements ids
            class: 'notehead',
            new: "circle",
            cx: params.x,
            cy: params.y,
            r: params.r
        },
        {
            new: "line" ,
            id: `${params.id}-azim`, // << make sure to give the sub-elements ids
            class: 'azimLine',
            x1: params.x,
            y1: params.y,
            x2: params.x + Math.sin(params.azim) * this.default_dist,
            y2: params.y + Math.cos(params.azim) * this.default_dist
        }]

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const circle = element.querySelector('.notehead');
        const azim_line = element.querySelector('.azimLine');

        const x = parseFloat(circle.getAttribute('cx'));
        const y = parseFloat(circle.getAttribute('cy'));
        const r = parseFloat(circle.getAttribute('r'));

        const x2 = parseFloat(azim_line.getAttribute('x2'));
        const y2 = parseFloat(azim_line.getAttribute('y2'));

        const azim = Math.atan2(x2-x, y2-y);

        return {
            id: element.id,
            x,
            y,
            r,
            azim
        }

    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                id: `${this.class}-icon`,
                class: this.class,
                x: 10,
                y: 10,
                r: 2,
                azim: 0.15
            })
        }
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
                { selector: `#${element.id} .azimLine`, x: "x2", y: "y2"},
                // callback function
                (element_, event) => {
                    const line = element_.querySelector('.azimLine');
                    const x1 = parseFloat(line.getAttribute('x1'));
                    const y1 = parseFloat(line.getAttribute('y1'));
                    
                    let mousePt = ui_api.getSVGCoordsFromEvent(event);
                    
                    let azim = Math.atan2( mousePt.x - x1, mousePt.y - y1);
                    element_.dataset.azim = azim;

                    this.updateFromDataset(element_);

                }
            );
        }


        return true; // << required if defined
    }
}



class AzimNote_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "AzimNote";
    }
    
}


module.exports = {
    ui_def: AzimNote,
    io_def: AzimNote_IO
}

/***/ }),

/***/ 270:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 

class BasicSymbol extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "BasicSymbol";
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
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

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
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

        let ret = {};
        ret.key = "svg";
        ret.val = [];

        Object.keys(dataObj).forEach( key => {
            ret.val.push({  
                new: "text",
                class: "data_text sprite",
                container: `symbolist_overlay`,
                relativeTo : (relativeTo ? relativeTo : `#${dataObj.id}`),
                id: `${dataObj.id}-${key}-data_text`,
                x: 0,
                y: -20,
                text: key + String(dataObj[key])
            })
        });

        console.log(ret);

        return ret;
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

class BasicSymbol_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "BasicSymbol";
    }
    
}



module.exports = {
    ui_def: BasicSymbol,
    io_def: BasicSymbol_IO    
}



/***/ }),

/***/ 755:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 

class BetaEnv extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "BetaEnv";
        this.height = 10;
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                a: 2,
                b: 2,
                duration: 0.1,
                time: 0,
                pitch: 60
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`,
                x: 0,
                y: 0,
                a: 2,
                b: 2,
                width: 10
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );

     //   console.log(params.points, SVGPoints.toPath(params.points));

        let y_arr = betaDist(params.a, params.b);

        const n_pts = y_arr.length;
        const x_incr = params.width / n_pts;
       // console.log(y_arr);

        let points = [{
            x: params.x,
            y: params.y + this.height
        }];

        let i = 0;
        for( ; i < n_pts; i++ )
        {
            points.push({
                x: params.x + i * x_incr,
                y: params.y + (1 - y_arr[i]) * this.height
            })
        }

        while( --i > 0 )
        {
            points.push({
                x: params.x + i * x_incr,
                y: params.y + this.height + y_arr[i] * this.height
            })
        }

        // points.push({
        //     x: params.x + params.width,
        //     y: params.y + this.height
        // });

        points.push( points[0] );


        return [{
            new: "path",
            class: 'beta_env',
            id: `${params.id}-path`,
            d: SVGPoints.toPath(points)
        }, {
            new: "line",
            x1: params.x,
            x2: params.x,
            y1: params.y - this.height * 2,
            y2: params.y + this.height * 2,
            class: "beta_env_start",
            id: `${params.id}-start`
        }]

    }
    

    getElementViewParams(element) {

        const trajectory = element.querySelector('.display .beta_env');
        const d = trajectory.getAttribute('d');
        
        const points = SVGPoints.toPoints({ 
            type: 'path',
            d
        });

        // part stave wants x and y
        /*
        let x = points[0].x;
        let y = points[0].y;
        let width = points[points.length-1].x - x;
        */

        let bbox = ui_api.getBBoxAdjusted(element);
        let x = bbox.x;
        let y = bbox.y;
        let width = bbox.width;

        console.log("BetaEnv getElementViewParams", width) ;
        let a = parseFloat(element.dataset.a);
        let b = parseFloat(element.dataset.b);
        let duration =  parseFloat(element.dataset.duration);

        return {
            id: element.id,
            x,
            y,
            a,
            b,
            duration,
            width
        }

    }
/*
    dataToViewParams(data, container)
    {
        const parentDef = ui_api.getDefForElement(container);

        // duration to width
        const parent_data_mapping = parentDef.childDataToViewParams(container, data);

        let viewParms = {
            ...this.structs.view, // defaults
            ...ui_api.filterByKeys(data, Object.keys(this.structs.view) ), // gets view values that might in the data
            ...parent_data_mapping,
            id: data.id,
            container: data.container
        }

        console.log(data);
        let y_arr = betaDist(data.a, data.b);

        const n_pts = y_arr.length;
        const x_incr = parent_data_mapping.width / n_pts;
       // console.log(y_arr);

        let points = [{
            x: viewParms.x,
            y: viewParms.y + this.height
        }];

        for(let i = 0; i < n_pts; i++ )
        {
            points.push({
                x: viewParms.x + i * x_incr,
                y: viewParms.y + (1 - y_arr[i]) * this.height
            })
        }
        points.push({
            x: viewParms.x + parent_data_mapping.width,
            y: viewParms.y + this.height
        })
        viewParms.points = points;

        return viewParms;

    }
*/

    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `newPartStave-palette-icon`,
                class: this.class,
                a: 2,
                b: 2,
                duration: 0.2
            })
        }
    }

/*
    editMode( element, enable = false )
    {
        super.editMode(element, enable);
        
        if( enable )
        {
            ui_api.createHandle( 
                // element to use for reference
                element, 
                // xy attrs to use for the handle
                { selector: `#${element.id} .azimLine`, x: "x2", y: "y2"},
                // callback function
                (element_, event) => {
                    const line = element_.querySelector('.azimLine');
                    const x1 = parseFloat(line.getAttribute('x1'));
                    const y1 = parseFloat(line.getAttribute('y1'));
                    
                    let mousePt = ui_api.getSVGCoordsFromEvent(event);
                    
                    let azim = Math.atan2( mousePt.x - x1, mousePt.y - y1);
                    element_.dataset.azim = azim;

                    this.updateFromDataset(element_);

                }
            );
        }


        return true; // << required if defined
    }
    */
}



class BetaEnv_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "BetaEnv";
    }
    
 /**
     * 
     * API function called from controller
     * 
     * @param {*} params 
     * @param {*} obj_ref 
     */
    getFormattedLookup( params, obj_ref )
    {
        return {
            pitch: obj_ref.pitch,
            duration: obj_ref.duration,
            time: obj_ref.time,
            a: obj_ref.a,
            b: obj_ref.b
        };
    }


}


module.exports = {
    ui_def: BetaEnv,
    io_def: BetaEnv_IO
}




// gamma function from https://github.com/substack/gamma.js/blob/master/index.jsw
// transliterated from the python snippet here:
// http://en.wikipedia.org/wiki/Lanczos_approximation

var g = 7;
var p = (/* unused pure expression or super */ null && ([
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
]));

var g_ln = 607/128;
var p_ln = [
    0.99999999999999709182,
    57.156235665862923517,
    -59.597960355475491248,
    14.136097974741747174,
    -0.49191381609762019978,
    0.33994649984811888699e-4,
    0.46523628927048575665e-4,
    -0.98374475304879564677e-4,
    0.15808870322491248884e-3,
    -0.21026444172410488319e-3,
    0.21743961811521264320e-3,
    -0.16431810653676389022e-3,
    0.84418223983852743293e-4,
    -0.26190838401581408670e-4,
    0.36899182659531622704e-5
];

// Spouge approximation (suitable for large arguments)
function lngamma(z) {

    if(z < 0) return Number('0/0');
    var x = p_ln[0];
    for(var i = p_ln.length - 1; i > 0; --i) x += p_ln[i] / (z + i);
    var t = z + g_ln + 0.5;
    return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x)-Math.log(z);
}

function gamma (z) {
    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }
    else if(z > 100) return Math.exp(lngamma(z));
    else {
        z -= 1;
        var x = p[0];
        for (var i = 1; i < g + 2; i++) {
            x += p[i] / (z + i);
        }
        var t = z + g + 0.5;

        return Math.sqrt(2 * Math.PI)
            * Math.pow(t, z + 0.5)
            * Math.exp(-t)
            * x
        ;
    }
}

function beta( a, b )
{
	return Math.exp( lngamma(a) + lngamma(b) - lngamma(a+b) );
}


var len = 100;
var maxIdx = len - 1;
var m_incr = 1 / len;

function betaMode(a, b)
{
    if( a > 1 && b > 1)
        return (a-1)/(a+b-2);
    else if( a == 1 && b == 1) // all 1s
        return 0.5;
    else if( a < 1 && b < 1) // bi modal
        return 0.0001;
    else if( a < 1 && b >= 1)
        return 0.0001;
    else if( a >= 1 && b < 1)
        return 0.9999;
    else if( a == 1 && b > 1)
        return 0.0001;
    else if( a > 1 && b == 1)
        return 0.9999;
    else {
        post("unmatched beta mode %f %f returning 0\n", a, b);
        return 0;
    }
}


function betaNumerator(x, a, b)
{
    var num = Math.pow(x, a-1) * Math.pow(1-x, b-1);    
    return num == Infinity ? 1 : num;
}


function getBetaScalar( a, b, stepsize)
{
    
    // reusing denominator: (betaNum / betaDen) == betaPDF
    var betaDenominator = beta(a, b);
    
    if( a > 1 && b > 1)
        return 1. / (betaDenominator * ( betaNumerator( (a-1)/(a+b-2), a, b ) / betaDenominator ));
    else if( a > 1 && b == 1 )
        return 1. / (betaDenominator * ( betaNumerator( 1., a, b ) / betaDenominator ));
    else if (a == 1 && b > 1 )
        return 1. / (betaDenominator * ( betaNumerator( 0., a, b ) / betaDenominator ));
    else if (a >= 1 && b < 1 ) // in this case x(1) = inf
        return 1. / (betaDenominator * ( betaNumerator( 1 - stepsize, a, b ) / betaDenominator ));
    else if (a < 1 && b >= 1 ) // in this case x(0) = inf
        return 1. / (betaDenominator * ( betaNumerator( stepsize, a, b ) / betaDenominator ));
    else if (a < 1 && b < 1 )
    {
        if( a > b) // if a > b, then use x(1 - stepsize)
            return 1. / (betaDenominator * ( betaNumerator( 1 - stepsize, a, b ) / betaDenominator ));
        else
            return 1. / (betaDenominator * ( betaNumerator( stepsize, a, b ) / betaDenominator ));
    }
    else if( a == 1 && b == 1 )
        return 1.;
    else
        post("unknown situation", a, b, '\n');
    
    return 0;
    
}


var min_coef = 0.000001;

function betaDist(a,b)
{
	a = a <= min_coef ? min_coef : a;
	b = b <= min_coef ? min_coef : b;
		
    var  m_wind_norm_coef = getBetaScalar(a, b, m_incr);
	var normalized = [];
	
	for( var i = 0; i < len; ++i)
	{
		var phase = i * m_incr;

        var v = betaNumerator(phase, a, b) * m_wind_norm_coef;
		if( v < 0.000001 ) v = 0;
		if( v > 1 ) v = 1;

		normalized.push( v );
	}

	return normalized;

}


/***/ }),

/***/ 350:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20); 

class CartesianPlot extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "CartesianPlot";
        this.palette = [ "DataPoint"];

        this.margin = 20;
        this.half_margin = this.margin / 2.;

    }

    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                x_param: "centroid",
                y_param: "spread",
                x: 100,
                y: 100,
                width: 800,
                height: 600
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                height: 20, 
                width: 20
            },

            children: {
                data: {
                    centroid: 0,
                    spread: 0,
                    amplitude: 0
                },
                view: {
                    x: 0,
                    y: 0
                }
            }
        }
    }

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new:    "rect",
            id:     `${params.id}-rect`,
            class:  'CartesianPlot-rect',
            x:      params.x,
            y:      params.y,
            height: params.height,
            width:  params.width
        };

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const rect = element.querySelector('.display .CartesianPlot-rect');

        return {
            id: element.id,
            x: parseFloat(rect.getAttribute('x')),
            y: parseFloat(rect.getAttribute('y')),
            width: parseFloat(rect.getAttribute('width')),
            height: parseFloat(rect.getAttribute('height'))
        }

    }
    
    /**
     * note: this container is a "top level" DURATION container, and so for the moment we are not querying
     * the parent for info, because the here the width is determined by the duration, and the parent
     * is purely graphical, and has no knowledge of duration.
     */

    dataToViewParams(data, container)
    {      

        let viewInData = ui_api.filterByKeys(data, Object.keys(this.structs.view) );

        return {
            ...this.structs.view, // defaults
            ...viewInData, // view params passed in from data
            id: data.id
        }
     
    }

    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `CartesianPlot-palette-icon`,
                class: this.class
            })
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data)
    {
        
        const x_param = this_element.dataset.x_param;
        const y_param = this_element.dataset.y_param;

        if( ui_api.hasParam(child_data, [ x_param, y_param ] ) )
        {
            const bbox = ui_api.getBBoxAdjusted(this_element);

            let x = bbox.x + (child_data[ x_param ] * bbox.width );
            let y = bbox.y + bbox.height - (child_data[ y_param ] * bbox.height );

            return {
                x,
                y
            }
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
        // no updates from view at the momement

        const x_param = this_element.dataset.x_param;
        const y_param = this_element.dataset.y_param;

        if( ui_api.hasParam(child_viewParams, [ "x", "y" ] ) )
        {
            const bbox = ui_api.getBBoxAdjusted(this_element);

            let ret = {};

            ret[x_param] = (child_viewParams.x - bbox.x) / bbox.width;
            ret[y_param] = 1 - ((child_viewParams.y - bbox.y) / bbox.height);


            return ret;
        }

    }

    /**
     * 
     * @param {Element} element 
     * 
     * called after child object has been added in order to adjust 
     * drawing of the container element
     * 
     */
    updateAfterContents( element ) {}

    updateFromDataset(element){

        /**
         * here is where we might want to change the x_ and y_ params
         * for mapping the children
         */

    }

   

}

class CartesianPlot_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "CartesianPlot";
    }
    
}


module.exports = {
    ui_def: CartesianPlot,
    io_def: CartesianPlot_IO
}



/***/ }),

/***/ 564:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 

class ColorPitch extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "ColorPitch";
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                pitch: 55,
                duration: 0.1
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                r: 4,
                color: 'rgba(255,0,255,1)'
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        console.log('test', params);

        return {
            new: "circle",
            class: 'notehead',
            id: `${params.id}-notehead`,
            cx: params.x,
            cy: params.y,
            r: params.r,
            style: {
                fill: params.color
            }
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
        const color = circle.style.fill;

        return {
            id: element.id,
            x,
            y,
            r,
            color
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
                r: 2,
                color: 'rbga(255, 0, 255, 1)'
            })
        }
    }

    dataToViewParams(data, container)
    {
        const parentDef = ui_api.getDefForElement(container);
        
        let color_val = (data.pitch / 127.) * 255;
        let color = `rgba( ${color_val}, 0, 255, 1)`;

        return {
            ...this.structs.view, // defaults
            ...ui_api.filterByKeys(data, Object.keys(this.structs.view) ), // gets view values that might in the data
            ...parentDef.childDataToViewParams(container, data),
            
            // other mappings that the parent doesn't know about might be added here
            color,
            id: data.id,
            container: data.container // set container/parent id
        }
     
    }

    /**
     * API function called from controller
     * 
     * @param {Element} element html/svg element to translate
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    drag(element, event) 
    {
        if( this.m_mode == "edit" )
        {
            //console.log('drag in edit mode');
        }
        else
        {
         //   console.log('drag in mode', this.m_mode);

            // maybe rename... sets translation in transform matrix, but doesn't apply it
            ui_api.translate(element, event.delta_pos);

            let viewParams =  this.getElementViewParams(element);

            // this can be resused in most cases
            // if x and y are in the viewParams
            viewParams.x += event.delta_pos.x;
            viewParams.y += event.delta_pos.y;

            let container = ui_api.getContainerForElement(element);
            let data = this.viewParamsToData(viewParams, container);


            /**
             * in this example, we wanted to update the color of the notehead
             * so we used the dataToViewParams function to do the mapping from
             * pitch to color, and then update the notehead color from the mouse 
             * interaction. 
             * 
             * Since the mapping is from pitch to color only (not color to pitch), 
             * we didn't need to add the mapping in viewParamsToData.
             * 
             */
            let newView = this.dataToViewParams(data, container);

            /**
             * note that usually we would make a preview of the change from dragging
             * and not change the actual value of the symbol until mouse up, which then
             * calls the applyTransformToData function. 
             * 
             * But for the color example we are setting the notehead value directly, so the
             * value has already been updated when the applyTransformToData function is called.
             * 
             */
            let updateColor = {
                key: "svg",
                val: {
                    id: `${data.id}-notehead`,
                    style: {
                        fill: newView.color
                    }
                }
            };

            console.log('updating color', updateColor );

            ui_api.drawsocketInput([
                updateColor,
                ui_api.getDataTextView(data)
            ])
        }

       
        return true; // return true if you are handling your own translation
    }


}

class ColorPitch_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "ColorPitch";
    }
    
}



module.exports = {
    ui_def: ColorPitch,
    io_def: ColorPitch_IO    
}



/***/ }),

/***/ 558:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 

class DataPoint extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "DataPoint";
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                centroid: 0,
                spread: 0,
                amplitude: 0
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

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
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


}

class DataPoint_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "DataPoint";
    }
    
}



module.exports = {
    ui_def: DataPoint,
    io_def: DataPoint_IO    
}



/***/ }),

/***/ 783:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 


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
        this.lookup = super.default_container_lookup;

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



/***/ }),

/***/ 16:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 


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
     * @param {Event}   event (optional) include the mouse event for mode handling
     */
     childViewParamsToData(this_element, child_viewParams, event = null) 
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
            ui_api.svgPreviewFromViewAndData(viewObj, data_union, `.notehead`) : //<< relative position
            ui_api.svgFromViewAndData(viewObj, data_union) );

        ui_api.drawsocketInput( drawObj );

        if( !preview ){
            let outObj = {};
            outObj[dataObj.id] = viewParams;
            ui_api.outlet({ viewParams: outObj });
        }
            
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

/***/ }),

/***/ 670:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 

class Measure extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "Measure";
        this.palette = [ "AzimNote", "BasicSymbol", "ColorPitch", "BetaEnv"];
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                duration: 1,
                barlineType: "barline"
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                height: 20, 
                width: 20, 
                barlineType: "barline"
            },

            children: {
                data: {
                    time: 0,
                    duration: 1
                },
                view: {
                    x: 0,
                    width: 100
                }
            }
        }
    }

    drag(element, pos){}

    display(params) {

        console.log(params);
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [{
            new: "rect",
            id : `${params.id}-meterbox`,
            class: 'meterbox', 
            x: params.x,
            width: params.width,
            y: params.y,
            height: params.height
        }, {
            new: "line",
            id : `${params.id}-barline`,
            class: params.barlineType, 
            x1: params.x,
            x2: params.x,
            y1: params.y ,
            y2: params.y + params.height
        }];
    }
    
    getElementViewParams(element) {

        const rect = element.getElementById(`${params.id}-meterbox`);
        const line = element.getElementById(`${params.id}-barline`);

        return {
            id: element.id,
            barlineType: line.dataset.barlineType,
            x: parseFloat(rect.getAttribute('x')),
            y: parseFloat(rect.getAttribute('y')),
            height: parseFloat(rect.getAttribute('height')),
            width: parseFloat(rect.getAttribute('width'))
        }
    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `newMeasure-palette-icon`,
                class: this.class
            })
        }
    }

}

class Measure_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "Measure";
        this.lookup = super.default_container_lookup;
    }
    
    getFormattedLookup(params, obj_ref )
    {

        let ret = {
            time: [],
            duration: [],
            pitch: []
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
                    ret.pitch.push(event.pitch);
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
    ui_def: Measure,
    io_def: Measure_IO
}



/***/ }),

/***/ 890:
/***/ ((module) => {


class NodescoreAPI_UI 
{
    constructor()
    {
        this.class = "NodescoreAPI";
    }

    changeNoteColor(params)
    {
        let notes = document.querySelectorAll('.symbol.FiveLineStaveEvent');


        notes.forEach( el => {
            ui_api.sendToServer({
                key: "data",
                val: {
                    id: el.id,
                    midi: Number(el.dataset.midi) + params.interval
                }
            })
        });


    }
    
}

class NodescoreAPI_IO
{
    constructor()
    {
        this.class = "NodescoreAPI";
    }

    transpositionTransform(params)
    {

        if( typeof params.args != "undefined" )
        {
            let args = Array.isArray(params.args) ? params.args : [ params.args ];

            let interval = Number(args[0]);

            let model = io_api.getModel();

            let updates = [];
            model.forEach( el => {
                if( el.class == "FiveLineStaveEvent" )
                {
                    let data = {
                        ...el,
                        midi: el.midi + interval
                    };
                    updates.push(data);
                }
            });
    
            io_api.addToModel(updates);
            io_api.sendDataToUI(updates);
        }

        /*
        io_api.outlet({
            exampleCallAPI: {
                model: Object.fromEntries(io_api.getModel()),
                score: io_api.getScore()
            }
        });
        */
    }
    
}


module.exports = {
    ui_def: NodescoreAPI_UI,
    io_def: NodescoreAPI_IO
}



/***/ }),

/***/ 472:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 

class PartStave extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "PartStave";
        this.palette = [ "AzimNote", "BasicSymbol", "ColorPitch", "BetaEnv"];

        this.left_margin = 20;

        this.x2time = 0.001;
        this.time2x = 1000;
        this.y2pitch = 127.; // y is normalized 0-1
        this.pitch2y = 1 / 127.;

    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                duration: 1,
                height: 100
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                height: 20, 
                width: 20
            },

            children: {
                data: {
                    time: 0,
                    pitch: 60,
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

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [{
            new:    "rect",
            class: 'partStave-rect',
            id:     `${params.id}-rect`,
            x:      params.x,
            y:      params.y,
            width:  params.width,
            height: params.height
        },
        {
            new:    "text",
            class:  'staveLabel',
            id:     `${params.id}-label`,
            x:      params.x - this.left_margin,
            y:      params.y + (params.height / 2),
            text:   params.id
        }];

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
                ...this.structs.view,
                id: `newPartStave-palette-icon`,
                class: this.class
            })
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data)
    {

        let ret = {};
        const containerRect = this_element.querySelector('.partStave-rect');

        if( ui_api.hasParam(child_data, 'pitch', true) )
        {
            const bbox_y = parseFloat(containerRect.getAttribute('y'));
            const bbox_height = parseFloat(containerRect.getAttribute('height'));

            ret.y = bbox_y + ((1. - (child_data.pitch * this.pitch2y)) * bbox_height);
        }

        if( ui_api.hasParam(child_data, 'time', true) )
        {
            const bbox_x = parseFloat(containerRect.getAttribute('x'));

            ret.x = bbox_x + ((child_data.time - parseFloat(this_element.dataset.time)) * this.time2x);
        }

        if( ui_api.hasParam(child_data, "duration" ) )
        {
            ret.width = child_data.duration * this.time2x;
        }

        if( child_data.class == "Measure" || child_data.class == "SnapPoint" ){
            ret.y = parseFloat(containerRect.getAttribute('y'));
            ret.height = parseFloat(containerRect.getAttribute('height'));
        }

       // console.log(ret);
        return ret;

    }

    /**
     * 
     * Called by child objects using the template
     * the parent/container object supplies a mapping from view params to data
     * 
     * @param {Element} this_element instance of this element
     * @param {Object}  child_viewParams child data object, requesting information about where to put itself
     * @param {Event}   event (optional) include the mouse event for mode handling
     */
     childViewParamsToData(this_element, child_viewParams, event = null) 
     {
        if( ui_api.hasParam(child_viewParams, ['x', 'y']) ) 
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
                    /*
                    var closest = counts.reduce( function(prev, curr) {
                        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
                      });
                      */
                    child_x = choose_x;

                }
            }

            const containerRect = document.getElementById(`${this_element.id}-rect`);
            const bbox_x = parseFloat(containerRect.getAttribute('x'));
            const bbox_y = parseFloat(containerRect.getAttribute('y'));
            const bbox_height = parseFloat(containerRect.getAttribute('height'));

            let ret = {
                pitch: (1 - ((child_viewParams.y-bbox_y) / bbox_height)) * this.y2pitch,
                time: ((child_x-bbox_x) * this.x2time) + parseFloat(this_element.dataset.time)            
            }

            if( ui_api.hasParam(child_viewParams, "width" ) )
            {
                ret.duration = child_viewParams.width * this.x2time;
            }

            return ret;
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
                    parent: params.id,
                    new: "line",
                    x1: bbox.x + params.time * this.time2x,
                    x2: bbox.x + params.time * this.time2x,
                    y1: bbox.top,
                    y2: bbox.bottom,
                    class: "playbar"
                    
                }
            })
        }
    }

    fooFN(params)
    {
        console.log('hi I have your ', params);
    }


}

class PartStave_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "PartStave";
        this.lookup = super.default_container_lookup;
    }
    
    getFormattedLookup(params, obj_ref )
    {

        let ret = {
            time: [],
            duration: [],
            pitch: []
        };

        let ret_by_type = {};

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                if( typeof ret_by_type[obj.class] == "undefined" ){
                    ret_by_type[obj.class] = {};
                }

                const event = def.getFormattedLookup(params, obj);
                if( event )
                {
                    Object.keys(event).forEach( k => {

                        if( typeof ret_by_type[obj.class][k] == "undefined" ){
                            ret_by_type[obj.class][k] = [];
                        }

                        ret_by_type[obj.class][k].push(event[k]);
                    })

                    /*
                    ret.time.push(event.time);
                    ret.duration.push(event.duration);
                    ret.pitch.push(event.pitch);
                    */
                }
            });
        
        }
        else
        {
            ret_by_type = {
                lookup_error: `no contents element with id "${obj_ref.contents}" found`
            };
        }

        let ret_obj = {};
        ret_obj[obj_ref.id] = ret_by_type;
        
        return ret_obj;
    }
}


module.exports = {
    ui_def: PartStave,
    io_def: PartStave_IO
}



/***/ }),

/***/ 584:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20); 

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
       // console.log(params.points, SVGPoints.toPath(params.points));
        return {
            new: "path",
            class: 'PathSymbol',
            id: `${params.id}-PathSymbol`,
            d: SVGPoints.toPath(params.points)
        }
    }
    
    getElementViewParams(element) {

        const trajectory = element.querySelector('.display .PathSymbol');
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
                        let newEl = this.createNewFromMouseEvent(e);
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
            ...parent_def.childViewParamsToData(container, translated_default, event), 
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
        console.log(" path edit mode", enable);

        return true;
    }



    editMove(e)
    {
    
        this.currentPosition = ui_api.getSVGCoordsFromEvent(e);

      //  console.log("path edit move", this.downTarget, e);
      
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



/***/ }),

/***/ 169:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20) 

/**
 * top level symbol is the frame of the application
 * and allows any child to place itself wherever it wants
 * the root symbol controls the palette and tool menus which are created
 * when a context is selected.
 * the top most context is set in the init.json or score file
 * 
 */

class RootSymbol extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "RootSymbol";

        /**
         * the palette is created in the json file
         * however the user might want to set the tools/palette
         * for the base 
         * 
         * so, probably the tools/palette and metadata should be
         * in the data object, and changeable from the editor
         */
        
        // 
    }

    get structs () {
        return {
            data: {
                class: this.class,
                id : `${this.class}-0`,
                about: "",
                name: "",
                tools: [],
                palette: []
            },
            view: {
                class: this.class,
                id : `${this.class}-0`
            }
        }
    }


    display(params) {
        return {
            new: "g",
            id: `${params.id}`,
            class: "RootSymbol"
        }

    }

    drag(element, pos){}


    dataToViewParams(data, container)
    {
        /**
         * note: this container is a top level application symbol
         */

        return {
            ...this.structs.view, // defaults
            id: data.id
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
        // RootSymbol view is the palettes?
        const viewParams = this.dataToViewParams(dataObj, container);
        const viewObj = this.display(viewParams);        
        const drawObj = (preview ? 
            ui_api.svgPreviewFromViewAndData(viewObj, dataObj) : 
            ui_api.svgFromViewAndData(viewObj, dataObj) );
        ui_api.drawsocketInput( drawObj );

        
        /**
         * maybe here is where we trigger the drawing of the palette and 
         * start up the global event listeners
         * 
         */

    }


    getElementViewParams(element) {}
    
    getPaletteIcon() {}
    

    /**
     * 
     * how to select the top level? needs a menu command probably
     * 
     * @param {*} viewElement 
     */
    getInfoDisplay( viewElement )
    {
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement)
        )
    }
    
    getElementViewParams(element) {}


   
    childDataToViewParams(this_element, child_data)
    {
        return child_data;
    }

    childViewParamsToData(this_element, child_viewParams, event)
    {
        return child_viewParams;
    }

}

class RootSymbol_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "RootSymbol";
    }
    
    comparator(a,b){}
    lookup(params, obj_ref){}

}


module.exports = {
    ui_def: RootSymbol,
    io_def: RootSymbol_IO
}



/***/ }),

/***/ 260:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * actually te snap points should be in the container object, not in the overlay since there could be multiple layers of snapping
 */

const Template = __webpack_require__(20) 

class SnapPoint extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "SnapPoint";
        this.palette = [];
        this.height = 5;
    }

    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0
            }
        }
    }

    drag(element, pos){}

    display(params) {

        console.log(params);
        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "line",
            id : `${params.id}-snapline`,
            class: 'snapline', 
            x1: params.x,
            x2: params.x,
            y1: params.y ,
            y2: params.y + this.height
        };
    }
/*
    fromData(dataObj, container, preview = false)
    {
     //   console.log('container', container, dataObj);
        // merging with defaults in case the user forgot to include something
        const data_union = {
            ...this.structs.data,
            ...dataObj
        };
        
        const viewParams = this.dataToViewParams(data_union, container);
        const viewObj = this.display(viewParams);        
        ui_api.drawsocketInput({
            key: "svg",
            val: {
                container: "floating-overlay",
                ...viewObj
            }
        } );
    }
*/
    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `newSnapPoint-palette-icon`,
                class: this.class
            })
        }
    }

}

module.exports = {
    ui_def: SnapPoint,
    io_def: null
}



/***/ }),

/***/ 55:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * idea: make tool that creates symbols
 * this is a UI element like align or spread evenly tools in Illustrator
 * 
 * acttion. click in palette then prompt to select duration object to subdivide
 * 
 */


const Template = __webpack_require__(20) 

class SubdivisionTool extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "SubdivisionTool";
        this.dividerTypes = ["Measure", "SnapPoint"];
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

    drag(element, event) 
    {
        ui_api.translate(element, event.delta_pos);
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



/***/ }),

/***/ 20:
/***/ ((module) => {

"use strict";

/**
 * Methods called from Controller:
 * 
 * class
 * palette
 * paletteSelected
 * getPaletteIcon
 * fromData
 * editMode
 * selected
 * applyTransformToData
 * currentContext
 * updateAfterContents
 * drag
 * getInfoDisplay
 */


class SymbolBase
{
    /**
     * constructor 
     * sets class name (required), and other optional member variables
     */
    constructor()
    {
        this.class = "template";
        this.palette = [];
        this.m_mode = '';
        this.mouseListening = false;
    }
    

    /**
     * internal helper function that sets defaults for symbol parameters
     */
    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                text: "undefined"
            },

            
            /**
             * container symbols define the parameters that are used when 
             * queried by child calls to childViewParamsToData and childDataToViewParams
             * for example:
 
            children: {
                data: {
                    time: 0
                },
                view: {
                    x: 0
                }
            }
            
            */                            

            
        }
    }


    /**
     * internal method called when drawing
     * maps view parameters to drawing commands
     * 
     * returns drawsocket object
     * 
     * @param {Object} params 
     */
    display(params) { 
        console.error(`${this.class} display is undefined`);

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "text",
            id: `${params.id}-undefined`,
            class: "template",
            x: params.x,
            y: params.y,
            text: "undefined symbol"
        }

    }
    


    /**
     * internal method, should be re-defined in subclass
     * 
     * gets viewParams from element
     * 
     * @param {Element} element the symbol SVG/HTML element to parse to view params
     * 
     * 
     */
    getElementViewParams(element) { 
        console.error(`${this.class} getElementViewParams is undefined`);

        const textEl = element.querySelector('text');
        
        return {
            id: element.id,
            x: parseFloat(textEl.getAttribute('x')),
            y: parseFloat(textEl.getAttribute('y')),
            text: textEl.innerHTML
        }
    }

    /**
     * API function called from controller
     * 
     */
    getPaletteIcon () { 
        console.error(`${this.class} getPaletteIcon is undefined`);

        return {
            key: "svg",
            val: this.display({
                id: `template-palette-icon`,
                class: this.class,
                x: 10,
                y: 10,
                text: "template"
            })
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
        //console.log('template fromData', container, dataObj);
        // merging with defaults in case the user forgot to include something
        const data_union = {
            ...this.structs.data,
            ...dataObj
        };
        
        const viewParams = this.dataToViewParams(data_union, container);
        
        const viewObj = this.display(viewParams);        
        
        const drawObj = (preview ? 
            ui_api.svgPreviewFromViewAndData(viewObj, data_union) : 
            ui_api.svgFromViewAndData(viewObj, data_union) );

        ui_api.drawsocketInput( drawObj );

        if( !preview ) {
            let outObj = {};
            outObj[dataObj.id] = viewParams;
            ui_api.outlet({ viewParams: outObj });
        }

    }


    /**
     * internal mapping function data->viewParams
     * 
     * @param {Object} data 
     * @param {Element} container 
     * 
     * @returns object of view params
     * 
     */
    dataToViewParams(data, container)
    {
        const parentDef = ui_api.getDefForElement(container);
        //console.log('dataToViewParams', data, container);

        return {
            ...this.structs.view, // defaults
            ...ui_api.filterByKeys(data, Object.keys(this.structs.view) ), // gets view values that might in the data
            ...parentDef.childDataToViewParams(container, data),
            
            // other mappings that the parent doesn't know about might be added here

            id: data.id,
            container: data.container // set container/parent id
        }
     
    /**
     * note: This template prototype works only for child objects, the top level element object 
     * is the application which has no built in knowledge of time, duration etc. and so the 
     * childToViewParameters function will not apply the mapping. In the case of top-level symbols,
     * you will need to create your own mapping and put it in the dataToViewParams function
     */

    }


    /**
     * internal mapping function viewParams->data
     * 
     * @param {Object}  viewParams 
     * @param {Element} container
     * @param {Event}   event (optional) include the mouse event for mode handling
     * 
     * returns data object
     * 
     * note that the view params should be able to generate a data object from the view params without access to the element dataset.
     * in some cases, this means that drawing coefficients need to be pulled in the getElementViewParams function
     * 
     */
    viewParamsToData(viewParams, container, event = null)
    {
        const parentDef = ui_api.getDefForElement(container);

        return {
            ...this.structs.data, // defaults
            ...ui_api.filterByKeys(viewParams, Object.keys(this.structs.data) ), // gets data values that might in the view
            ...parentDef.childViewParamsToData(container, viewParams, event),

            // other mappings that the parent doesn't know about might be added here

            class: this.class, // overwrite the classname, since we don't want symbol or selected etc.
            container: container.id // set container/parent id
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
    childViewParamsToData(this_element, child_viewParams, event = null) {
        const this_element_container = ui_api.getContainerForElement(this_element);
        const parentDef = ui_api.getDefForElement(this_element_container);
        return parentDef.childViewParamsToData(this_element_container, child_viewParams, event);
        
        // by default pass on to the parent, since we don't have anything to add
        // the top level will return the child's data fully
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
    childDataToViewParams(this_element, child_data) {
        const this_element_container = ui_api.getContainerForElement(this_element);
        const parentDef = ui_api.getDefForElement(this_element_container);
        return parentDef.childDataToViewParams(this_element_container, child_data);
        // by default pass on to the parent, since we don't have anything to add
        // the top level will return the child's data fully
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
    updateAfterContents( element ) {}

  
    /**
     * 
     * API function called from controller
     * 
     * @param {Object} dataObj 
     * 
     * called from controller in dataToView as a for containers to decide
     * which of it's kind should be the context in case there are more than one
     * 
     */
    getContainerForData(dataObj)
    {
        return document.getElementById(dataObj.container);
    }

    /**
     * API function called from controller
     * called when the user hits [i] when selecting an object
     * 
     * @param {HTML or SVG Element} viewElement element that is being viewed
     * 
     * @returns drawsocket format object(s) to draw
     */
    getInfoDisplay( viewElement )
    {
       // console.log('getInfoDisplay', viewElement );
        ui_api.drawsocketInput(
            ui_api.makeDefaultInfoDisplay(viewElement)
        )
        
    }

    /**
     * 
     * API function called from info panel
     * on update
     * 
     * @param {Element} element element to use for update
     * 
     * called from info panel edit boxes -- the datset is used to update the graphics
     */
    updateFromDataset(element)
    {
        const container = ui_api.getContainerForElement(element);        
        let data = ui_api.getElementData(element, container);
     
        //console.log(element.id, 'updateFromDataset', data);

        this.fromData(data, container);

        // update data 
        ui_api.sendToServer({
            key: "data",
            val: data
        })

        let contents = element.querySelector('.contents');
        let children = contents.children;
        //console.log(element.id, 'contents', children);

        for( let i = 0; i < children.length; i++)
        {
            const child_def = ui_api.getDefForElement(children[i]);
            child_def.updateFromDataset(children[i]);
        }

    }

    /**
     * 
     * internal method
     * called from createNewFromMouseEvent and mousemove in palette mode
     * 
     * @param {Event} event 
     * @param {Element} container 
     */
    mouseToData( event, container )
    {
        console.log("template mouseToData");

        const pt = ui_api.getSVGCoordsFromEvent(event);
        const parent_def = ui_api.getDefForElement(container);

        if( !parent_def )
        {
            console.error(`could not find def for container ${container}`);
        }

        return {
            ...this.structs.data, // set defaults, before overwriting with parent's mapping
            ...parent_def.childViewParamsToData(container, 
                {
                    ...this.structs.view, //get defaults
                    ...pt
                }, 
                event ), 
            id: `${this.class}_u_${ui_api.fairlyUniqueString()}`,
            container: container.id
        }    
    }


    /**
     * (internal method)
     * called when new instance of this object is created by a mouse down event
     * 
     * @param {Event} event mouse event from click
     * 
     * returns new view object in drawsocket format, to be drawn
     * 
     * 
     */
    createNewFromMouseEvent(event)
    {
        console.log("template createNewFromMouseEvent");
        // remove preview sprite
        ui_api.drawsocketInput({
            key: "remove", 
            val: `${this.class}-sprite`
        })

        // generate objectData from Mouse Event
        const container = ui_api.getCurrentContext();
        let data =  this.mouseToData(event, container);
        
        this.fromData(data, container);

        // send new object to server
        ui_api.sendToServer({
            key: "data",
            val: data
        })

        return data;
    }

    /**
     * (internal method)
     * 
     * @param {Event} event mouse event
     * 
     */
    mousemove(event)
    {
        if( event.metaKey && this.m_mode == "palette" )
        {
            // preview of mouse down creation
            const container = ui_api.getCurrentContext();
            let data = this.mouseToData(event, container);
            this.fromData( data, container, true); // sets preview flag to true
        }

    }



    /**
     * API function called from controller
     * 
     * @param {Element} element html/svg element to translate
     * @param {Event} event mouse event, with added delta_pos x/y point
     * 
     * return true to use default translation
     * return false to use custom translation 
     */
    drag(element, event = { delta_pos: {x:0, y:0} } ) 
    {
        if( this.m_mode == "edit" )
        {
            //console.log('drag in edit mode');
        }
        else
        {
         //   console.log('drag in mode', this.m_mode);

            // maybe rename... sets translation in transform matrix, but doesn't apply it
            ui_api.translate(element, event.delta_pos);

            let viewParams =  this.getElementViewParams(element);

            // this can be resused in most cases
            // if x and y are in the viewParams
            viewParams.x += event.delta_pos.x;
            viewParams.y += event.delta_pos.y;

            let container = ui_api.getContainerForElement(element);
            let data = this.viewParamsToData(viewParams, container, event);
            
            ui_api.drawsocketInput(
                ui_api.getDataTextView(data)
            )
        }

       
        return true; // return true if you are handling your own translation
    }

    /**
     * 
     * API function called from controller
     * on mouseup after drag
     * 
     * @param {SVG/HTMLElement} element 
     */
    applyTransformToData(element)
    {
        ui_api.applyTransform(element);

        let viewParams =  this.getElementViewParams(element);
        let container = ui_api.getContainerForElement(element);
        let data =  this.viewParamsToData(viewParams, container);

        ui_api.drawsocketInput({
            key: "svg",
            val: ui_api.dataToHTML(data)
        })

        // send out
        ui_api.sendToServer({
            key: "data",
            val: data
        })

        return true; // << required if defined

    }


    /**
     * 
     * API function called from controller
     * when user selects a symbol
     * 
     * @param {SVG/HTMLElement} element 
     * @param {Boolean} state notifications on selection and deselection
     *  
     */
    selected(element, state)
    {
        console.log('select state', state);
        // return true if you want to disable the default selection
    }

    
    mouseListeners(enable = false )
    {
        if( enable && !this.mouseListening )
        {
            window.addEventListener("mousedown",    this, false );
            window.addEventListener("mousemove",    this, false );
            window.addEventListener("mouseup",      this, false);
            window.addEventListener("keydown",      this, false);
            window.addEventListener("keyup",        this, false);

            this.mouseListening = true;
        }
        else
        {
            ui_api.removeSprites();
            window.removeEventListener("mousedown",     this, false);
            window.removeEventListener("mousemove",     this, false);
            window.removeEventListener("mouseup",       this, false);
            window.removeEventListener("keydown",       this, false);
            window.removeEventListener("keyup",         this, false);
            this.mouseListening = false;
        }
    }

    /**
     * 
     * API function called from controller
     * 
     * @param {Boolean} enable called when entering  "palette" or  "edit"  mode
     * 
     * creation mode starts when the symbol is sected in the palette
     * edit mode is when the symbols is when one symbol is selected (or when you hit [e]?)
     */
    paletteSelected( enable = false ) 
    {

        if( enable )
        {
            this.m_mode = 'palette';
            this.mouseListeners(enable);
        }
        else
        {
            this.m_mode = 'exited palette';
            this.mouseListeners(enable);
        }
    }

    
    /**
     * 
     * (internal method)
     * 
     * handleEvents is a default JS method for handling mouse events
     * 
     * @param {Event} e mouse event
     * 
     * routes and handles events by type, 
     * and program logic
     * 
     * currently only used in palette mode but could be used in other 
     * cases
     * 
     */
    handleEvent(e) {
        switch(e.type)
        {
            case 'keyup':
                if( e.key == "Meta" ){
                    ui_api.removeSprites();
                }
            break;
            case 'mousedown':
                if( e.metaKey ){
                    this.createNewFromMouseEvent(e);
                }
            break;
            case 'mousemove':
                this.mousemove(e);
            break;

        }

    }

    /**
     * 
     * API function called from controller
     * when user hits the [e] button
     * 
     * here we are only setting the status
     * the implementation is in the subclasses
     * 
     * @param {SVG/HTML Element} element 
     * @param {Boolean} enable 
     */
    editMode( element, enable = false )
    {
        if( enable )
        {
            this.m_mode = 'edit';
            this.mouseListeners(enable);
        }
        else
        {
            this.m_mode = 'exited edit';
            this.mouseListeners(enable);
        }

        return true; 
        // return true in subclass
        // otherwise edit mode is not set in the controller
    }


    /**
     * 
     * API function called from controller
     * when user hits the [s] button
     * 
     * here we are only setting the status
     * the implementation is in the subclasses
     * 
     * @param {SVG/HTML Element} element 
     * @param {Boolean} enable 
     */
    currentContext( element, enable = false ) 
    {
        console.log(this.class, " is context ", enable);
        if( enable )
        {
            this.m_mode = 'context';
        }
        else
        {
            this.m_mode = "exited context";
        }
    }

}


class IO_SymbolBase
{
    constructor() {
        this.class = "template"
    }

    /**
     * 
     * API function called from controller
     * 
     * @param {Object} a 
     * @param {Object} b 
     * 
     * comparator for sorting instances of this class type (rectangleStave)
     */
    comparator (a, b) {
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1))
    }


    /**
      *
      * API function called from controller
      *  
      * @param {Object} dataObj data object that has been looked up
      * 
      * script here is called when looking up symbols, and potentially could respond with
      * generative values in realtime
      * 
      */
    lookup( params, obj_ref )
    {
        const start = obj_ref.time;
        const end = start + obj_ref.duration;
        if( start <= params.time && end >= params.time )
        {

            params.phase = (params.time - start) / obj_ref.duration;
            let ret = [{
                ...obj_ref,
                phase: params.phase
            }];


            if( typeof obj_ref.contents != "undefined" )
            {
                obj_ref.contents.forEach( obj => {
                    const def = io_api.defGet(obj.class);
                    const event = def.lookup(params, obj);
                    if( event )
                    {
                        ret.push(event);
                    }
                });
            
            }

            return ret;
        }

        return null;
    }


    default_container_lookup( params, obj_ref )
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
                lookup_error: `no contents element with id "${obj_ref.contents}" found`
            };
        }

        let ret_obj = {};
        ret_obj[obj_ref.id] = ret;
        
        return ret_obj;
    }


    /**
     * 
     * API function called from controller
     * 
     * @param {*} params 
     * @param {*} obj_ref 
     */
    getFormattedLookup(params, obj_ref)
    {
        console.error('getFormattedLookup not defined for class', this.class, 'using default');
        return obj_ref;
    }

    default_container_getFormattedLookup(params, obj_ref )
    {
        let ret_by_type = {};

        if( typeof obj_ref.contents != "undefined" )
        {
            obj_ref.contents.forEach(obj => {
                const def = io_api.defGet(obj.class);
                if( typeof ret_by_type[obj.class] == "undefined" ){
                    ret_by_type[obj.class] = {};
                }

                const event = def.getFormattedLookup(params, obj);
                if( event )
                {
                    Object.keys(event).forEach( k => {

                        if( typeof ret_by_type[obj.class][k] == "undefined" ){
                            ret_by_type[obj.class][k] = [];
                        }

                        ret_by_type[obj.class][k].push(event[k]);
                    })
                }
            });
        
        }
        else
        {
            ret_by_type = {
                lookup_error: `no contents element with id "${obj_ref.contents}" found`
            };
        }

        let ret_obj = {};
        ret_obj[obj_ref.id] = ret_by_type;
        
        return ret_obj;
    }
    
}

module.exports = {
    SymbolBase,
    IO_SymbolBase
};


/***/ }),

/***/ 102:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Template = __webpack_require__(20); 

class SystemContainer extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "SystemContainer";
        this.palette = [ "TextSymbol"];

        this.margin = 20;
        this.half_margin = this.margin / 2.;

        this.x2time = 0.001;
        this.time2x = 1000;

    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                duration: 1,
                height: 100,
                x: 100,
                y: 100,
                x_offset: this.margin * 2
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                height: 20, 
                width: 20
            },

            children: {
                data: {
                    time: 0,
                    height: 100,
                    duration: 1
                },
                view: {
                    x: 0,
                    y: 0,
                    height: 100
                }
            }
        }
    }

    drag(element, pos){}

    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return [{
            new:    "rect",
            id:     `${params.id}-rect`,
            class:  'systemContainer-rect',
            x:      params.x,
            y:      params.y,
            height: params.height,
            width:  params.width
        },
        {
            new: "path",
            id: `${params.id}-bracket`,
            class: 'systemContainer-bracket',
            d: `M ${params.x+this.margin} ${params.y+this.half_margin} h -${this.half_margin} v ${params.height - this.margin} h ${this.half_margin}`
        }];

        /**
         * note that we are returning the drawsocket def that will be 
         * displayed in the "view" group
         * the top level element of the symbol has the root id
         * so here we need to make sure that the id is different
         */

    }
    
    getElementViewParams(element) {

        const rect = element.querySelector('.systemContainer-rect');

        return {
            id: element.id,
            x: parseFloat(rect.getAttribute('x')),
            y: parseFloat(rect.getAttribute('y')),
            width: parseFloat(rect.getAttribute('width')),
            height: parseFloat(rect.getAttribute('height'))
        }

    }
    
    /**
     * note: this container is a "top level" DURATION container, and so for the moment we are not querying
     * the parent for info, because the here the width is determined by the duration, and the parent
     * is purely graphical, and has no knowledge of duration.
     */

    dataToViewParams(data, container)
    {      

        let viewInData = ui_api.filterByKeys(data, Object.keys(this.structs.view) );

        const height = this.margin + (typeof data.height != 'undefined' ? parseFloat(data.height) : this.structs.data.height);
        const width = (2 * this.margin) + parseFloat(data.duration) * this.time2x;

        return {
            ...this.structs.view, // defaults
            ...viewInData, // view params passed in from data
            width,
            height,
            id: data.id
        }
     
    }

    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                ...this.structs.view,
                id: `SystemContainer-palette-icon`,
                class: this.class
            })
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_data child data object, requesting information about where to put itself
     */
    childDataToViewParams(this_element, child_data)
    {
        if( ui_api.hasParam(child_data, Object.keys(this.structs.children.data)) )
        {

            const container = ui_api.getContainerForElement(this_element);
            const this_data = ui_api.getElementData(this_element);

            const viewParams = this.dataToViewParams(this_data, container);

            const contents = this_element.querySelector('.contents');
            const n_childStaves = contents.children.length;

            let y_offset = 0;
            if( n_childStaves > 0 )
            {
                y_offset = this.margin + ui_api.getBBoxAdjusted(contents.children[n_childStaves - 1]).bottom - viewParams.y;

                const thisChild = document.getElementById(child_data.id);
                if( thisChild )
                {
                    y_offset -= ui_api.getBBoxAdjusted(thisChild).height + this.margin;
                }
                
            }

            return {
                y: viewParams.y + y_offset,
                x: viewParams.x + this.margin,
                width: viewParams.width - (this.margin * 2),
                height: child_data.height
            }
        }
    }

    /**
     * 
     * @param {Element} this_element instance of this element
     * @param {Object} child_viewParams child data object, requesting information about where to put itself
     */
    childViewParamsToData(this_element, child_viewParams, event)
    {
        // no updates from view at the momement
    }

    /**
     * 
     * @param {Element} element 
     * 
     * called after child object has been added in order to adjust 
     * drawing of the container element
     * 
     */
    updateAfterContents( element )
    {
        const contents = element.querySelector('.contents');
        const contents_bbox = ui_api.getBBoxAdjusted(contents);

        let dataObj = {
            id: element.id, // I don't love this, but the dataObj needs the id
            duration: element.dataset.duration,
            x: element.dataset.x,
            y: parseFloat(element.dataset.y) - 20,
            height: contents_bbox.height + 40,
            x_offset: element.dataset.x_offset

        }

        const container = ui_api.getContainerForElement(element);

        this.fromData(dataObj, container);

    }

    updateFromDataset(element){}


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
                    parent: params.id,
                    new: "line",
                    x1: bbox.x + params.time * this.time2x,
                    x2: bbox.x + params.time * this.time2x,
                    y1: bbox.top,
                    y2: bbox.bottom,
                    class: "playbar"
                    
                }
            })
        }
    }


}

class SystemContainer_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "SystemContainer";
        this.lookup = super.default_container_lookup;
        this.getFormattedLookup = super.default_container_getFormattedLookup;
    }
    
}


module.exports = {
    ui_def: SystemContainer,
    io_def: SystemContainer_IO
}



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// need to import css

if( typeof window.uiDefs == 'undefined')
    window.uiDefs = new Map();

window.initDef = __webpack_require__(254);

// load defs
const AzimNote = __webpack_require__(934);
const BasicSymbol = __webpack_require__(270);
const BetaEnv = __webpack_require__(755);
const CartesianPlot = __webpack_require__(350);
const ColorPitch = __webpack_require__(564);
const FiveLineStave = __webpack_require__(783);
const FiveLineStaveEvent = __webpack_require__(16);
const PathSymbol = __webpack_require__(584);
const Measure = __webpack_require__(670);
const PartStave = __webpack_require__(472);
const RootSymbol = __webpack_require__(169);
const SnapPoint = __webpack_require__(260);
const SubdivisionTool = __webpack_require__(55);
const DataPoint = __webpack_require__(558);
const SystemContainer = __webpack_require__(102);

const NodescoreAPI = __webpack_require__(890);

// set into def map
uiDefs.set("AzimNote", new AzimNote.ui_def() );
uiDefs.set("BasicSymbol", new BasicSymbol.ui_def() );
uiDefs.set("BetaEnv", new BetaEnv.ui_def() );
uiDefs.set("CartesianPlot", new CartesianPlot.ui_def() );
uiDefs.set("ColorPitch", new ColorPitch.ui_def() );
uiDefs.set("FiveLineStave", new FiveLineStave.ui_def() );
uiDefs.set("FiveLineStaveEvent", new FiveLineStaveEvent.ui_def() );
uiDefs.set("PathSymbol", new PathSymbol.ui_def() );

uiDefs.set("Measure", new Measure.ui_def() );
uiDefs.set("PartStave", new PartStave.ui_def() );
uiDefs.set("RootSymbol", new RootSymbol.ui_def() );
uiDefs.set("SnapPoint", new SnapPoint.ui_def() );
uiDefs.set("SubdivisionTool", new SubdivisionTool.ui_def() );
uiDefs.set("DataPoint", new DataPoint.ui_def() );
uiDefs.set("SystemContainer", new SystemContainer.ui_def() );

uiDefs.set("NodescoreAPI", new NodescoreAPI.ui_def() );


let cssFile = "./defs/css/stylie.css";
let head = document.getElementsByTagName("head");
if( !document.querySelector(`link[href="${cssFile}"]`) )
{
    var cssFileRef = document.createElement("link");
    cssFileRef.rel = "stylesheet";
    cssFileRef.type = "text/css";
    cssFileRef.href = cssFile;
    head[0].appendChild(cssFileRef);
}



/*
BasicSymbol.js          
BasicSymbolGL.js        
BetaEnv.js              
CartesianPlot.js        
ColorPitch.js           
DataPoint.js            
FiveLineStave.js        
LibDefs.js              
Measure.js              
PartStave.js            
PathSymbol.js           
RootSymbol.js           
SnapPoint.js            
SubdivisionTool.js      
SymbolTemplate.js       
RootSymbol.js           
SnapPoint.js            
SubdivisionTool.js      
SymbolTemplate.js       
RootSymbol.js           
SnapPoint.js            
SubdivisionTool.js      
SymbolTemplate.js       
TextSymbol.js           
assets                  
fiveLineStaveEvent.js   
grains.json             
init.json
plot.json
systemContainer.js
sytlie.css
*/



})();

/******/ })()
;