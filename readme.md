# Symbolist

`Symbolist` is an in-development application for experimental notation, with the goal of creating a working environment for developing symbolic notation for multimedia which can be interpreted and performed by electronics. 

The program aims to provide an open play space, with tools for experimentation, and thinking visually about relationships between representation and interpretation in media performance.

There are three basic ideas at the core of `symbolist`:

* `semantic data`, which specifies the various attributes of information about a symbolic object, in terms of the *meaning* to the author. The `semantic data` is the main holder of information in the system, which arranged as a score can function like a database of hierarchal information. For example, a note might contain information about pitch and duration, or a point in space might contain x, y, and z values.
* `graphic representation`, the visual representation of the semantic data.
* `performance media`, the performance mechanism which can be used to control different media types using the score data as parameter values. 
  
 
Between each of these there is a layer of mapping to and from the `semantic data`: 

* `semantic data` to `graphic representation` is used for the creation of graphic symbols based on input of semantic data.
* `graphic representation` to `semantic data` is used to edit, or create new data entries, based on graphic information.
* `semantic data` to `performance media` is the use of the data as a sequence of events that can be played in time (or used to control other processes not necessarily in time).

## Application Structure

The main structure of the platform is currently in three parts:

* the `editor`, a browser-based graphic user interface which displays the graphic representation of the data, and allows the user to edit and create new data from graphic interaction. The editor loads a library of scripts that define mappings to and from data and graphics formats. The editor receives and outputs data in the semantic format, keeping the concerns of drawing within the browser-side.
* the `server`, a node.js (or electron) based webserver which routes messages between the `editor` and the `io` system, and handles operating system commands like reading and writing files.
* the `io` server, which handles input and output from external sources via OSC. The `io` server holds a copy of the score in its semantic format, and loads a parallel library of user scripts to the `editor` which define the mapping to (and potentially from) other media sources. The `io` server might also be used to reformat the score into a format that can be performed by a another sequencing tool or program like MaxMSP.


## Symbol Types

The `semantic data` is stored in a `model` or `score` which is a hierarchical data object with two types of objects:
* `symbol` objects which specify the details of an instance of a `class` type. Typically, symbols in musical contexts would be something like an *event*.
* `symbol-container` is a symbol object that contain other symbols, or containers. Containers can also be events, the main difference is that the container type has a member value called `contents` which holds an array of sub `symbols`.
  
Containers function to frame their contents, giving them reference and context, like a plot graph frame, which provides a perspective for interpreting a set of data points.

In most cases, to interpret a `symbol` from graphic to semantic representation, the interpreter will need information about the contextual parent `container` of the `symbol`, to define the orientation and scale for interpreting the graphics. 

All symbols are stored in containers, where the top-level container is the score or browser window. 


## Editor
The graphic user interface of `symbolist` is designed around the idea of symbol objects and containers. Graphic objects, or `symbols` are placed in `container` references which define a framing used to interpret the meaning of the `symbol`.

In order to maintain an open and un-opinionated approach to authoring tools, `symbolist` tries not to specify how containers and symbols should look, act, or respond when you interact with them within the application. Rather, the interaction and meanings of the symbols are defined in a library of object `definitions` which create these meanings through mapping semantic data to and from the graphic visualization. Definitions can be shared and loaded to setup different composition environments.

See below for more information about the API for creating symbol definitions. 

### Interface Components

The `symbolist` graphic editor provides a set of basic tools for creating scores using the defined symbols and containers:
* `document view`: the top level view of the application window.
* `menu bar`: the menu bar at the top of the screen or window, which provides access to various application functions.
* `palette`: a set of buttons on in the side bar of the program which display icons of the `symbols` that have been defined for the current selected `container`. 
* `tools`: (not yet implemented in the current version) a set of interactive tools that provide ways of creating new symbols, and applying transformations to existing elements (e.g. alignment of multiple objects, or setting distributing objects, etc.)
* `inspector`: a contextual menu for editing the semantic data of an object, which is then mapped to the graphic representation.

On entering the application, the editor loads a score or initialization file from the default load folder, or you can load a new config file after loading. The config file sets the top-level page setup and palette options.

[ more details here ]

## JSON
Data is stored in JSON format.

The main object data attributes are:
* `id`: a unique identifier name.
* `class`: a reference to the definition of the object type in the user-definition library.
* `contents`: an array of other objects that a container object holds.


For example a simple `symbol` object might look like:
```
{
    "id" : "foo",
    "class" : "legs",
    "action" : "jump",
    "startTime" : 0.1
}
```

Here we see an object with the `id` "foo", which is of class type `legs`, that has an attribute `action` associated with it and a stat time.

And here is a simple example of a `container` object of a type class `timeline`, which holds two `leg` actions:

```
{
    "id" : "bar",
    "class" : "timeline",
    "duration" : 1,
    "contents" : [{
        "id" : "foo-1",
        "class" : "legs",
        "action" : "jump",
        "startTime" : 0.1
    },{
        "id" : "foo-2",
        "class" : "legs",
        "action" : "sit",
        "startTime" : 0.2
    }]
}

```


## Score Format

Score files load data into the editor view, and load tools and UI elements into the editor window.
* `about`: description of the file
* `name`: title 
* `tools`: see above
* `palette`: see above
* `score`: the top-level `symbol container` of the document

An example initialization config file:

```
{
    "about": "symbolist will read a json file to configure the palette setup",
    "name": "first layout",
    "tools": [],
    "palette": [],
    "score": {
        "id": "demo",
        "class": "systemContainer",
        "x": 200,
        "y": 100,
        "duration": 1,
        "time": 0,
        "contents": {
            "id": "oboe",
            "class": "fiveLineStave",
            "height": 100,
            "lineSpacing": 10,
            "contents": [
                {
                    "class": "fiveLineStaveEvent",
                    "id": "note-1",
                    "container": "oboe",
                    "time": 0.034,
                    "midi": 72,
                    "duration": 0.1
                },
                {
                    "class": "fiveLineStaveEvent",
                    "id": "note-2",
                    "container": "oboe",
                    "time": 0.085,
                    "midi": 74,
                    "duration": 0.1
                }
            ]
        }
    }
}
```

## Graphic Display Format

The graphic representation of symbols is in SVG format, which is laid out in the `index.html` file. The `drawsocket` SVG/HTML/CSS wrapper is being used for convenience, to provide a shorthand method of creating and manipulating browser window elements. However, since the `ui_controller` and user definition scripts are all being processed in the browser, scripts are free to use traditional JS approaches to manipulating the browser DOM.

Since `symbolist` is constantly mapping to and from semantic data and its graphic representation, we are using the HTML [dataset](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) feature to store the semantic data inside the SVG object.
).

Typically, the `id` attribute is used to quickly identify graphic objects, for the sake of clarity this is being left out of the examples below.

### Symbol
The SVG format for a `symbol` is:

```
<g  class="symbolClassName symbol" data-time="0.1" data-duration="1">
     <circle .... />
</g>
```
Where the CSS class is a list of selectors, with the name of the class type `symbolClassName` first, followed by the identifier class `symbol`. 

Note that the order is important: **the symbol class type must be first**.

The additional class `symbol` is required in order for the `ui_controller` to properly select the symbols with all of its component parts. The `symbol` class marks the top-level of the object.

The semantic data is also stored in the top-level symbol `<g>` element, using the HTML dataset feature, marked with the prefix `data-`.

### Container
For `container` symbols, there are two sub groups which separate the display for this symbol and its contents:

```
<g class='containerClassName symbol container' data-time="0.1" data-duration="1" >
    <g class='containerClassName display'>
         <line .... />
    </g>
    <g class='containerClassName contents'>
        <g class"symbolClassName symbol" data-time="0.1" data-duration="1">
            <circle .... />
        </g>
    </g>
</g>
 ```

As with the symbol format, the `container` format has a top-level `<g>` group tag, which is identified by the class name as the first element, followed by the class `symbol` which marks the top-level grouping object of the symbol, followed by the class `container` which marks this objects as a container type.

The two sub-groups within the `container` type are: 
* `display` a group that holds the visual display of the container symbol, and
* `contents` which contains other symbols

Symbols and containers could also potentially be HTML elements instead of SVG. In the case of HTML you would use `<div>` tags instead of SVG `<g>`:
html:
```
<div class='containerClassName symbol container'>
    <div class='containerClassName display'></div>
    <div class='containerClassName contents'></div>
</div>
```


# IO Messages

`symbolist` has built in handlers for a set of features, which can be extended by user scripts.

# Library Definitions API

Definition scripts are composed as Javascript modules which are loaded into the program at runtime.

Eventually it is planned to provide a set of tools in the GUI for defining a mapping definition graphically but this is not yet implemented.

There are two types of definition scripts:
* `ui` definitions perform user interactions and mapping between semantic data representation and graphic representation.
* `io` definitions are used to assist in the lookup/playback and mapping of the semantic data to media like sound synthesis, video, etc.

Currently, the system uses the same `.js` file to hold both the `ui` and `io` definitions, and uses the following pattern:

```
// global definitions

const className = "foo";

let dataInstance = {
    class: className,

    // unique id for this instance
    id : `${className}-0`,
    
    time: 0,
    duration: 0.1,
    note: 'c:5'
}


// ui_api api object passed in to def on initialization from ui controller

const ui_def = function(io_api)
{
    function getPaletteIcon(){}
    // ... and other definitions


    // returns object with references to API values callbacks

    return {
        class: className,
        getPaletteIcon,
    }

}

const io_def = function(io_api)
{
    function comparator (a, b) {
        return (a.time < b.time ? -1 : (a.time == b.time ? 0 : 1))
    }
    // ... and other definitions

    // returns object with references to API values callbacks

    return {
        class: className,
        comparator,
        lookup
    }
}

module.exports = {
    ui_def,
    io_def
}

```

## UI Definitions

### module.exports
Values and UI handler callbacks defined and exported to the `UI Controller`:

__Required__
* `class` (string) the name of the class
* `dataInstance` (object) the default values for the semantic data
* `palette` (array) used for container classes, an array of names of other classes that can be used within this container type.
* `getPaletteIcon` ()=> return the icon for display in the palette toolbar
* `getInfoDisplay` ()=> return drawing commands for the inspector contextual menu (see `makeDefaultInfoDisplay` below).

* `paletteSelected`: (true/false)=> called when the user clicks on the palette icon for this symbol, used to trigger custom UI for creating new symbols from mouse data. Scripts should define mouse callbacks internally. Generally `cmd-click` is the way to create a new object.


* `fromData` called from `ui_controller` when data is received and needs to be mapped to graphic representation.
* `updateFromDataset` called from the inspector, when elements of the data should be updated.
        
__Optional__
* `editMode` (element, true/false)=> called from ui controller when entering edit mode
* `selected` (element, true/false)=> called from ui controller on selection, return true if selection is handled in the script, false will trigger the default selection mechanics.
* `translate` (element, delta_pos) => called from ui on click drag from a window event listener which works better than a local listener. Return true if handled by the symbol. The `ui_api.translate` can be used to translate the object using the API function by appying a transform matrix to the top-level group object. 
* `applyTransformToData` (optional but usually needed): on mouseup, if selected objects have changed, the ui controller calls `applyTransformToData` which applies the transform matrix to the SVG attribute values. This is important becuase the attribute values are used for mapping. Inside the `applyTransformToData` function, the `ui_api.applyTransform` can be used to apply the transform to the SVG data, and then you will want a function like `mapToData` to map the updated graphic information to the data.

__Typical Internal Functions__
These functions have no specific required name or use outside the definition, but are used in the common script patterns so far:

* `window event listeners` to handle mouse interaction, typically created in the `paletteSelected` and `editMode` functions.
* `creatNewFromMouseEvent`: a handler mouse down creation of new semantic data and graphic representation pair. Often some parts of the data are using default values set in the `dataInstance`. Optionally, more advanced UI interaction could be used to create different aspects of the data, for example using mouse drag or key modifiers.
* `mapToView` mapping from data to graphic view, usually called from `fromData`, but also used in `updateFromDataset`
* `mapToData` map from the graphic view to data representation
* `viewDisplay` helper function to input view parameters, and return a `drawsocket` format object to send to the browser.

### UI API helper functions:
The following functions are provided by the `ui_api` which is available to symbol definitions:
* `uiDefs`, // access to the defs in the defs
* `drawsocketInput`,
* `sendToServer`, // renderer-event
* `fairlyUniqueString`,
* `getCurrentContext`,
* `getSelected`,
* `dataToHTML`,
* `makeDefaultInfoDisplay`,
* `translate`,
* `applyTransform`,
* `getSVGCoordsFromEvent`,
* `getBBoxAdjusted`,
* `svgObj`,
* `scrollOffset`,   
* `insertSorted`, 
* `insertSortedHTML`,
* `insertIndex`,

* `ntom`,
* `mton`,
* `ftom`, 
* `mtof`,
* `ratio2float`,
* `reduceRatio`,
* `getRatioPrimeCoefs`,
* `parseRatioStr`


## IO Definitions

### module.exports
Values and handler callbacks defined and exported to the `IO Controller`:

**Required**
* `class`: (string) class name, corresponding to class name in UI Definition.
* `comparator`: (a,b)=> comparator function to use to sort this symbol type, return -1, 0, or 1
* `lookup`: (params, obj_ref) => hit detection function called when looking up from query point, returns information to send back to caller. `params` are user parameters included in the lookup query, `obj_ref` is the instance of this class type.

### IO API helper functions:
* `modelGet`
* `modelHas`
* `defGet`
* `defHas`






[ ... documentation in process! please excuse spelling and fragmentation ... ]

Each container's `definition` file has an attribute `palette` which lists the supported `symbol` class names that can be used in the `container`.
