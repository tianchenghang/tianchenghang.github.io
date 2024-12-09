import fs from "node:fs";
import { test } from "vitest";
import thunkify from "./thunkify";

// type Callback = (err: Error, ...args: any[]) => any;
// type Thunk = (cb: Callback) => any;
// type Thunkify = (fn: (...args: any[]) => any) => (...args: any[]) => Thunk;

test("Test_Thunkify1", () => {
  let readFileThunk = thunkify(fs.readFile);

  function* genFunc() {
    let buf1 = yield readFileThunk("./package.json");
    console.log(buf1.toString());
    let buf2 = yield readFileThunk("./README.md");
    console.log(buf2.toString());
  }

  let gen /* extends IteratorObject */ = genFunc();
  let ret1 = gen.next();
  ret1.value(function (err, buf1) {
    if (err) {
      throw err;
    }
    let ret2 = gen.next(buf1);
    ret2.value(function (err, buf2) {
      if (err) {
        throw err;
      }
      gen.next(buf2);
    });
  });
});

test("Test_Thunkify2", async () => {
  let readFileThunk = thunkify(fs.readFile);

  function* genFunc() {
    let buf1 = yield readFileThunk("./package.json");
    console.log(buf1.toString());
    let buf2 = yield readFileThunk("./README.md");
    console.log(buf2.toString());
  }

  function executor(genFunc) {
    let gen = genFunc();

    function callback(err, buf) {
      let result = gen.next(buf);
      if (result.done) {
        return;
      }
      result.value(callback);
    }

    callback();
  }

  await executor(genFunc);
});
