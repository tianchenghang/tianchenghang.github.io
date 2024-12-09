import fs from "fs";
import thunkify from "./snippet/thunkify.js";

let readFileThunk = thunkify(fs.readFile);
function* genFunc() {
  let buf1 /* Buffer */ = yield readFileThunk("./package.json");
  console.log(buf1.toString());
  let buf2 /* Buffer */ = yield readFileThunk("./README.md");
  console.log(buf2.toString());
}
// 生成器函数的执行器
function executor(genFunc) {
  let gen = genFunc();

  function callback(err, buf) {
    let result /* { value: Thunk, done: boolean } */ = gen.next(buf);
    if (result.done) {
      return;
    }
    result.value(callback);
  }
  callback();
}

executor(genFunc);
