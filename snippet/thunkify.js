const assert = require("assert");
module.exports = thunkify;

// func.call(thisVal, ...args);
// func.apply(thisVal, args[]);
// const newFunc = func.bind(thisVal);

function thunkify(fn) {
  assert(typeof fn === "function", "function required" /* hint */);
  return function (...args) {
    // const args = Array.from(arguments);
    // const args = Array.prototype.slice.call(arguments);
    const ctx = this;
    return function (callback) {
      let called;
      args.push(function () {
        if (called) {
          // 只执行一次 callback
          return;
        }
        called = true;
        callback.apply(null, arguments);
      });

      try {
        fn.call(ctx, ...args);
      } catch (e) {
        callback(err); // callback 回调函数的第一个参数是 Error 对象
      }
    };
  };
}