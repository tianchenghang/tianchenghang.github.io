// import 语句会提升到模块的顶部, 先执行 import 语句, 再执行代码
import "./example1.js";
import "./example2.js";
// anyName: 导入 default 默认导出时可以指定任意的变量名
// 等价于
// import { default as anyName } from "./example1.js";
// * 整体导入
// as 重命名
// 重复导入, 只会导入一次
import anyName, * as example1 from "./example1.js";
import { bar, baz, foo, func as fn, token } from "./example1.js";

// Import example1 begins
// Importing example2
// Import example1 ends
// Import done
console.log("Import done");
console.log(anyName); // { a: 1, b: 2, c: 3 }
console.log(foo, bar, baz, fn()); // 1 2 3 cheese

console.log(token); // alive
// commonjs 模块输出的是值拷贝 (缓存的值), 不能动态绑定
// es6 模块输出的是值引用, 可以动态绑定
setTimeout(() => {
  console.log(token); // expired
}, 3000);

// 导入的变量是只读变量
try {
  anyName = "try to take over the world!";
} catch (e) {
  console.log(e); // TypeError: Assignment to constant variable
}
console.log(example1);

// [Module: null prototype] {
//   bar: 2,
//   baz: 3,
//   default: { a: 1, b: 2, c: 3 },
//   fn: [Function: fn],
//   foo: 1,
//   func: [Function: fn],
//   token: 'alive'
// }

// export 和 import 的复合写法
export { foo, bar, baz as foobar } from "./example1.js";
// 等价于
// import { foo, bar, baz } from "./example1.js";
// export { foo, bar, baz as foobar }
console.log(import.meta);
