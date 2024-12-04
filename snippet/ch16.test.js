import { test } from "vitest";

test("Test_Promise1", () => {
  let p = new Promise(
    function (resolve, reject) {
      console.log("1st"); // 立刻执行
      return resolve();
    } /* executor */,
  );

  p.then(
    function () {
      console.log("3rd");
    } /* onfulfilled */,
  );
  console.log("2nd");
});

test(
  "Test_Promise2",
  async () => {
    let p1 = new Promise(function (resolve, reject) {
      setTimeout(() => {
        console.log("2nd");
        return reject(new Error("what") /* reason */);
      }, 5000);
    });

    let p2 = new Promise(function (resolve, reject) {
      setTimeout(() => {
        console.log("1st");
        return resolve(p1 /* value */);
      }, 3000);
    });

    await p2
      .then((value) => console.log(value))
      .catch((reason) => console.log(reason.toString().split("\n")[0])); // Error: what
  },
  { timeout: 5500 },
);

test("Test_Promise3", () => {
  let p1 = new Promise(function (resolve, reject) {
    try {
      throw /* reason */ new Error("what");
    } catch (reason) {
      return reject(reason); //! reject(reason) 等价于 throw reason
    }
  });
  p1.catch(function (reason) {
    console.log(reason);
  });

  // 等价于
  let p2 = new Promise(function (resolve, reject) {
    return reject(/* reason */ new Error("what"));
  });
  p2.catch(function (reason) {
    console.log(reason);
  });
});

// 最佳实践
// 1. then() 方法中的 onrejected 回调函数 (即 then() 方法的第 2 个参数) 可以理解为一种 recover
// 2. 不要定义 then() 方法中的 onrejected 回调函数, 定义 catch () 方法中的 onrejected 回调函数(即 catch () 方法的第 1 个参数)
