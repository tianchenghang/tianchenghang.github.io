import { foo } from "./third.mjs";

console.log("fourth");
console.log(foo());

function bar() {
  return "bar";
}

export { bar };
