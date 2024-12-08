"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fs_1 = __importDefault(require("fs"));
const _readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs_1.default.readFile(fileName, function (err, buf) {
      if (err) {
        return reject(err /* reason */);
      }
      return resolve(buf /* value */);
    });
  });
};
function* genFunc() {
  let buf1 = yield _readFile("./package.json");
  let buf2 = yield _readFile("./README.md");
  console.log(buf1.toString().length);
  console.log(buf2.toString().length);
}
(0, vitest_1.test)("Test_coco1", () => {
  // 手动执行
  let gen = genFunc();
  gen
    .next()
    .value /* Promise */
    .then(function (buf1 /* value */) {
      gen
        .next(buf1)
        .value /* Promise */
        .then(function (buf2 /* value */) {
          gen.next(buf2);
        });
    });
});
(0, vitest_1.test)("Test_coco2", () => {
  // 自动执行
  function executor(genFunc) {
    let gen = genFunc();
    function $next(buf) {
      let result /* { value: Promise, done: boolean } */ = gen.next(buf);
      if (result.done) {
        return result.value; // Promise
      }
      result.value.then(function (buf /* value */) {
        $next(buf);
      });
    }
    $next();
  }
  executor(genFunc);
});
(0, vitest_1.test)("Test_coco3", () => {
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
  ).catch((reason) => console.log(reason));
});
