# 前端

- html5
- css3, tailwind, sass
- js, es6
  - promise, async/await
- ts
- node
- npm, pnpm
- mongodb
- jtest, vitest
- webpack, vite
- axios, fetch, lodash
- vue2/vue3
- element plus
- echarts
- 微前端
- 前端性能
- 计算机网络

前端性能

- PRPL 模式 (Preload, Render, Pre-cache, Lazy load)
- 强缓存, 协商缓存
- [Web Socket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
- [Service Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)

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
