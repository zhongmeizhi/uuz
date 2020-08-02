import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/index.js',
  output: [
    {
      format: 'esm',
      file: 'uuzpack/example/uuz.esm.js',
      sourcemap: false
    }
  ],
  plugins: [
		babel({ babelHelpers: 'bundled' })
	]
};
 
export default config;