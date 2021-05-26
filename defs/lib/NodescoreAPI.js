const Template = require('./SymbolTemplate') 

class NodescoreAPI_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "NodescoreAPI";
    }

    exampleCallAPI(params)
    {
        io_api.outlet({
            exampleCallAPI: {
                model: Object.fromEntries(io_api.getModel()),
                score: io_api.getScore()
            }
        });
    }
    
}


module.exports = {
    ui_def: null,
    io_def: NodescoreAPI_IO
}

