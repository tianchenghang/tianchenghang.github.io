import { test } from "vitest";

test("Test_set", () => {
  let target = {
    foo: 1,
  };

  let handler = {
    // set() 拦截设置属性操作
    set(target, key, val, recv) {
      console.log("set");
      Reflect.set(target, key, val, recv /* po */);
    },
    // defineProperty() 拦截 Object.defineProperty()
    defineProperty(target, key, val) {
      console.log("defineProperty");
      Reflect.defineProperty(target, key, val);
    },
  };
  let op = new Proxy(target, handler);
  op.foo = 2;
  // op.foo = 2 ->
  // handler.set(target, key, val, recv), 输出 set ->
  // Reflect.set(target, key, val, recv) ->
  // Object.defineProperty(recv, val) ->
  // handler.defineProperty(target, key, val), 输出 defineProperty

  // set
  // defineProperty
});
