import { test } from "vitest";

import fs from "fs";

const _readFile = function (fileName: string) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (err, buf) {
      if (err) {
        return reject(err /* reason */);
      }
      return resolve(buf /* value */);
    });
  });
};

function* genFunc() {
  let buf1: Buffer = yield _readFile("./package.json");
  let buf2: Buffer = yield _readFile("./README.md");
  console.log(buf1.toString().length);
  console.log(buf2.toString().length);
}

test("Test_coco1", () => {
  // 手动执行
  let gen: Generator<Promise<any>> /* extends IteratorObject */ = genFunc();
  gen
    .next()
    .value /* Promise */
    .then(function (buf1: Buffer /* value */) {
      gen
        .next(buf1)
        .value /* Promise */
        .then(function (buf2: Buffer /* value */) {
          gen.next(buf2);
        });
    });
});

test("Test_coco2", () => {
  // 自动执行
  function executor(genFunc: Function) {
    let gen: Generator<Promise<any>> = genFunc();

    function $next(buf?: Buffer) {
      let result: IteratorResult<Promise<any>> = gen.next(buf);
      if (result.done) {
        return result.value; // Promise
      }
      result.value.then(function (buf: Buffer /* value */) {
        $next(buf);
      });
    }

    $next();
  }

  executor(genFunc);
});

test("Test_coco3", () => {
  const coco = require("./coco");

  coco(
    function* () {
      yield* [Promise.resolve(1), Promise.resolve(2)];
      //? onfufilled: undefined
      //? $next: Promise { 1 }
      //? onfufilled: Promise { 1 }
      //? $next: Promise { 2 }
      //? onfufilled: Promise { 2 }
    } /* GeneratorFunction */,
  ).catch((reason: any) => console.log(reason));
});
