console.log("Import example1 begins");
await new Promise((resolve) => setTimeout(resolve, 1000));
console.log("Import example1 ends");

var a = 1;
let b = 2;
const c = 3;

export function fn() {
  return "cheese";
}

let anyName = { a, b, c };

// export default 1;
export default anyName;
// 等价于
// export { anyName as default };

// as 重命名
export { a as foo, b as bar, c as baz, fn as func };

export let token = "alive";
// ES6 导入导出的值动态绑定
// CommonJS 导入缓存的值, 没有动态绑定
setTimeout(() => {
  token = "expired";
}, 3000);
