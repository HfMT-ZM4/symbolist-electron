
// need to import css

if( typeof window.uiDefs == 'undefined')
    window.uiDefs = new Map();


window.initDef = require('./init.json');

// load defs
const AzimNote = require('./lib/AzimNote');
const BasicSymbol = require('./lib/BasicSymbol');
const BetaEnv = require('./lib/BetaEnv');
const CartesianPlot = require('./lib/CartesianPlot');
const ColorPitch = require('./lib/ColorPitch');
const FiveLineStave = require('./lib/FiveLineStave');
const Measure = require('./lib/Measure');
const PartStave = require('./lib/PartStave');
const RootSymbol = require('./lib/RootSymbol');
const SnapPoint = require('./lib/SnapPoint');
const SubdivisionTool = require('./lib/SubdivisionTool');
const DataPoint = require('./lib/DataPoint');
const SystemContainer = require('./lib/SystemContainer');


// set into def map
uiDefs.set("AzimNote", new AzimNote.ui_def() );
uiDefs.set("BasicSymbol", new BasicSymbol.ui_def() );
uiDefs.set("BetaEnv", new BetaEnv.ui_def() );
uiDefs.set("CartesianPlot", new CartesianPlot.ui_def() );
uiDefs.set("ColorPitch", new ColorPitch.ui_def() );
uiDefs.set("FiveLineStave", new FiveLineStave.ui_def() );
uiDefs.set("Measure", new Measure.ui_def() );
uiDefs.set("PartStave", new PartStave.ui_def() );
uiDefs.set("RootSymbol", new RootSymbol.ui_def() );
uiDefs.set("SnapPoint", new SnapPoint.ui_def() );
uiDefs.set("SubdivisionTool", new SubdivisionTool.ui_def() );
uiDefs.set("DataPoint", new DataPoint.ui_def() );
uiDefs.set("SystemContainer", new SystemContainer.ui_def() );


let cssFile = "./css/stylie.css";
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


