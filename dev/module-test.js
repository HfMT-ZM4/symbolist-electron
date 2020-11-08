const enter = () => {
    console.log('enter');
}

const exit = () => {
    console.log('exit');
}

const bar = () => {
    enter();
}

let obj = {
    foo: 1,
    bar: 2
}

function outsideTest( api )
{
    api.outsideFunction();
}

let closure = (function(){
    function internal(){
        return obj.bar;
    }
    return {
        ...obj,
        res: internal()

    }
})();

module.exports = {
    view: {
        enter,
        exit,
        bar
    },
    ...obj,
    closure,
    outsideTest

}