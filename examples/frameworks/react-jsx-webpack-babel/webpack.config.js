const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

const outputPath = 'dist'

module.exports = {
	entry: './src/index.jsx',
	output: {path: path.resolve(outputPath), filename: 'index.js'},
	devServer: {contentBase: outputPath},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			// Prevent duplicates of these libraries from being included in the output bundle.
			react: path.resolve('node_modules', 'react'),
		},
	},

	module: {
		rules: [
			/**
			 * Source maps
			 */
			{test: /\.js$/, use: ['source-map-loader'], enforce: 'pre'},

			/**
			 * JavaScript with React-flavored JSX
			 */
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-react'],
							plugins: ['@babel/plugin-proposal-class-properties'],
						},
					},
				],
			},

			/**
			 * Assets
			 * The 'limit: -1' causes all assets to be external (thus cacheable by the browser)
			 */
			{
				test: /\.(glb|jpg)$/,
				exclude: [],
				use: [{loader: 'url-loader', options: {limit: -1, name: '[path][name].[hash].[ext]'}}],
			},
		],
	},
	plugins: [
		// Copies index.html to dist (in dev mode with dev server copies it to memory instead)
		new HtmlPlugin({template: './src/index.html', hash: true}),
	],
}
