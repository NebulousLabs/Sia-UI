'use strict';

/** 
 * The default settings 
 * @private
 * @type {Object}
 */ 
const defaultConfig = {
	homePlugin:  'Overview',
	siadPath:    Path.join(__dirname, '..', 'Sia'),
	siadAddress: 'http://localhost:9980',
	siadCommand: process.platform === 'win32' ? './siad.exe' : './siad',
	width:       800,
	height:      600,
	x:           0,
	y:           0,
};

/**
 * The config object derived from the config.json file used to store UI settings
 * @typedef {Object} config
 * @property {string} homePlugin - The name of the default plugin, usually 'Overview'
 * @property {string} siadAddress - Usually 'http://localhost:9980'
 * @property {string} siadCommand - The command to run siad
 * @property {number} zoom - The zoom factor for the UI
 */

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
