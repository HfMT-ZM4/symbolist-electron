# Symbolist 

`Symbolist` is an in-development application for experimental notation, with the goal of creating a working environment for developing symbolic notation for multimedia which can be interpreted and performed by electronics. 

The program aims to provide an open play space, with tools for experimentation, and thinking visually about relationships between representation and interpretation in media performance.

# Installation

1. Install `node.js`.
2. install electron and webpack globally `npm install -g electron webpack webpack-cli`. 
3. Download or clone the project repository folder.
4. run `npm install` inside the project folder.
5. run `electron .` to start the `symbolist` application. 
    * If running in `vs code` you should be able to run via the debugger, defined in the `.vscode/launch.json` file. Be sure to check that `runtimeExecutable` path matches your Electron install location which will vary based on your operating system.
6. If you are working with custom symbol definition classes, you need to run webpack to bundle the files for use in the browser. See the `/defs` folder for more information. For convenience, you can run `npm run build` in the defs folder to build the files.
   
# About

There are three basic ideas at the core of `symbolist`:

* `semantic data`, which specifies the various attributes of information about a symbolic object, in terms of the *meaning* to the author. The `semantic data` is the main holder of information in the system, which arranged as a score can function like a database of hierarchal information. For example, a note might contain information about pitch and duration, or a point in space might contain x, y, and z values.
* `graphic representation`, the visual representation of the semantic data.
* `performance media`, the performance mechanism which can be used to control different media types using the score data as parameter values. 
  
Between each of these there is a layer of mapping to and from the `semantic data`: 

* `semantic data` to `graphic representation` is used for the creation of graphic symbols based on input of semantic data.
* `graphic representation` to `semantic data` is used to edit, or create new data entries, based on graphic information.
* `semantic data` to `performance media` is the use of the data as a sequence of events that can be played in time (or used to control other processes not necessarily in time).]
* mapping between `performance media` and `graphic representation` is achieved through first mapping to semantic data.

## Application Structure

The main structure of the platform is currently in three parts:

* the `editor`, a browser-based graphic user interface which displays the graphic representation of the data, and allows the user to edit and create new data from graphic interaction. The editor loads a library of scripts that define mappings to and from data and graphics formats. The editor receives and outputs data in the semantic format, keeping the concerns of drawing within the browser-side.
* the `server`, a node.js (or electron) based webserver which routes messages between the `editor` and the `io` system, and handles operating system commands like reading and writing files.
* the `io` server, which handles input and output from external sources via OSC. The `io` server holds a copy of the score in its semantic format, and loads a parallel library of user scripts to the `editor` which define the mapping to (and potentially from) other media sources. The `io` server might also be used to reformat the score into a format that can be performed by a another sequencing tool or program like MaxMSP.


## Symbols

The `semantic data` is stored in a `model` or `score` which is made up of a hierarchical arrangement of objects called `symbols`.

Each `symbol` is a data object which holds a set of data parameters. For example a typical event like `symbol` might represent a note event, and contain `pitch`,  `time` and `duration` parameters. The details of each symbol's data structure and UI interaction is defined in an object `class`.

`symbols` may also be containers that contain other symbols. Container symbols function to frame their contents, giving them reference and context, like a plot graph frame, which provides a perspective for interpreting a set of data points.

In most cases, a symbol mapping definition will require querying the parent container symbol for information, to plot the data into the container frame's context. 

All symbols are stored in container symbols.

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

A typical sequence of creating a score might be as follows:

1. the user opens a workspace, with one or more containers displayed on the screen, for example an empty rectangle which is like a piece of paper.
2. selecting the "paper" container rectangle, the user then sets the container as the new `context`, by pressing the `[s]` key (or selecting from the application menu).
3. once setting the context, the `palette` toolbar is populated with icons of symbols that are defined with the selected container context type.
4. clicking on one of the symbol icons, puts the interface into "creation" or "palette mode", where the mouse interaction is now designed for use with this specific symbol type.
5. holding the CMD button, creates a preview of the symbol how it will appear when you click, and some text is displayed near the mouse that shows the semantic data associated with the graphic representation.
6. after clicking the symbol is placed in the container.
7. depending on the symbol type, you may be able to drag the symbol to a new place in the container, and the associated data is updated as a result.
8. selecting the symbol and hitting the `[i]` button, brings up the inspector window, where you can edit the data and see the graphics updated in response.
9. selecting and pressing the `[e]` button enters "edit mode" which is a modal context where different user interaction could change the values of the symbol in different ways. For example in edit mode you might be able to rotate an object in a certain way, or be able to visualize different connections to the graphic representation to other elements of the score which are not usually highlighted in the score view.


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

Here we see an object with the `id` "foo", which is of class type `legs`, that has an attribute `action` associated with it and a start time.

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


## File Format

Symbolist files are composed in the same way that the data model is stored. The top level symbol will be created in the `top-svg` symbol which is pre-defined in the `index.html` file.

An example initialization config file might look like this:

```
{
    "about" : "symbolist will read a json file to configure the palette setup, this can be used to dynamically change the application layout and tools",
    "id" : "Score",
    "tools" : [],
    "palette" : ["SubdivisionTool", "BasicSymbolGL"],
    "class" : "RootSymbol",
    "contents": { 
        "id" : "trio",
        "class" : "SystemContainer",
        "x": 200,
        "y": 100,
        "duration": 20,
        "time": 0,
        "contents" : [{
            "id" : "oboe",
            "class" : "FiveLineStave",
            "height" : 100,
            "lineSpacing" : 10,
            "duration": 20,
            "time": 0,
            "contents" : []
        },
        {
            "id" : "bassoon",
            "class" : "PartStave",
            "height" : 100,
            "time": 0,
            "duration": 20,
            "contents" : []
        },
        {
            "id" : "synth",
            "class" : "PartStave",
            "height" : 200,
            "time": 0,
            "duration": 20,
            "contents" : []
        }]
    }
}
```


## Graphic Display Format

The graphic representation of symbols is in SVG format, which is laid out in the `index.html` file. The `drawsocket` SVG/HTML/CSS wrapper is being used for convenience, to provide a shorthand method of creating and manipulating browser window elements. However, since the `ui_controller` and user definition scripts are all being processed in the browser, scripts are free to use traditional JS approaches to manipulating the browser DOM.

Since `symbolist` is constantly mapping to and from semantic data and its graphic representation, we are using the HTML [dataset](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) feature to store the semantic data inside the SVG object.
).

Typically, the `id` attribute is used to quickly identify graphic objects, for the sake of clarity this is being left out of the examples below.

### Symbol
The SVG format for a `symbol` is a set of three `<g>` elements:

```
<g  class="symbolClassName symbol" data-time="0.1" data-duration="1">
    <g class='symbolClassName display'></g>
    <g class='symbolClassName contents'></g>
</g>
```

Each symbol grouping element is tagged using CSS class names, following the symbol's unique class name (in this example `symbolClassName`):
* `symbol` marks the top-level grouping object of the symbol
  * `display` a group that holds the visual display of the container symbol, and
  * `contents` which contains other symbols.


Note that the order is important: **the symbol class type must be first**.

The semantic data is also stored in the top-level symbol `<g>` element, using the HTML dataset feature, marked with the prefix `data-`.

For example:

```
<g class='containerClassName symbol container' data-time="0.1" data-duration="1">
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

Symbols and containers could also potentially be HTML elements instead of SVG. In the case of HTML you would use `<div>` tags instead of SVG `<g>`:
html:
```
<div class='containerClassName symbol container'>
    <div class='containerClassName display'></div>
    <div class='containerClassName contents'></div>
</div>
```


# IO Messages

`symbolist` has built in handlers for a set of messages received via OSC, which can be extended by user scripts, using a `key` / `val` syntax, where the `key` specifies the function to call, and the `val` are the parameter values to use for the call.

For example, here is a `lookup` query to find elements that are returned by the parameters `time` in the `container` with the `id` "trio".


```
{
    /key : "lookup:,
    /val : {
        /time : 0.1,
        /id : "trio"
    }
}
```

The OSC message API supports the following keys:
* `data`: adds a data object to the score, and sends to the ui to be mapped to graphical representation. Parameters include:
  * `class` (required) the class type of the object to create
  * `container` (required) the container symbol class to put the object in (in case there are multiple containers that support the same symbol type)
  * `id` (optional) an id to use for the data object, if non is specified a (long) unique string will be generated.
  * Other required or optional parameters will depend on the symbol definition.
```
{
    /key : "data",
    /val : {
        /class : "fiveLineStaveEvent",
        /id : "foo"
        /container : "oboe",
	    /time : 0.13622,
	    /ratio : "7/4",
	    /duration : 0.1,
	    /amp : 1
    }
  }
```
* `lookup`: looks up a point in a container, based on a sorting function specified in the definition. For example, this can be used to get all events active at a given time. Parameters:
  * `id`: (required) the `id` of the container to lookup in. Containers will generally iterate all child objects, so for example if you use the `id` of the top level score you should be looking up in to all sub-containers.
* `getFormattedLookup`: optional function that might be defined in an `io` script that outputs an object formatted for a different type of player/render. For example, this function might return a list of `/x` and `/y` values for use with the `o.lookup~` Max object, or create a MIDI file export etc. All parameters included in the `val` object will be sent to the `getFormattedLookup` as a parameters object. Parameters:
  * `id`: (required)
* `call`: calls a function in the one or both of the class definitions. All of the parameters in the `val` object will be passed to the function as an argument. Return values from the `io` controller are with the tag `return/io` and `return/ui` from the `ui`.
  * `class` (required) class of the object to call
  * `method` (required) name of object function to call
```
{
    /key : "call",
    /val : {
        /function : "functionName",
        /class : "className",
        /id : "foo"
        /someValue : 1,
        /anotherValue : 2
    }
}
```
Note that the system will pass the same call to both definitions, so if both have a function of the same name they will both be called.
* `drawsocket`: forwards drawsocket format messages directly to drawsocket, bypassing the symbolist mapping.


# Library Definitions API

Definition scripts are composed as Javascript modules which are loaded into the program at runtime.

Eventually it is planned to provide a set of tools in the GUI for defining a mapping definition graphically but this is not yet implemented.

There are two types of definition scripts:
* `ui` definitions perform user interactions and mapping between semantic data representation and graphic representation.
* `io` definitions are used to assist in the lookup/playback and mapping of the semantic data to media like sound synthesis, video, etc.

Currently, the system uses the same `.js` file to hold both the `ui` and `io` definitions. To aid in development there is a template file that can be used to handle most of the most common actions.

Using the template, a basic definition might look like this:



```
const Template = require('../lib/SymbolTemplate') 

class BasicSymbol extends Template.SymbolBase 
{
    constructor() {
        super();
        this.class = "BasicSymbol";
    }


    get structs () {
        return {

            data: {
                class: this.class,
                id : `${this.class}-0`,
                time: 0,
                pitch: 55,
                duration: 0.1
            },
            
            view: {
                class: this.class,
                id: `${this.class}-0`, 
                x: 0,
                y: 0,
                r: 2
            }
        }
    }


    display(params) {

        ui_api.hasParam(params, Object.keys(this.structs.view) );
        
        return {
            new: "circle",
            class: 'notehead',
            id: `${params.id}-notehead`,
            cx: params.x,
            cy: params.y,
            r: params.r
        }
    }
    
    getElementViewParams(element) {

        const circle = element.querySelector('.notehead');
        const x = parseFloat(circle.getAttribute('cx'));
        const y = parseFloat(circle.getAttribute('cy'));
        const r = parseFloat(circle.getAttribute('r'));

        return {
            id: element.id,
            x,
            y,
            r
        }

    }


    getPaletteIcon() {
        return {
            key: "svg",
            val: this.display({
                id: `circle-palette-icon`,
                class: this.class,
                x: 10,
                y: 10,
                r: 2
            })
        }
    }


}

class BasicSymbol_IO extends Template.IO_SymbolBase
{
    constructor()
    {
        super();
        this.class = "BasicSymbol";
    }
    
}

module.exports = {
    ui_def: BasicSymbol,
    io_def: BasicSymbol_IO    
}


```

## UI Definitions

### module.exports

Values and UI handler callbacks defined and exported to the `UI Controller`:

 * class
 * palette
 * getPaletteIcon
 * fromData
 * editMode
 * selected
 * applyTransformToData
 * currentContext
 * updateAfterContents
 * drag
 * getInfoDisplay

__Required__
* `class` (string) the name of the class
* `palette` (array) used for container classes, an array of names of other classes that can be used within this container type.
* `getPaletteIcon` ()=> return the icon for display in the palette toolbar
* `paletteSelected`: (true/false)=> called when the user clicks on the palette icon for this symbol, used to trigger custom UI for creating new symbols from mouse data. Scripts should define mouse callbacks internally. Generally `cmd-click` is the way to create a new object.
* `getInfoDisplay` ()=> return drawing commands for the inspector contextual menu (see `makeDefaultInfoDisplay` below).
* `fromData` called from `ui_controller` when data is received and needs to be mapped to graphic representation.
* `updateFromDataset` called from the inspector, when elements of the data should be updated.
* `getContainerForData` for container symbols, this function is called when a new data object is being set, if there are multiple containers of the same type, for example systems with line breaks, this function looks up the container by a certain parameter, usually time.
* `childDataToViewParams` mapping function in container symbol called from children to request view parameters from data object.
* `childViewParamsToData` mapping function in container symbol called from children to get data mapping from view parameters.
__Optional__
* `editMode` (element, true/false)=> called from ui controller when entering edit mode
* `selected` (element, true/false)=> called from ui controller on selection, return true if selection is handled in the script, false will trigger the default selection mechanics.
* `drag` (element, delta_pos) => called from ui on click drag from a window event listener which works better than a local listener. Return true if handled by the symbol. The `ui_api.translate` can be used to translate the object using the API function by applying a transform matrix to the top-level group object. 
* `applyTransformToData` (optional but usually needed): on mouseup, if selected objects have changed, the ui controller calls `applyTransformToData` which applies the transform matrix to the SVG attribute values. This is important because the attribute values are used for mapping. Inside the `applyTransformToData` function, the `ui_api.applyTransform` can be used to apply the transform to the SVG data, and then you will want a function like `mapToData` to map the updated graphic information to the data.

__Typical Internal Functions__
These functions have no specific required name or use outside the definition, but are used in the common script patterns so far:

* `window event listeners` to handle mouse interaction, typically created in the `paletteSelected` and `editMode` functions.
* `mouseToData` generates a full set of data from mouse movements, usually some defaults will be needed since the mouse has a limited number of parameters.
* `createNewFromMouseEvent`: a handler mouse down creation of new semantic data and graphic representation pair. Often some parts of the data are using default values set in the `dataInstance`. Optionally, more advanced UI interaction could be used to create different aspects of the data, for example using mouse drag or key modifiers.
* `dataToViewParams` mapping from data to graphic view, usually called from `fromData`, but also used in `updateFromDataset`
* `viewParamsToData` map from the graphic view to data representation
* `display` helper function to input view parameters, and return a `drawsocket` format object to send to the browser.

### UI API helper functions:
The following functions are provided by the `ui_api` which is available to symbol definitions:
* `uiDefs` access to the defs in the defs
* `getDef` lookup def by class name
* `getDefForElement` helper function to get def from DOM element
* `getContainerForElement` look upwards in the element hierarchy to find the container
* `svgFromViewAndData` - generates SVG symbol, wrapping view and data values.
* `svgPreviewFromViewAndData` - generates a preview SVG symbol `sprite`, wrapping view and data values, with an additional text display showing the current data value.
* `getDataTextView` -- generates a text view of the data
* `removeSprites` -- removes temporary `sprite` objects

* `drawsocketInput`,
* `sendToServer`, // renderer-event
* `fairlyUniqueString`,
* `getCurrentContext`,
* `getSelected`,
* `dataToHTML`,
* 
* `getElementData`
* `filterByKeys`
* 
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
* `hasParam`
* `startDefaultEventHandlers`
* `stopDefaultEventHandlers`


## IO Definitions

### module.exports
Values and handler callbacks defined and exported to the `IO Controller`:

**Required**
* `class`: (string) class name, corresponding to class name in UI Definition.
* `comparator`: (a,b)=> comparator function to use to sort this symbol type, return -1, 0, or 1
* `lookup`: (params, obj_ref) => hit detection function called when looking up from query point, returns information to send back to caller. `params` are user parameters included in the lookup query, `obj_ref` is the instance of this class type. When the `lookup` key is received by the `io controller`, the system looks up the element by its `id`, generally the id will be of a container object. Then it is up to the container object's `lookup` function to iterate its child objects and accumulate them into an output array to send back to the calling application.

### IO API helper functions:
* `modelGet`
* `modelHas`
* `defGet`
* `defHas`


# Definition Logic

## Class Definition and Object Instances 

explain this more

* classes are passed instances of the object
* dataset, the HTML dataset holds a copy of the data parameters
* lookup into container graphic and data parameters in mapping


... incomplete


## Data to View Mapping

If an OSC message is received containing data to create a new symbol, the `ui_controller` calls the object's `fromData` function, which maps from the data representation to the graphic drawing commands. The `fromData` function should:
1. send the drawing commands to the browser display (via drawsocket usually, using the `drawsocketInput` API method). Include the data content into the symbol by using the HTML `dataset` (you can use `ui_api.dataToHTML(dataObj)` helper function to create the `data-` tags)
    ```
    ui_api.drawsocketInput({
        key: "svg",
        val: {
            class: `${className} symbol`,
            id: uniqueID,
            parent: container.id,
            ...newView, 
            ...ui_api.dataToHTML(dataObj)
        }
    })
    ```
 
*note that container is the key-name for the data model, but parent is the container name in drawsocket... maybe we should add container to drawsocket also...*


## Program Logic

These are the basic modes of interaction that are defined in the script definitions:

### Palette Mode and Object Creation

Each container definition has a `palette` array, which lists the `symbol` class names that are supported for this container. When the user selects a container in the editor and sets it as the "context", by pressing `[s]`, the program "enters" the container, using it as the context container. When the icon is clicked, the palette toolbar populates with the supported symbol types.

1. a context is selected by the user and the palette icon is retrieved by the program, using the class def's `getPaletteIcon` function, which returns a `drawsocket` format object defining the icon drawing.
2. user clicks on a palette icon, which triggers a call to the class's `paletteSelected` notifying the symbol class that is is now active in the palette. Inside the definition, this triggers a set of window mouse event listeners. 
   * as the mouse moves, the mouse event handlers are called. When the `cmd` button is pressed, a preview of the symbol is displayed in the `symbolist_overlay` layer defined in the main view file `index.html`.
   * use `ui_api.getSVGCoordsFromEvent(event)` to get the absolute coordinates, taking the window scrolling position into account.
3. `cmd-click` is the current standard creation gesture. On `cmd-click` the mouse handler should call an internal function which creates a new element based on the mousedown coordinate (again using `getSVGCoordsFromEvent`). When creating a new element, the action should preform a the same actions as the `fromData` function described above, and send the drawing commands to the browser via: `ui_api.drawsocketInput`. Depending on the mapping, usually you might need to use some default values, since the mouse click only gives you a few dimensions of data. 
    * In addition to mapping from data to the graphic view, you also need to send the new data object to the score held in the io_controller, using `ui_api.sendToServer`. You can use the `ui_api.getCurrentContext()` function to get the currently selected container element.
   ```
    ui_api.sendToServer({
        key: "data",
        val: {
            class: className,
            id: uniqueID,
            container: container.id,
            ...dataObj
        }
    })
    ```
4. When the user clicks on a different palette icon, or exits the container context, `paletteSelected` is called again, to notify the class that it is no longer selected, and should remove the mouse listeners for any contextual UI that might be used by that symbol.
   
### Selection
1. if the user "selects" a symbol in the editor, by clicking on it, or dragging the region selection box around it, the `ui_controller` will add the class `symbolist_selected` to the class list, which then will apply the `symbolist_selected` CSS style set in the main symbolist css fie. Then the `selected` function is called with the state `true` to notify that the object has been selected. You can use this to trigger contextual menus, or other UI reactions as needed. 
2. On de-selection, the `selected` function is called again, with a state of `false`.

### Inspector
1. if the user triggers the inspector window, by pressing `[i]`, the class receives a call to `getInfoDisplay`, this function should return the GUI box for the inspector. For convenience there is a helper function `ui_api.makeDefaultInfoDisplay` which produces the default inspector window, with the necessary callbacks to `updateFromDataset`.
    * `updateFromDataset` is called from the inspector UI, when a data parameter has been changed, so that the class can map the new data value to update the graphic display.
2. **to do**: get notification of exit from inspector incase of clean up.

### Click and Drag
1. If the user clicks and drags on an object, the `transform` callback function is called. The standard method for object translation in symbolist is to first apply a transform matrix to the object, which is constantly updated whenever the mouse is moved while dragging. The transform matrix is an attribute of the object that transforms the other attributes without changing the values directly. E.g. if an object has an attribute of `cx="100"`, the transform matrix will offset from `cx="100"`, but not change the value of `cx`. For convenience, the translation matrix can be applied using the helper function `ui_api.translate`.
2. On mouse up, the `ui_controller` will check to see if any of the selected object have a transform matrix, and then call the object class' `applyTransformToData` function, which should apply the transform matrix to the elements attributes. E.g. updating the value of `cx` in the example above. There is a helper function `ui_api.applyTransform` which performs this for SVG objects.

### Edit Mode
Some object might need special UI tools to graphically edit the data values. As an alternative to the inspector window, scripts can have a `editMode` which creates a set of UI window event listeners and can be used to create overlay elements, like curve handles, rotation, etc.
*note: potentially edit mode could replace the inspector*&


[ ... documentation in process! please excuse spelling and fragmentation ... ]

