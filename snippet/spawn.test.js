import { test } from "vitest";
import spawn from "./spawn";

function makePromise(value, timeout) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(value);
    }, timeout);
  });
}

test(
  "Test_spawn1",
  async () => {
    const genFunc = function* () {
      yield makePromise(1, 3000);
      yield 2;
      yield makePromise(3, 3000);
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

test(
  "Test_spawn2",
  async () => {
    async function funcAsync() {
      let ret1 = await makePromise("foo", 3000);
      console.log("await:", ret1);
      let ret2 = await makePromise("bar", 3000);
      console.log("await:", ret2);
    }
    await funcAsync();
  },
  {
    timeout: 6500,
  },
);

test(
  "Test_spawn3",
  async () => {
    function func() {
      return spawn(function* () {
        yield makePromise("foo", 3000);
        yield makePromise("bar", 3000);
      });
    }
    await func();
  },
  {
    timeout: 6500,
  },
);
