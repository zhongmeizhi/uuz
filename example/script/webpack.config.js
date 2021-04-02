const HtmlWebpackPlugin = require('html-webpack-plugin'); //通过 npm 安装
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')

function resolve(dir) {
	return path.resolve(__dirname, '..', dir)
}

module.exports = {
	entry: './src/index.js',
	output: {
		// filename: '[name].[hash:8].js',
		filename: '[name].js',
		path: resolve('dist'),
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@': resolve('src'),
			'uuz': resolve('lib')
		}
	},
  mode: "production",
	optimization: {
		minimizer: []
	},
	module: {
		rules: [
			{
				test: /(\.uuz)|(\.jsx)/,
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
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({ template: resolve('index.html') })
	]
};
