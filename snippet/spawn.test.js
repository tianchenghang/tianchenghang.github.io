import { test } from "vitest";

test(
  "Test_spawn",
  async () => {
    function spawn(genFunc) {
      return new Promise(function (resolve, reject) {
        const gen = genFunc();

        function step(callNext) {
          let result;
          try {
            result /* {value: any, done: boolean} */ = callNext();
          } catch (err) {
            return reject(err);
          }
          if (result.done) {
            return resolve(result.value);
          }
          //! case1
          // result.value = Promise { PromiseState: "fulfilled", PromiseReturn: 1 }
          // Promise.resolve(result.value) = result.value
          //
          //! case2
          // result.value = 2
          // Promise.resolve(result.value) = Promise { PromiseState: "fulfilled", PromiseReturn: 2 }
          //
          //! case3
          // result.value = Promise { PromiseState: "rejected", PromiseReturn: 3 }
          // Promise.resolve(result.value) = Promise { PromiseState: "rejected", PromiseReturn: 3 }
          Promise.resolve(result.value).then(
            function (value) {
              console.log(value);
              step(function () {
                return gen.next(value);
              });
            },
            function (reason) {
              step(function () {
                return gen.throw(reason);
              });
            },
          );
        }

        step(function () {
          return gen.next(undefined);
        });
      });
    }

    const genFunc = function* () {
      let result1 = yield new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(1);
        }, 3000);
      });
      yield 2;
      let result3 = yield new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(3);
        }, 3000);
      });
    };

    try {
      await spawn(genFunc);
    } catch (err) {
      console.log("error:", err); // error: 3
    }
  },
  {
    timeout: 6500,
  },
);
