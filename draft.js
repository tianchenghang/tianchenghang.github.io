async function* genFunc1() {
  yield 1; // yield Promise.resolve(1); // Promise{ PromiseState: "fulfilled", PromiseReturn: 1 }
  yield 2; // yield Promise.resolve(2); // Promise{ PromiseState: "fulfilled", PromiseReturn: 2 }
  return 3; // yield Promise.resolve(3); // Promise{ PromiseState: "fulfilled", PromiseReturn: 3 }
}

async function* genFunc2() {
  const ret = yield* genFunc1();
  console.log("ret:", ret);
  return ret; // return Promise.resolve(ret); // Promise{ PromiseState: "fulfilled", PromiseReturn: ret }
}

(async function () {
  // await 取出 PromiseReturn
  for await (const item of genFunc2()) {
    console.log("item:", item);
  }
})();
