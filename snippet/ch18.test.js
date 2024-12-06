import { test } from "vitest";

test("Test_Generator1", () => {
  let obj = { foo: 1, bar: 2 };
  obj[Symbol.iterator] = function () {
    let _this = this;
    let propKeys = Object.keys(this);
    let idx = 0;
    return {
      next() {
        if (idx < propKeys.length) {
          return {
            value: [propKeys[idx], _this[propKeys[idx++]]],
            done: false,
          };
        }
        return { value: undefined, done: true };
      },
    };
  };

  for (let [key, val] of obj) {
    // foo => 1
    // bar => 2
    console.log(key, "=>", val);
  }
});

test("Test_Generator2", () => {
  let obj = { foo: 1, bar: 2 };
  obj[Symbol.iterator] = function* () {
    let propKeys = Object.keys(this);
    for (let propKey /* String */ of propKeys) {
      yield [propKey, obj[propKey]];
    }
  };

  for (let [key, val] of obj) {
    // foo => 1
    // bar => 2
    console.log(key, "=>", val);
  }
});

test("Test_Generator3", () => {
  let obj = { foo: 1, bar: 2 };

  function* parseEntries(obj) {
    let propKeys = Reflect.ownKeys(obj);
    for (let propKey /* String | Symbol */ of propKeys) {
      yield [propKey, obj[propKey]];
    }
  }

  for (let [key, val] of parseEntries(obj)) {
    // foo => 1
    // bar => 2
    console.log(key, "=>", val);
  }
});

test("Test_new", () => {
  function make() {
    console.log(new.target);
  }
  make(); // undefined
  new make(); // [Function: make]
});
