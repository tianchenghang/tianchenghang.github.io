import thunkify from "./thunkify";
import { test } from "vitest";
import fs from "node:fs";

type Callback = (err: Error, ...args: any[]) => any;
type Thunk = (cb: Callback) => any;
type Thunkify = (fn: (...args: any[]) => any) => (...args: any[]) => Thunk;

interface GeneratorResult {
  value: Thunk;
  done: boolean;
}

test("Test_Thunkify1", () => {
  let readFileThunk: (...args: any[]) => Thunk = thunkify(fs.readFile);

  function* genFunc() {
    let data1: Buffer = yield readFileThunk("./package.json");
    console.log(data1.toString());
    let data2: Buffer = yield readFileThunk("./README.md");
    console.log(data2.toString());
  }

  let gen = genFunc();
  let ret1: GeneratorResult = gen.next() as GeneratorResult;
  ret1.value(function (err: Error, data1: Buffer) {
    if (err) {
      throw err;
    }
    let ret2: GeneratorResult = gen.next(data1) as GeneratorResult;
    ret2.value(function (err: Error, data2: Buffer) {
      if (err) {
        throw err;
      }
      gen.next(data2);
    });
  });
});

test("Test_Thunkify2", () => {
  let readFileThunk = thunkify(fs.readFile);

  function* genFunc() {
    let data1: Buffer = yield readFileThunk("./package.json");
    console.log(data1.toString());
    let data2: Buffer = yield readFileThunk("./README.md");
    console.log(data2.toString());
  }

  function go(genFunc: any) {
    let gen = genFunc();

    function callback(err?: Error, data?: Buffer) {
      let result = gen.next(data) as GeneratorResult;
      if (result.done) {
        return;
      }
      result.value(callback);
    }

    callback();
  }

  go(genFunc);
});
