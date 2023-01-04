import typescript from '@rollup/plugin-typescript';

/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: ['src/index.ts'],
  output: {
    // 产物输出目录
    dir: 'dist/es',
    // 产物格式
    format: 'esm',
  },
  plugins: [typescript()],
};

export default buildOptions;
