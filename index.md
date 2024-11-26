# ECMAScript 6 教程

## 目录

1. [ECMAScript 6 简介](./ch01.md)

2. [var, let, const](./ch02.md)

3. [变量的解构赋值](./ch03.md)

4. [模板字符串](./ch04.md)

5. [字符串方法, 正则表达式](./ch05.md)

6. [数值](./ch06.md)

7. [函数](./ch07.md)

8. [数组](./ch08.md)

9. [对象](./ch09.md)

10 [对象方法](./ch10.md)

11 [运算符](./ch11.md)

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
