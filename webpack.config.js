'use strict'

const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const version = require('./package.json').version

function isVendor({ resource }) {
	return resource &&
	resource.indexOf('node_modules') >= 0 &&
	resource.match(/\.(js|json)$/)
}

// Compute the entry-points for Sia-UI.
const entrypoints = {}
const plugins = glob.sync('./plugins/*/js/index.js')
plugins.forEach((plugin) => {
	entrypoints[path.dirname(path.dirname(plugin))] = ['babel-polyfill', path.resolve('./js/rendererjs/pluginapi.js'), plugin]
})

entrypoints['renderer'] = ['babel-polyfill', path.resolve('./js/rendererjs/index.js')]
entrypoints['main'] = path.resolve('./js/mainjs/index.js')

module.exports = {
	entry: entrypoints,
	plugins: [
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(version),
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: isVendor,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			minChunks: Infinity,
		}),
	],
	output: {
		path: path.resolve('./dist'),
		filename: '[name].js',
	},
	resolve: {
		modules: [path.resolve('./node_modules')],
	},
	node: {
		__dirname: false,
		__filename: false,
	},
	target: 'electron',
	module: {
		// this noParse is to deal with an issue with validate.js not being packed properly.
		// see this issue: https://github.com/webpack/webpack/issues/138 for more information.
		noParse: /node_modules\/json-schema\/lib\/validate\.js/,
		rules: [
			{
				test: /\.js?$/,
				use: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
}
