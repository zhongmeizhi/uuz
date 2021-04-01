const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack');
const path = require('path')

function resolve(dir) {
	return path.resolve(__dirname, '..', dir)
}

module.exports = {
	entry: './src/index.js',
	output: {
		filename: '[name].[hash:8].js',
		path: resolve('dist'),
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@': resolve('src'),
		}
	},
  mode: "development",
	module: {
		rules: [
			{
				test: /\.uuz/,
				exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
							// ["@babel/plugin-transform-react-jsx", {"pragma": "h"}]
							[resolve('lib/uuz-jsx.js')]
            ]
          }
        }
			}
		]
	},
	plugins: [
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({ template: resolve('index.html') })
	]
};
