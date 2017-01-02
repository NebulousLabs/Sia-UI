'use strict'

const webpack = require('webpack')

const cfg = require('./webpack.config.js')
cfg.plugins.push(new webpack.DefinePlugin({
	"process.env": {
		NODE_ENV: JSON.stringify("production")
	}
}))

module.exports = cfg

