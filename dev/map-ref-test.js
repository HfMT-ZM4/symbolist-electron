/*
let a = new Map();
let b = new Map();

a.set('foo-1', {
    test: 'hi'
});

b.set('foo', new Map() );
b.get('foo').set('foo-1', a.get('foo-1') );


b.get('foo').get('foo-1').bar = 1;

console.log( a )

//console.log( JSON.stringify( Object.fromEntries(b.get('foo')) ) );

// prints Map(1) { 'foo-1' => { test: 'hi', bar: 1 } }
*/

let a = {};
let b = {};

a['foo-1'] = {
    test: 'hi'
};

b['foo'] = {};
b['foo']['foo-1'] = a['foo-1'];

b['foo']['foo-1'].bar = 1;


console.log( a, JSON.stringify( b )  )
