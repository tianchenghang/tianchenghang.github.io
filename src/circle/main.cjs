console.log("main starting");
const first = require("./first.cjs");
const second = require("./second.cjs");
console.log(`main: first.done = ${first.done}, second.done = ${second.done}`);

// main starting
// first starting
// second starting
// second: first.done = false
// second done
// first: second.done = true
// first done
//// cnt: 3
//// incr: 4
//// cnt: 3
// main: first.done = true, second.done = true
