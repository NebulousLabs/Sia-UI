'use strict';

// Node module
const Path = require('path');
const Fs = require('fs');
/** 
 * The default settings 
 * @private
 * @type {Object}
 */ 
const defaultConfig = {
	homePlugin:  'Overview',
	siad: {
		path:    Path.join(__dirname, '..', 'Sia'),
	},
	width:       800,
	height:      600,
	x:           0,
	y:           0,
};

/**
 * Holds all config.json related logic for the UI
 * @module UIConfig
 */
module.exports = {
	/**
	 * Writes the current config to defaultConfigPath
	 * @param {config} config - config in memory
	 * @param {string} path - UI's defaultConfigPath
	 */
	save: function(config, path) {
		if (config !== undefined) {
			Fs.writeFile(path, JSON.stringify(config, null, '\t'), function(err) {
				if (err) {
					window.alert(err);
				}
			});
		}
	},

	/**
	 * Finds if a config file exists and uses default if not
	 * @param {string} path - UI's defaultConfigPath
	 * @param {callback} callback
	 */
	load: function(path, callback) {
		try {
			callback(require(path));
		} catch (err) {
			callback(defaultConfig);
		}
	},

	/**
	 * returns the defaultConfig
	 * @param {callback} callback
	 */
	reset: function(callback) {
		callback(defaultConfig);
	},
};
