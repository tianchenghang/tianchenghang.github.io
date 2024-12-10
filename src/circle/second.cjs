console.log("second start");
exports.done = false;
const first = require("./first.cjs"); // 循环加载
console.log(`second: first.done = ${first.done}`);
exports.done = true;
console.log("second done");
