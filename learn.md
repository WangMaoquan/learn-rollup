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

## 拆解插件工作流

### 谈谈插件 Hook 类型

插件的各种 Hook 可以根据这两个构建阶段分为两类: `Build Hook` 与 `Output Hook`

- `Build Hook` 即在 Build 阶段执行的钩子函数，在这个阶段主要进行模块代码的转换、AST 解析以及模块依赖的解析，那么这个阶段的 Hook 对于代码的操作粒度一般为模块级别，也就是单文件级别
- `Ouput Hook`(官方称为 Output Generation Hook)，则主要进行代码的打包，对于代码而言，操作粒度一般为 chunk 级别(一个 chunk 通常指很多文件打包到一起的产物)

除了根据构建阶段可以将 Rollup 插件进行分类，根据不同的 Hook 执行方式也会有不同的分类，主要包括 `Async、Sync、Parallel、Squential、First` 这五种

1. Async & Sync
   首先是 `Async` 和 `Sync` 钩子函数，两者其实是相对的，分别代表异步和同步的钩子函数，两者最大的区别在于同步钩子里面不能有异步逻辑，而异步钩子可以有。
2. Parallel
   这里指并行的钩子函数。如果有多个插件实现了这个钩子的逻辑，一旦有钩子函数是异步逻辑，则并发执行钩子函数，不会等待当前钩子完成(底层使用 Promise.all)。
   比如对于 `Build` 阶段的 `buildStart` 钩子，它的执行时机其实是在构建刚开始的时候，各个插件可以在这个钩子当中做一些状态的初始化操作，但其实插件之间的操作并`不是相互依赖`的，也就是可以并发执行，从而提升构建性能。反之，对于需要依赖其他插件处理结果的情况就不适合用 Parallel 钩子了，比如 `transform`。
3. Sequential
   `Sequential` 指串行的钩子函数。这种 Hook 往往适用于插件间处理结果相互依赖的情况，前一个插件 Hook 的返回值作为后续插件的入参，这种情况就需要等待前一个插件执行完 Hook，获得其执行结果，然后才能进行下一个插件相应 Hook 的调用，如 `transform`
4. First
   如果有多个插件实现了这个 Hook，那么 Hook 将依次运行，直到返回一个`非 null 或非 undefined` 的值为止。比较典型的 Hook 是 `resolveId`，一旦有插件的 `resolveId` 返回了一个路径，将停止执行后续插件的 `resolveId` 逻辑

Rollup 当中不同插件 Hook 的类型，实际上不同的类型是可以叠加的，`Async/Sync` 可以搭配后面三种类型中的任意一种，比如一个 Hook 既可以是 Async 也可以是 First 类型

### Build 阶段工作流

![build](build.webp)

1. 首先经历 `options` 钩子进行配置的转换，得到处理后的配置对象
2. 随之 Rollup 会调用 `buildStart(Parallel & Async)` 钩子，正式开始构建流程
3. Rollup 先进入到 `resolveId(First & Async)` 钩子中解析文件路径(从 input 配置指定的入口文件开始)
4. Rollup 通过调用 `load(First & Async)` 钩子加载模块内容
5. 紧接着 Rollup 执行所有的 `transform(Sequential & Async)` 钩子来对模块内容进行进行自定义的转换，比如 babel 转译
6. Rollup 拿到最后的模块内容，进行 AST 分析，得到所有的 import 内容，调用 `moduleParsed(Parallel & Async)` 钩子
   - 6.1 如果是普通的 import，则执行 resolveId 钩子，继续回到`步骤 3`
   - 6.2 如果是动态 import，则执行 `resolveDynamicImport(First & Async)` 钩子解析路径，如果解析成功，则回到`步骤 4` 加载模块，否则回到`步骤 3` 通过 resolveId 解析路径
7. 直到所有的 import 都解析完毕，Rollup 执行 `buildEnd(Parallel & Async)` 钩子，Build 阶段结束

当然，在 Rollup 解析路径的时候，即执行 `resolveId` 或者 `resolveDynamicImport` 的时候，有些路径可能会被标记为 `external(翻译为排除)`，也就是说不参加 Rollup 打包过程，这个时候就不会进行 `load、transform` 等等后续的处理了
