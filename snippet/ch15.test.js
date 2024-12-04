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
  // op.foo = 2
  // => handler.set(target, key, val, recv) 输出 set
  // => Reflect.set(target, key, val, recv)
  // => Object.defineProperty(recv, key, { value: val })
  // => handler.defineProperty(target, key, val) 输出 defineProperty
});

test("Test_apply", () => {
  let thisVal = "thisVal";
  function targetFunc() {
    console.log("targetFunc:", this, arguments);
  }

  Reflect.defineProperty(targetFunc, "apply", {
    value: function (...args) {
      console.log("apply:", this, args);
    },
  });

  // 无法使用 targetFunc.apply(thisVal, argArr) 以调用 thisVal.targetFunc(...argArr)
  // apply: [Function: targetFunc] []
  targetFunc.apply();
  // apply: [Function: targetFunc] [ 'thisVal', [ 1, 2, 3 ] ]
  targetFunc.apply(thisVal, [1, 2, 3]);

  // 使用 Function.prototype.apply.call(targetFunc, thisVal, argArr)
  // targetFunc: [Arguments] { '0': 1, '1': 2, '2': 3 }
  Function.prototype.apply.call(targetFunc, thisVal, [1, 2, 3]);

  // Function.prototype.apply.call(targetFunc, thisVal, [1, 2, 3]);
  // => targetFunc.apply(thisVal, [1, 2, 3])
  // => thisVal.targetFunc(1, 2, 3)

  // 使用 Reflect.apply(targetFunc, thisVal, argArr) 简化
  // targetFunc: [Arguments] { '0': 1, '1': 2, '2': 3 }
  Reflect.apply(targetFunc /* targetFunction */, thisVal, [1, 2, 3]);
});
