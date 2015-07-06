// pluginManager.js manages all plugin logic on a more back-end level for the UI

// Elements used across this file. GCed after file execution
'use strict';
const Fs = require('fs');
var NewPlugin = require('./plugin');

// When required, pluginManager can be called with a config object to
// initialize plugins
module.exports = function pluginManager(config) {
	// Encapsulated 'private' elements
	var home = config.homePlugin;
	var path = config.pluginsPath;
	var current;
	var plugins = [];

	// setHome detects Overview or otherwise the alphabetically first plugin
	function setHome(pluginNames) {
		// Detect if Overview plugin is installed
		var ovIndex = pluginNames.indexOf(home);
		if (ovIndex !== -1 && pluginNames[0] !== home) {
			// Swap Overview to be first
			pluginNames[ovIndex] = pluginNames[0];
			pluginNames[0] = home;
		}
	}

	// addPlugin is used as a callback to process each new plugin
	function addPlugin(err, plugin) {
		if (err) { 
			console.log(err);
		}

		// Show the default plugin view
		if (plugin.name === home) {
			plugin.show();
			current = plugin;
		}

		// Store the plugin
		plugins.push(plugin);
		
		// Make the plugin-button show the corresponding plugin-view
		plugin.button.addEventListener('click', function () {
			current.hide();
			plugin.show();
			current = plugin;
		});
	}

	// init initializes plugins
	function init() {
		Fs.readdir(path, function (err, pluginNames) {
			if (err) {
				console.log(err);
			}

			// Determine default plugin
			setHome(pluginNames);
			
			// Initialize each plugin
			pluginNames.forEach(function(name) {
				NewPlugin(path, name, addPlugin);
			});
		});
	}

	// Initialize all plugins
	init();
};
