### config 插件

- `@rollup/plugin-node-resolve`: 是为了允许我们加载第三方依赖，否则像 import React from 'react' 的依赖导入语句将不会被 Rollup 识别。
- `@rollup/plugin-commonjs`: 的作用是将 CommonJS 格式的代码转换为 ESM 格式

### output 插件

[列表](https://github.com/rollup/awesome#output)

**常用插件**

- `@rollup/plugin-json`： 支持.json 的加载，并配合 rollup 的 Tree Shaking 机制去掉未使用的部分，进行按需打包。
- `@rollup/plugin-babel`：在 Rollup 中使用 Babel 进行 JS 代码的语法转译。
- `@rollup/plugin-typescript`: 支持使用 TypeScript 开发。
- `@rollup/plugin-alias`：支持别名配置。
- `@rollup/plugin-replace`：在 Rollup 进行变量字符串的替换。
- `rollup-plugin-visualizer`: 对 Rollup 打包产物进行分析，自动生成产物体积可视化分析图。

## JavaScript API 方式调用

我们通过 Rollup 的配置文件结合 `rollup -c` 完成了 Rollup 的打包过程，但有些场景下我们需要基于 Rollup 定制一些打包过程，配置文件就不够灵活了，这时候我们需要用到对应 JavaScript API 来调用 Rollup，主要分为 `rollup.rollup` 和 `rollup.watch` 两个 API

具体代码在 `scripts` 下面
