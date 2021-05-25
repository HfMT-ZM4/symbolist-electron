
// need to import css

if( typeof window.uiDefs == 'undefined')
    window.uiDefs = new Map();


window.initDef = require('./init.json');

// load defs
const AzimNote = require('./AzimNote');
const BasicSymbol = require('./BasicSymbol');
const BetaEnv = require('./BetaEnv');
const CartesianPlot = require('./CartesianPlot');
const ColorPitch = require('./ColorPitch');
const FiveLineStave = require('./FiveLineStave');
const Measure = require('./Measure');
const PartStave = require('./PartStave');
const RootSymbol = require('./RootSymbol');
const SnapPoint = require('./SnapPoint');
const SubdivisionTool = require('./SubdivisionTool');
const DataPoint = require('./DataPoint');
const SystemContainer = require('./SystemContainer');


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


