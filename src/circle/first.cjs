console.log("first start");
exports.done = false;
const second = require("./second.cjs");
console.log(`first: second.done = ${second.done}`);
exports.done = true;
console.log("first done");
