console.log("main start");
const first = require("./first.cjs");
const second = require("./second.cjs");
console.log(`main: first.done = ${first.done}, second.done = ${second.done}`);

// main start
// first start
// second start
// second: first.done = false
// second done
// first: second.done = true
// first done
// main: first.done = true, second.done = true
