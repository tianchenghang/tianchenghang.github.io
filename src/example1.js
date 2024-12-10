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

// default 默认导出 `export default someValue`
export default anyName;
// 等价于
// export { anyName as default };

// as 重命名
export { a as foo, b as bar, c as baz, fn as func };

export let token = "alive";
// commonjs 模块输出的是值拷贝 (缓存的值), 不能动态绑定
// es6 模块输出的是值引用, 可以动态绑定
setTimeout(() => {
  token = "expired";
}, 3000);
