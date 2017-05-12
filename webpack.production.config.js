'use strict'

const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const cfg = require('./webpack.config.js')
cfg.plugins.push(
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production'),
		},
	}),
	new webpack.LoaderOptionsPlugin({
		minimize: true,
		debug: false,
	}),
	new UglifyJSPlugin()
)

module.exports = cfg
