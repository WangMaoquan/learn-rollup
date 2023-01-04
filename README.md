`@rollup/plugin-node-resolve` 是为了允许我们加载第三方依赖，否则像 import React from 'react' 的依赖导入语句将不会被 Rollup 识别。
`@rollup/plugin-commonjs` 的作用是将 CommonJS 格式的代码转换为 ESM 格式
