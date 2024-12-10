console.log("b starting");
exports.done = false;
const a = require("./a.cjs"); // 循环加载
console.log("in b, a.done = %j", a.done);
exports.done = true;
console.log("b done");
