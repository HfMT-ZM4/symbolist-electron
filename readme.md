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

* the `editor`, a browser-based graphic user interface which displays the graphic representation of the data, and allows the user to edit and create new data from graphic interaction. The editor loads a library of scripts that define mappings to and from data and graphics formats. The editor receives and outputs data in the semantic format, keeping the concerns of drawing within the browser-side. (footnote: there is the possibility of also using an external process to define the drawing commands, but this is not yet implemented).
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

On entering the application, the editor loads an configuration fie from the default load folder, or you can load a new config file after loading. The config file sets the top-level page setup and palette options.

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

* `tools`: 
* `palette`: 




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


# API

Each container's `definition` file has an attribute `palette` which lists the supported `symbol` class names that can be used in the `container`.

eventually it would be great to have a GUI interface for defining a mapping definition.

... writing in progress
