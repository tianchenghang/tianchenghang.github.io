import { odd } from "./odd.mjs";
export let counter = 0;
export function even(n) {
  counter++;
  return n === 0 || odd(n - 1);
}
