'use strict';

// The default settings
const defaultConfig = {
	homePlugin:  'Overview',
	siad: {
    	path: require('path').join(__dirname, '../..', 'Sia'),
		detached: false,
	},
	persistInTray: true,
	width:       800,
	height:      600,
	x:           0,
	y:           0,
};
// Variable to hold the current configuration in memory
var config;

/**
 * Holds all config.json related logic
 * @module configManager
 */
function configManager(path) {
	try {
		config = require(path);
	} catch (err) {
		config = defaultConfig;
	}

	/**
	 * Gets or sets a config attribute
	 * @param {object} key - key to get or set
	 * @param {object} value - value to set config[key] as
	 */
	config.attr = function(key, value) {
		if (value !== undefined) {
			config[key] = value;
		}
		if (config[key] === undefined) {
			config[key] = null;
		}
		return config[key];
	};

	/**
	 * Writes the current config to defaultConfigPath
	 * @param {string} path - UI's defaultConfigPath
	 */
	config.save = function() {
		require('fs').writeFileSync(path, JSON.stringify(config, null, '\t'));
	};

	/**
	 * Sets config to what it was on disk
	 */
	config.reset = function() {
		config = configManager(path);
	};

	// Save to disk immediately when loaded
	config.save();

	// Return the config object with the above 3 member functions
	return config;
}

module.exports = configManager;
