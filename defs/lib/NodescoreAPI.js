
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

