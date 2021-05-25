
// need to import css

const ioDefs = new Map();

const initDef = require('./init.json');

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
//const SnapPoint = require('./SnapPoint');
//const SubdivisionTool = require('./SubdivisionTool');
const DataPoint = require('./DataPoint');
const SystemContainer = require('./SystemContainer');


// set into def map
ioDefs.set("AzimNote", new AzimNote.io_def() );
ioDefs.set("BasicSymbol", new BasicSymbol.io_def() );
ioDefs.set("BetaEnv", new BetaEnv.io_def() );
ioDefs.set("CartesianPlot", new CartesianPlot.io_def() );
ioDefs.set("ColorPitch", new ColorPitch.io_def() );
ioDefs.set("FiveLineStave", new FiveLineStave.io_def() );
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


