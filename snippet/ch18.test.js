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

test("Test_Generator4", () => {
  const fs = require("fs");

  function* genFunc() {
    yield fs.readFile.bind(null, "../package.json", (err, data) =>
      console.log(data),
    );
    yield fs.readFile.bind(null, "../README.md", (err, data) =>
      console.log(data),
    );
    yield fs.readFile.bind(null, "../tsconfig.json", (err, data) =>
      console.log(data),
    );
  }

  for (let reader of genFunc()) {
    reader();
  }
});

test("Test_Pub_Sub", () => {
  // type: event type 事件的类型
  // handler: event handler 事件的回调函数
  class EventEmitter {
    constructor() {
      this.events /* type => handler */ = new Map();
    }

    // 订阅事件
    sub(type, handler) {
      if (!this.events.has(type)) {
        this.events.set(type, new Set());
      }
      this.events.get(type).add(handler);
    }

    // 取消订阅事件
    unsub(type, handler) {
      if (!this.events.has(type)) {
        return;
      }
      if (!handler) {
        this.events.delete(type);
      } else {
        this.events.get(type).delete(handler);
      }
    }

    // 发布事件
    emit(type, ...args) {
      if (!this.events.has(type)) {
        return;
      }
      for (let handler of this.events.get(type)) {
        handler.apply(this, args);
      }
    }

    // 订阅一次事件
    sub1(type, handler) {
      const fn = (...args) => {
        handler.apply(this, args);
        this.unsub(type, fn);
      };
      this.sub(type, fn);
    }
  }

  let evEmitter = new EventEmitter();
  const handler1 = (...args) => console.log("handler1:", ...args);
  const handler2 = (...args) => console.log("handler2:", ...args);

  // 订阅事件
  evEmitter.sub("click", handler1);
  // 订阅一次事件
  evEmitter.sub1("click", handler2);
  // 发布事件
  evEmitter.emit("click", 1, 2, 3); // handler1: 1 2 3; handler2: 1 2 3
  // 发布事件
  evEmitter.emit("click", 4, 5, 6); // handler1: 1 2 3
  // 取消订阅事件
  evEmitter.unsub("click", handler1);
  // 发布事件
  evEmitter.emit("click", 7, 8, 9);
});

test("Test_Thunkify1", () => {
  const thunkify = require("./thunkify");

  function fn(a, b, callback) {
    let sum = a + b;
    callback(sum);
    callback(sum);
  }

  let thunk = thunkify(fn);
  let print /* callback */ = console.log.bind(console);
  let fnThunk = thunk(1, 2);
  fnThunk(print); // 3
});

test("Test_Thunkify2", () => {
  const fs = require("fs");
  const thunkify = require("./thunkify");
  let readFileThunk = thunkify(fs.readFile);
  let genFunc = function* () {
    let data1 = yield readFileThunk("./package.json");
    console.log(data1.toString());
    let data2 = yield readFileThunk("./README.md");
    console.log(data2.toString());
  };
  let gen = genFunc();
  let ret1 = gen.next();
  ret1.value(
    /* callback */ function (err, data1) {
      if (err) {
        throw err;
      }
      let ret2 = gen.next(data1);
      ret2.value(
        /* callback */ function (err, data2) {
          if (err) {
            throw err;
          }
          let ret3 = gen.next(data2);
        },
      );
    },
  );
});
