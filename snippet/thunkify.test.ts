import thunkify from "./thunkify";
import { test } from "vitest";
import fs from "node:fs";

type Callback = (err: Error, ...args: any[]) => any;
type Thunk = (cb: Callback) => any;
// type Thunkify = (fn: (...args: any[]) => any) => (...args: any[]) => Thunk;

test("Test_Thunkify1", () => {
  let readFileThunk: (...args: any[]) => Thunk = thunkify(fs.readFile);

  function* genFunc() {
    let data1: Buffer = yield readFileThunk("./package.json");
    console.log(data1.toString());
    let data2: Buffer = yield readFileThunk("./README.md");
    console.log(data2.toString());
  }

  let gen: Generator<(...args: any[]) => Thunk> /* extends IteratorObject */ =
    genFunc();
  let ret1: IteratorResult<Thunk> = gen.next();
  ret1.value(function (err: Error, data1: Buffer) {
    if (err) {
      throw err;
    }
    let ret2: IteratorResult<Thunk> = gen.next(data1);
    ret2.value(function (err: Error, data2: Buffer) {
      if (err) {
        throw err;
      }
      gen.next(data2);
    });
  });
});

test("Test_Thunkify2", async () => {
  let readFileThunk: (...args: any[]) => Thunk = thunkify(fs.readFile);

  function* genFunc() {
    let data1: Buffer = yield readFileThunk("./package.json");
    console.log(data1.toString());
    let data2: Buffer = yield readFileThunk("./README.md");
    console.log(data2.toString());
  }

  function executor(genFunc: any) {
    let gen: Generator<(...args: any[]) => Thunk> = genFunc();

    function callback(err?: Error, data?: Buffer) {
      let result: IteratorResult<Thunk> = gen.next(data);
      if (result.done) {
        return;
      }
      result.value(callback);
    }

    callback();
  }

  await executor(genFunc);
});
