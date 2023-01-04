### Rollup 整体构建阶段

build => output => close

```ts
// Build 阶段
const bundle = await rollup.rollup(inputOptions);

// Output 阶段
await Promise.all(outputOptions.map(bundle.write));

// 构建结束
await bundle.close();
```

#### bundle

可以看 build.js 中打印的

```ts
{
  cache: {
    modules: [
      {
        ast: 'AST 节点信息，具体内容省略',
        code: 'export const a = 1;',
        dependencies: [],
        id: '/Users/wangmaoquan/project/rollup/learn-rollup/src/utils/index.ts',
        // 其它属性省略
      },
      {
        ast: 'AST 节点信息，具体内容省略',
        code: "import { add } from './utils';\n" +
        '// @ts-ignore\n' +
        "// import { merge } from 'lodash';\n" +
        '// console.log(merge);\n' +
        'console.log(add(1, 2));\n' +
        '//# sourceMappingURL=index.js.map'
        dependencies: ['/Users/wangmaoquan/project/rollup/learn-rollup/src/utils/index.ts' ],
        id: '/Users/wangmaoquan/project/rollup/learn-rollup/src/index.ts',
        // 其它属性省略
      }
    ],
    plugins: {}
  },
  closed: false,
  // 挂载后续阶段会执行的方法
  close: [AsyncFunction: close],
  generate: [AsyncFunction: generate],
  write: [AsyncFunction: write]
}

```

从上面的信息中可以看出，目前经过 Build 阶段的 bundle 对象其实并没有进行**模块的打包**，这个对象的作用在于存储各个模块的内容及依赖关系，同时暴露 `generate` 和 `write` 方法，以进入到后续的 Output 阶段（write 和 generate 方法唯一的区别在于前者打包完产物会写入磁盘，而后者不会）

**输出如下**

```ts
{
  output: [
    {
      exports: [],
      facadeModuleId: '/Users/wangmaoquan/project/rollup/learn-rollup/src/index.ts',
      isDynamicEntry: false,
      isEntry: true,
      isImplicitEntry: false,
      moduleIds: [Array],
      name: 'index',
      type: 'chunk',
      dynamicImports: [],
      fileName: 'index.js',
      implicitlyLoadedBefore: [],
      importedBindings: {},
      imports: [],
      modules: [Object: null prototype],
      referencedFiles: [],
      code: 'var add = function (a, b) { return a + b; };\n' +
        '\n' +
        '// @ts-ignore\n' +
        "// import { merge } from 'lodash';\n" +
        '// console.log(merge);\n' +
        'console.log(add(1, 2));\n',
      map: null
    }
  ]
}
```

对于一次完整的构建过程而言， Rollup 会先进入到 `Build` 阶段，解析各模块的内容及依赖关系，然后进入 `Output` 阶段，完成打包及输出的过程
