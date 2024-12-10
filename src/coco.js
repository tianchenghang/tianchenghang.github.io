/**
 * func.call(thisVal, ...args);
 * func.apply(thisVal, args[]);
 * const newFunc = func.bind(thisVal);
 *
 * @link https://github.com/tj/co/blob/master/index.js
 */
export default function coco(
  gen /* Generator | GeneratorFunction */,
) /* : Promise */ {
  let ctx = this;
  return new Promise(function (resolve, reject) {
    // gen instanceof GeneratorFunction
    if (typeof gen === "function") {
      gen /* Generator */ = gen.call(ctx);
    }

    // gen === null || gen === undefined || !(gen instanceof GeneratorFunction)
    if (!gen || typeof gen.next !== "function") {
      return resolve(gen);
      // return Promise{ PromiseState: 'fulfilled', PromiseReturn: gen }
    }
    onfulfilled();

    function onfulfilled(value) {
      console.log("onfufilled:", value);
      let result;
      try {
        result /* {value: Promise, done: boolean} */ = gen.next(value);
      } catch (err) {
        return reject(err);
      }
      $next(result);
    }

    function onrejected(reason) {
      let result;
      try {
        result = gen.throw(reason);
      } catch (err) {
        return reject(err);
      }
      $next(result);
    }

    function $next(result /* {value: Promise, done: boolean} */) {
      if (result.done) {
        return resolve(result.value);
      }

      // result.value instanceof Promise
      if (typeof result.value.then === "function") {
        console.log("$next:", result.value);
        return result.value.then(() => {
          onfulfilled(result.value);
        });
      }
      return reject(new TypeError());
    }
  });
}
