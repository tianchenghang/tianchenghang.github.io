import { bar } from "./fourth.mjs";
console.log("third");
console.log(bar());
function foo() {
  return "foo";
}
export { foo };

// fourth
// foo
// third
// bar
