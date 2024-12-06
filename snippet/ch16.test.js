import { expect, test } from "vitest";

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
      // ! catch(onrejected) 等价于 then(undefined, onrejected)
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

//! 最佳实践
// 1. then() 方法中的 onrejected 回调函数 (即 then() 方法的第 2 个参数) 可以理解为一种 recover
// 2. 不要定义 then() 方法中的 onrejected 回调函数, 定义 catch () 方法中的 onrejected 回调函数 (即 catch () 方法的第 1 个参数)

test(
  "Test_Promise4",
  async () => {
    Promise.prototype.finally = function (callback) {
      let P = this.constructor;
      expect(P).toBe(Promise);
      return this.then(
        (value) => {
          console.log("value:", value); // value: I'm OK
          return P.resolve(callback()).then(() => {
            return value;
          });
        } /* onfulfilled */,
        (reason) => {
          console.log("reason:", reason);
          return P.resolve(callback()).then(() => {
            throw reason;
          });
        } /* onrejected */,
      );
    };

    await new Promise((resolve, reject) => {
      resolve("I'm OK");
    }).finally(() => {
      console.log("onFinally");
    });
    // value: I'm OK
    // onFinally

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("I'm bastard");
      }, 5000);
    })
      .finally(() => {
        console.log("onFinally");
      })
      .catch((reason) => {
        console.log("caught:", reason);
      });
    // reason: I'm bastard
    // onFinally
    // caught: I'm bastard
  },
  { timeout: 5500 },
);

test("Test_Promise5", () => {
  //! Promise.resolve(value) 等价于 new Promise((resolve, reject) => resolve(value))
  Promise.resolve(1).then(
    (value) => {
      console.log(value); // 1
      /* return undefined */
    },
    () => {},
  ); // Promise{ PromiseState: "fulfilled", PromiseResult: undefined }

  Promise.resolve(2)
    .finally(
      () => {},
    ) /* Promise{ PromiseState: "fulfilled", PromiseResult: 2 } */
    .then((value) => {
      console.log(value); // 2
    });

  //! Promise.reject(reason) 等价于 new Promise((resolve, reject) => reject(reason))
  Promise.reject(3).then(
    () => {},
    (reason) => {
      console.log(reason); // 3
      /* return undefined */
    },
  ); // Promise{ PromiseState: "fulfilled", PromiseResult: undefined }

  Promise.reject(4)
    .finally(
      () => {},
    ) /* Promise{ PromiseState: "rejected", PromiseResult: 4 } */
    .catch((reason) => console.log(reason));
});

test("Test_Promise_allSettled", async () => {
  let p1 = Promise.resolve(1);
  let p2 = Promise.reject(0);
  let ps = Promise.allSettled([p1, p2]);
  /**
   * Promise{ PromiseState: "fulfilled", PromiseReturn: [
   *   { status: 'fulfilled', value: 1 },
   *   { status: 'rejected', reason: 0 }
   * ] }
   */
  let ret = await ps.then((value) => {
    console.log(value);
    return value;
  });

  // { status: 'fulfilled', value: 1 }
  ret
    .filter((item) => item.status === "fulfilled")
    .forEach((value) => console.log(value));
  // { status: 'rejected', reason: 0 }
  ret
    .filter((item) => item.status === "rejected")
    .forEach((reason) => console.warn(reason));
});

test("Test_Promise_any", async () => {
  let ps = [
    fetch("https://bh3.mihoyo.com/").then((resp) => resp),
    fetch("https://ys.mihoyo.com/").then((resp) => resp),
    fetch("https://sr.mihoyo.com/").then((resp) => resp),
  ];
  try {
    const first = await Promise.any(ps);
    console.log(first);
  } catch (err) {
    console.log(err);
  }
});

test(
  "Test_Promise_any_AggregateError",
  async () => {
    Promise.any([Promise.reject(Infinity), Promise.reject(NaN)]).catch(
      function (reason) {
        console.log(reason instanceof AggregateError); // true
        console.log(reason.errors); // [ Infinity, NaN ]
      },
    );

    await Promise.any([
      Promise.reject(-Infinity),
      (() =>
        new Promise((resolve, reject) => {
          setTimeout(() => reject(NaN), 3000);
        }))(),
    ]).catch(function (reason) {
      console.log(reason.constructor === AggregateError); // true
      console.log(
        Reflect /* Object */.getPrototypeOf(reason) ===
          AggregateError.prototype,
      ); // true
      console.log(reason.errors); // [ -Infinity, NaN ]
    });
  },
  { timeout: 3500 },
);

// TODO
test("Test_Promise_Generator", () => {
  let genFunc = function* () {
    try {
      let value /* : string */ = yield new Promise(function (resolve, reject) {
        resolve("foo");
      });
      console.log("2nd:", value);
    } catch (err) {
      console.log(err);
    }
  };

  let gen = genFunc();

  function go(res /* IteratorYieldResult{ done: boolean, value: Promise } */) {
    if (res.done) {
      return res.value;
    }
    return res.value.then(
      function (value) {
        console.log("1st:", value);
        return go(gen.next(value));
      } /* onfulfilled */,
      function (reason) {
        return go(gen.throw(reason));
      } /* onrejected */,
    );
  }

  go(gen.next() /* IteratorYieldResult{ done: boolean, value: Promise } */);
});

// TODO 3rd 4th 5th 6th 7th 8th 9th 1st 2nd
test("Test_Promise6", () => {
  Promise.resolve().then((value) => console.log("1st")); // 异步
  Promise.resolve().then((value) => (async () => console.log("2nd"))()); // 异步
  console.log("3rd");

  (() => console.log("4th"))(); //同步
  (async () => console.log("5th"))(); // 同步
  console.log("6th");

  new Promise((resolve, reject) => resolve(console.log("7th"))); // 同步
  new Promise((resolve, reject) => resolve((async () => console.log("8th"))())); // 同步
  console.log("9th");
});
