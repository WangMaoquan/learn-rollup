import typescript from '@rollup/plugin-typescript';

/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  /**
   * 多入口的配置, input是一个数组或者一个对象都行
   * input: ["src/index.ts", "src/utils/index.ts"]
   */
  input: {
    index: 'src/index.ts',
    util: 'src/utils/index.ts',
  },

  /**
   *  output 是一个对象时, 输出为一个
   * 多产物的话 就换成一个数组
   * format 的值 "amd", "cjs", "system", "es", "iife" or "umd".
   */
  output: [
    {
      dir: 'dist/es', // 输出目录
      format: 'esm', // 输出格式
    },
    {
      dir: 'dist/cjs',
      format: 'cjs',
    },
  ],
  plugins: [typescript()],
  // 不想被打包的可以用 external
  external: ['react', 'react-dom'],
};

// 我们也可以导出的配置是一个数组, 数组的每一项都是一个rollupOtions 用于应对入口打包的配置不一样的情况
// 如下

// /**
//  * @type { import('rollup').RollupOptions }
//  */
// const buildIndexOptions = {
//   input: ["src/index.js"],
//   output: [
//     // 省略 output 配置
//   ],
// };

// /**
//  * @type { import('rollup').RollupOptions }
//  */
// const buildUtilOptions = {
//   input: ["src/util.js"],
//   output: [
//     // 省略 output 配置
//   ],
// };

// export default [buildIndexOptions, buildUtilOptions];

export default buildOptions;

// 输出 output 的相关配置
const rollupOutputConfig = {
  // 产物输出目录
  dir: path.resolve(__dirname, 'dist'),
  // 以下三个配置项都可以使用这些占位符:
  // 1. [name]: 去除文件后缀后的文件名
  // 2. [hash]: 根据文件名和文件内容生成的 hash 值
  // 3. [format]: 产物模块格式，如 es、cjs
  // 4. [extname]: 产物后缀名(带`.`)
  // 入口模块的输出文件名
  entryFileNames: `[name].js`,
  // 非入口模块(如动态 import)的输出文件名
  chunkFileNames: 'chunk-[hash].js',
  // 静态资源文件输出文件名
  assetFileNames: 'assets/[name]-[hash][extname]',
  // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
  format: 'cjs',
  // 是否生成 sourcemap 文件
  sourcemap: true,
  // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
  name: 'MyBundle',
  // 全局变量声明
  globals: {
    // 项目中可以直接用`$`代替`jquery`
    jquery: '$',
  },
};
