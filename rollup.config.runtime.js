import babel from '@rollup/plugin-babel';
import alias from '@rollup/plugin-alias';

const config = {
  input: 'src/jsx/jsx-runtime.js',
  output: [
    {
      format: 'umd',
      file: 'example/lib/jsx-runtime.js',
      name: 'jsx-runtime',
      sourcemap: false,
    },
  ],
  plugins: [
    alias({
      entries: [
        { find: /^@\/(.+)\.js$/, replacement: './src/$1.js' },
        { find: /^@\/(.+)(?!^\.js)$/, replacement: './src/$1/index.js' },
      ]
    }),
		babel({ babelHelpers: 'bundled' })
	]
};
 
export default config;