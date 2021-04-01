import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/plugins/babel-plugin-uuz-jsx.js',
  output: [
    {
      format: 'umd',
      file: 'example/lib/uuz-jsx.js',
      name: 'uuz-jsx',
      sourcemap: false,
    },
  ],
  plugins: [
		babel({ babelHelpers: 'bundled' })
	]
};
 
export default config;