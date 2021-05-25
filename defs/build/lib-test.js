let foo = require('./io.defs.bundle');

let defs = foo.ioDefs;

console.log( defs.get("AzimNote").getFormattedLookup(1,2) );