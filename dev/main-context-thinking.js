
const defaultContext = {
    id: "main-svg", // unique id used as key for model Map()
    class: "svg", // required for lookup in to defs
    //  data items (user defined):  <-- should this be wrapped to protect scope?
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    // sorting for child objects using data items
    comparator: (a,b) => { 
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1));
    },
    // use utills.insertSorted(el, arr, comparator)
    contents: [],
    // id of parent, for the root element this is null
    parent: null
}