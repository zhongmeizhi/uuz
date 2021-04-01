import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/index.js',
  output: [
    {
      format: 'umd',
      file: 'example/lib/uuz.umd.js',
      name: 'uuz',
      sourcemap: false,
    },
  ],
  plugins: [
		babel({ babelHelpers: 'bundled' })
	]
};
 
export default config;