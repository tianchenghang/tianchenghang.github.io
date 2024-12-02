// node --expose-gc ./snippet/ch13.js # 允许手动垃圾回收

global.gc(); // 手动垃圾回收
console.log("1.", process.memoryUsage().heapUsed); // 查看堆内存占用
// {
//   rss: 44470272,
//   heapTotal: 7331840,
//   heapUsed: 5588536,
//   external: 2310718,
//   arrayBuffers: 18695
// }
let wm = new WeakMap();
let bigarr = new Array(5 * 1024 * 1024); // 变量 bigarr 引用一个大数组
wm.set(bigarr /* 键 */, 1);
global.gc(); // 手动垃圾回收
console.log("2.", process.memoryUsage().heapUsed); // 查看堆内存占用
// {
//   rss: 85831680,
//   heapTotal: 49020928,
//   heapUsed: 47309008,
//   external: 2310787,
//   arrayBuffers: 59684
// }
bigarr = null; // 清除变量 bigarr 对大数组的引用, 未清除 wm 的键对大数组的引用
global.gc(); // 手动垃圾回收
console.log("3.", process.memoryUsage().heapUsed); // 查看堆内存占用
