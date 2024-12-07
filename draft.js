const fs = require("fs");
const thunkify = require("./snippet/thunkify");
let readFileThunk = thunkify(fs.readFile);
function* genFunc() {
  let data1 /* Buffer */ = yield readFileThunk("./package.json");
  console.log(data1.toString());
  let data2 /* Buffer */ = yield readFileThunk("./README.md");
  console.log(data2.toString());
}
function go(genFunc) {
  let gen = genFunc();

  function callback(err, data) {
    let result /* { value: Thunk, done: boolean } */ = gen.next(data);
    if (result.done) {
      return;
    }
    result.value(callback);
  }
  callback();
}

go(genFunc);
