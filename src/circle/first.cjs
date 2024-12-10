console.log("first starting");
exports.done = false;
const second = require("./second.cjs");
console.log(`first: second.done = ${second.done}`);
exports.done = true;
console.log("first done");

const { cnt, incr } = second;
console.log("cnt:", cnt); // cnt: 3 (缓存的 cnt 值)
incr(); // incr: 4
console.log("cnt:", cnt); // cnt: 3 (缓存的 cnt 值)
