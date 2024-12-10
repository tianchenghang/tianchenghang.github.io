console.log("second starting");
exports.done = false;
const first = require("./first.cjs"); // 循环加载
console.log(`second: first.done = ${first.done}`);
exports.done = true;

let cnt = 3;
function incr() {
  cnt++;
  console.log("incr:", cnt);
}

module.exports.cnt = cnt;
module.exports.incr = incr;

console.log("second done");
