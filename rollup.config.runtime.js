import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/core/jsx-runtime.js',
  output: [
    {
      format: 'umd',
      file: 'example/lib/jsx-runtime.js',
      name: 'jsx-runtime',
      sourcemap: false,
    },
  ],
  plugins: [
		babel({ babelHelpers: 'bundled' })
	]
};
 
export default config;