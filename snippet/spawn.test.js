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
          Promise.resolve(result.value).then(
            function (value) {
              console.log(value);
              step(function () {
                return gen.next(value);
              });
            } /* , function (reason) {
          step(function () {
            return gen.throw(reason);
          });
        } */,
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

      let result2 = yield new Promise(function (resolve, reject) {
        setTimeout(function () {
          reject(2);
        }, 3000);
      });

      let result3 = yield new Promise(function (resolve, reject) {
        setTimeout(function () {
          resolve(3);
        }, 3000);
      });
    };

    try {
      await spawn(genFunc);
    } catch (err) {
      console.log("spawn", err);
    }
  },
  {
    timeout: 10_000,
  },
);
