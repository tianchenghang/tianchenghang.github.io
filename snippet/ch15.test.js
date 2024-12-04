import { test } from "vitest";

test("Test_set", () => {
  let target = {
    foo: 1,
  };

  let handler = {
    // set() 拦截设置属性操作
    set(target, key, val, recv) {
      console.log("set");
      // Object.defineProperty(recv, key, { value: val });
      Reflect.set(target, key, val, recv /* po */);
      return true;
    }, // defineProperty() 拦截 Object.defineProperty()
    defineProperty(target, key, val) {
      console.log("defineProperty");
      Reflect.defineProperty(target, key, val);
      return true;
    },
  };
  let op = new Proxy(target, handler);
  op.foo = 2;
  // op.foo = 2 ->
  // handler.set(target, key, val, recv), 输出 set ->
  // Reflect.set(target, key, val, recv) ->
  // Object.defineProperty(recv, key, { value: val }) ->
  // handler.defineProperty(target, key, val), 输出 defineProperty
});
