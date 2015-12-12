'use strict';

// The default settings 
const defaultConfig = {
	homePlugin:  'Overview',
	siad: {
    	path: require('path').join(__dirname, '..', 'Sia'),
	},
	width:       800,
	height:      600,
	x:           0,
	y:           0,
};
// Variable to hold the current configuration in memory
var config;
var path;

/**
 * Holds all config.json related logic 
 * @module configManager
 */
function configManager(path) {
	path = path;
	try {
		config = require(path);
	} catch (err) {
		config = defaultConfig;
	}

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


	return config;
}

module.exports = configManager;
