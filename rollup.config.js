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
