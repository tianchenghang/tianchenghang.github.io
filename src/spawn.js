export default function spawn(genFunc) {
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
      // result.value = Promise{ PromiseState: "fulfilled", PromiseReturn: 1 }
      // Promise.resolve(result.value) = result.value // fulfilled
      //! case2
      // result.value = Promise{ PromiseState: "rejected", PromiseReturn: 3 }
      // Promise.resolve(result.value) = result.value // rejected
      //! case3
      // result.value = 2
      // Promise.resolve(result.value) = Promise{ PromiseState: "fulfilled", PromiseReturn: 2 }
      Promise.resolve(result.value).then(
        function (value) {
          console.log("spawn:", value);
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
