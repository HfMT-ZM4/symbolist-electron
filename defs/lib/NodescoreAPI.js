
class NodescoreAPI_UI 
{
    constructor()
    {
        this.class = "NodescoreAPI";
    }

    exampleUICallAPI(params)
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

    exampleCallAPI(params)
    {

        let model = io_api.getModel();

        model.forEach( el => {
            if( el.class == "FiveLineStaveEvent" )
            {
                let data = {
                    ...el,
                    midi: el.midi + params.interval
                };

                io_api.addToModel(data);
                io_api.sendDataToUI(data);

            }
        })




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

