'use strict';

// Elements used across this file. GCed after file execution
const fs = require('fs');
var newPlugin = require('./plugin');

// pluginManager.js manages all plugin logic on a more back-end level for the UI
var pluginManager = function(config) {
	// Encapsulated 'private' elements
	
	// pointer to the currently viewed plugin
	var currentPlugin;
	// array of all loaded plugins
	var plugins = [];

	// setHome detects Overview or otherwise the alphabetically first plugin
	function setHome(pluginNames) {
		// Detect if Overview plugin is installed
		var ovIndex = pluginNames.indexOf(config.homePlugin);
		if (ovIndex !== -1 && pluginNames[0] !== config.homePlugin) {
			// Swap Overview to be first
			pluginNames[ovIndex] = pluginNames[0];
			pluginNames[0] = config.homePlugin;
		}
	}

	// addPlugin is used as a callback to process each new plugin
	function addPlugin(err, plugin) {
		if (err) { 
			console.log(err);
		}

		// Show the default plugin view
		if (plugin.name === config.homePlugin) {
			plugin.show();
			currentPlugin = plugin;
		}

		// Store the plugin
		plugins.push(plugin);
		
		// Make the plugin-button show the corresponding plugin-view
		plugin.button.addEventListener('click', function () {
			currentPlugin.hide();
			plugin.show();
			currentPlugin = plugin;
		});
	}

	// init initializes plugins based on the passed config
	function init() {
		fs.readdir(config.pluginsDir, function (err, pluginNames) {
			if (err) {
				throw err;
			}

			// Determine default plugin
			setHome(pluginNames);
			
			// Initialize each plugin
			pluginNames.forEach(function(name) {
				newPlugin(config.pluginsDir, name, addPlugin);
			});
		});
	}

	// Initialize all plugins
	init();
};

// When required, pluginManager can be called with a config
// object to initialize plugins
module.exports = pluginManager;
