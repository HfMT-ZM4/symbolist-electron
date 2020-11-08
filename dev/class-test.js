
const defaultDataObject  = {
    // class name, refering to the definition below
    className = "default",

    // unique id for this instance
    id : "default-0",
    
    // container objects 
    children = [],
    /**
     *  add user perceptual parameters below here
     *  time, pitch, amp, etc.
     *  page, or other root containers will probably also contain graphic layout information
     **/
    x: 0,
    y: 0,
    width: 800,
    height: 600
}

const defaultViewObject = {
    key: "svg",
    val: {
        new: "g", // container objects us a group to contain their child objects, separate from their display
        id: "default-0", // use same reference id as data object
        class: "default container", // the top level container, using the 'container' class for type selection if needed
        parent: "",
        children: [
            {
                new: "g",
                class: "default display", // the display container, using the 'display' class as a selector
                children : {
                    new: "rect",
                    // id is optional here, since it's tracked by the top level 'g' here
                    x: 0,
                    y: 0,
                    width: 800,
                    height: 600
                }
            },
            {
                new: "g",
                class: "default events", // the events container, using the 'events' class as a selector
                children: [] // empty for now
            }
        ]
       
    }
}

class ObjectDef {
    className = 'testObject';

    constructor(){}

    // used to sort child objects
    comparator(a,b) {
        return (a < b ? -1 : (a == b ? 0 : 1))
    }

    // class names of child objects
    palette = [];


    fromView(view){
        return {
            data: {

            }
        }
    }

    fromData(data){
        return {
            view: {
                
            }
        }
    }




    

}