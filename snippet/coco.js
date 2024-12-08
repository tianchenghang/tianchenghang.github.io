module.exports = coco;

// func.call(thisVal, ...args);
// func.apply(thisVal, args[]);
// const newFunc = func.bind(thisVal);

/**
 * https://github.com/tj/co/blob/master/index.js
 */
function coco(gen /* Generator | GeneratorFunction */) /* : Promise */ {
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
      let result = undefined;
      try {
        result /* {value: Promise, done: boolean} */ = gen.next(result);
      } catch (e) {
        return reject(e);
      }
      step(result);
    }

    function onrejected(reason) {
      let result = undefined;
      try {
        result = gen.throw(reason);
      } catch (err) {
        return reject(err);
      }
      step(result);
    }

    function step(result /* {value: Promise, done: boolean} */) {
      if (result.done) {
        return resolve(result.value);
      }

      // result.value instanceof Promise
      if (typeof result.value.then === "function") {
        console.log("coco:", result.value);
        return result.value.then(onfulfilled);
      }
      return reject(new TypeError());
    }
  });
}
