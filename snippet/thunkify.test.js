"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const thunkify_1 = __importDefault(require("./thunkify"));
const vitest_1 = require("vitest");
const node_fs_1 = __importDefault(require("node:fs"));
// type Thunkify = (fn: (...args: any[]) => any) => (...args: any[]) => Thunk;
(0, vitest_1.test)("Test_Thunkify1", () => {
  let readFileThunk = (0, thunkify_1.default)(node_fs_1.default.readFile);
  function* genFunc() {
    let data1 = yield readFileThunk("./package.json");
    console.log(data1.toString());
    let data2 = yield readFileThunk("./README.md");
    console.log(data2.toString());
  }
  let gen /* extends IteratorObject */ = genFunc();
  let ret1 = gen.next();
  ret1.value(function (err, data1) {
    if (err) {
      throw err;
    }
    let ret2 = gen.next(data1);
    ret2.value(function (err, data2) {
      if (err) {
        throw err;
      }
      gen.next(data2);
    });
  });
});
(0, vitest_1.test)("Test_Thunkify2", () =>
  __awaiter(void 0, void 0, void 0, function* () {
    let readFileThunk = (0, thunkify_1.default)(node_fs_1.default.readFile);
    function* genFunc() {
      let data1 = yield readFileThunk("./package.json");
      console.log(data1.toString());
      let data2 = yield readFileThunk("./README.md");
      console.log(data2.toString());
    }
    function executor(genFunc) {
      let gen = genFunc();
      function callback(err, data) {
        let result = gen.next(data);
        if (result.done) {
          return;
        }
        result.value(callback);
      }
      callback();
    }
    yield executor(genFunc);
  }),
);
