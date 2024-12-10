import { foo } from "./first.mjs";

console.log("second");
// second
// ReferenceError: Cannot access 'foo' before initialization
console.log(foo);
export let bar = "bar";
