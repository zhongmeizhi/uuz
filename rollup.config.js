import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'umd',
      file: 'dist/uuz.js',
      name: 'uuz',
      sourcemap: true,
      plugins: [
        terser()
      ]
    },
    {
      format: 'esm',
      file: 'dist/uuz.esm.js',
      sourcemap: false
    }
  ],
  plugins: [
		babel({ babelHelpers: 'bundled' })
	]
}