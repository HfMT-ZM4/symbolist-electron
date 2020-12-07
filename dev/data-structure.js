

let model = {
    foo_1: {
        className: 'foo',
        someData: 1,
        contents: [
            "bar_1"
        ]
    },
    bar_1: {
        className: 'bar',
        someData: 1,
        container: "foo"
    }
}

let model_classlist = {
    foo: [foo_1, foo_2],
    bar: [bar_1]
}


/*

to iterate model, we could start with the first item, then follow the container references up to the top level (probably usually the first item will be the top level anyway.)

*/

model = {
    foo: {
        className: 'foo',
        someData: ''
    }
}

/*

maybe it's also possible that there is no specific id for some items?
or rather that the id is the same as the className -- then the display group of the svg might split into different regions, but it's part of a single group? IDK

*/