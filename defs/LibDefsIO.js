
// need to import css

const ioDefs = new Map();

const initDef = require('./init.json');

// load defs
const AzimNote = require('./lib/AzimNote');
const BasicSymbol = require('./lib/BasicSymbol');
const BetaEnv = require('./lib/BetaEnv');
const CartesianPlot = require('./lib/CartesianPlot');
const ColorPitch = require('./lib/ColorPitch');
const FiveLineStave = require('./lib/FiveLineStave');
const FiveLineStaveEvent = require('./lib/FiveLineStaveEvent');
const Measure = require('./lib/Measure');
const PartStave = require('./lib/PartStave');
const RootSymbol = require('./lib/RootSymbol');
//const SnapPoint = require('./SnapPoint');
//const SubdivisionTool = require('./SubdivisionTool');
const DataPoint = require('./lib/DataPoint');
const SystemContainer = require('./lib/SystemContainer');


// set into def map
ioDefs.set("AzimNote", new AzimNote.io_def() );
ioDefs.set("BasicSymbol", new BasicSymbol.io_def() );
ioDefs.set("BetaEnv", new BetaEnv.io_def() );
ioDefs.set("CartesianPlot", new CartesianPlot.io_def() );
ioDefs.set("ColorPitch", new ColorPitch.io_def() );
ioDefs.set("FiveLineStave", new FiveLineStave.io_def() );
ioDefs.set("FiveLineStaveEvent", new FiveLineStaveEvent.io_def() );
ioDefs.set("Measure", new Measure.io_def() );
ioDefs.set("PartStave", new PartStave.io_def() );
ioDefs.set("RootSymbol", new RootSymbol.io_def() );
//ioDefs.set("SnapPoint", new SnapPoint.io_def() );
//ioDefs.set("SubdivisionTool", new SubdivisionTool.io_def() );
ioDefs.set("DataPoint", new DataPoint.io_def() );
ioDefs.set("SystemContainer", new SystemContainer.io_def() );

module.exports = {
    ioDefs,
    initDef
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


