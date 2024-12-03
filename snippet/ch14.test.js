import { test } from "vitest";

test("Test_get", () => {
  let target = { foo: 1 };
  let handler = {
    get: function (target, propKey, receiver) {
      console.log(this === handler); // true
      return Reflect.get(target, propKey, receiver);
    },
  };
  let op = new Proxy(target, handler);
  console.log(op.foo); // 1
});

test("Test_set", () => {
  let target = { foo: 1 };
  let handler = {
    set: function (target, propKey, propValue, receiver) {
      console.log(this === handler); // true
      return Reflect.set(target, propKey, propValue, receiver);
    },
  };
  let op = new Proxy(target, handler);
  op.foo++;
  console.log(op.foo); // 2
});

test("Test_apply", () => {
  let handler = {
    apply(target, ctx, args) {
      console.log(this === handler); // true
      let [_target, _thisVal, _args] = arguments;
      return Reflect.apply(_target, _thisVal, _args) * 2;
    },
  };

  function target(a, b) {
    return a + b;
  }

  let op = new Proxy(target, handler);
  console.log(op(1, 2)); // 6
});

test("Test_has", () => {
  let target = { foo: 1 };
  let handler = {
    has(target, key) {
      console.log(this === handler); // true
      return key in target;
    },
  };
  let op = new Proxy(target, handler);
  console.log("foo" in op); // true
});

test("Test_constructor", () => {
  let handler = {
    construct(target, args, newTarget) {
      console.log(this === handler); // true
      return new target(...args);
    },
  };
  let Target = function () {};
  let Op = new Proxy(Target, handler);
  console.log(new Op()); // Target {}
});
