
function template(){

    this.className = "template";

    this.palette = [];

    this.structs = {

        data: {
            class: this.className,
            id : `${this.className}-0`,
            time: 0
        },
        
        view: {
            class: this.className,
            id: `${this.className}-0`, 
            x: 0,
            y: 0,
            r: 2
        },

        /*
        childStructs: {
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

console.log( JSON.stringify(template, null, 2) );