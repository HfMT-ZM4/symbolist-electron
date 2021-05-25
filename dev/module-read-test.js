
//const { foo, closure } = require('./module-test');

let ff = require('./module-test')['foo'];

//b.view.bar();

console.log(ff);
/*
console.log(closure.res);

console.log(bar);
*/
// imports only foo here
let yo = 112;
global.api = {
    outsideFunction: function(){
        console.log(yo);
    }
}


const { outsideTest } = require('./module-test');

outsideTest();

console.log(baba);