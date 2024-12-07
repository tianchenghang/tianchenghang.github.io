# ECMAScript 6 教程

## 目录

1. [babel 转码](./ch01.md)
2. [let, const](./ch02.md)
3. [解构赋值](./ch03.md)
4. [模板字符串](./ch04.md)
5. [String, RegExpr](./ch05.md)
6. [数值](./ch06.md)
7. [function](./ch07.md)
8. [Array](./ch08.md)
9. [Object](./ch09.md)
10. [Object 方法](./ch10.md)
11. [运算符](./ch11.md)
12. [Symbol](./ch12.md)
13. [Set, Map](./ch13.md)
14. [Proxy](./ch14.md)
15. [Reflect](./ch15.md)
16. [Promise, async/await](./ch16.md)
17. [Iterator](./ch17.md)
18. [Generator](./ch18.md)

## 其他

安装字体, 脚本等以获得更好的阅读体验

```js
// ==UserScript==
// @name         custom fonts
// @namespace    https://161043261.github.io/
// @version      0.0.1
// @description  custom fonts
// @author       https://161043261.github.io/
// @match        https://github.com/*
// @match        https://161043261.github.io/*
// @match        https://tianchenghang.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  document.querySelector("style").innerText += `
    * {
      font-family: "JS", "Iosevka SS06", "LXGW WenKai Mono", "Sarasa Mono SC", "Xiaolai Mono SC" !important;
    }`;
})();
```

字体

- [Iosevka](https://github.com/be5invis/Iosevka)
- [霞鹜文楷](https://github.com/lxgw/LxgwWenKai)
- [小赖字体](https://github.com/lxgw/kose-font)
- [更纱黑体](https://github.com/be5invis/Sarasa-Gothic)

其他阅读

[161043261.github.io](https://161043261.github.io)
