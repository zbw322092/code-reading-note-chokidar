const path = require('path');

let path1 = path.relative('/a', '/b');
let path2 = path.relative('/a/b/c/d', '/a/b/c/e');
let path3 = path.relative('/a/b/c/d', '/e');

// If a zero-length string is passed as from or to, 
// the current working directory will be used instead of the zero-length strings.
let path4 = path.relative('/a/b/c/d', '');
let path5 = path.relative('', '/a/b/c/d');

// If from and to each resolve to the same path (after calling path.resolve() 
// on each), a zero-length string is returned.
let path6 = path.relative('/a/b/c/d', '/a/b/c/d');

// console.log(path1);
// console.log(path2);
// console.log(path3);
// console.log(path4);
// console.log(path5);
// console.log(path6);


let path7 = path.dirname('/a/b/c/d');
let path8 = path.dirname('/a/b/c/');

// console.log(path7);
// console.log(path8);

let path9 = path.basename('/a/b/c/d');
let path10 = path.basename('/a/b/c/');
let path11 = path.basename('/a/b/c/index.html');

console.log(path9);
console.log(path10);
console.log(path11);