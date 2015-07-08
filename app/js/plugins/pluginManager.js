// pluginManager.js manages all plugin logic on a more back-end level for the UI

// Elements used across this file. GCed after file execution
'use strict';
const Fs = require('fs');
var SiaPlugin = require('./plugin');

// When required, pluginManager can be called with a config object to
// initialize plugins
module.exports = (function pluginManager() {
	// Encapsulated 'private' elements
	var home;
	var path;
	var current;
	var plugins = [];

	// setConfig() sets the member variables based on the passed config
	// Callback, if there is one, returns no arguments
	// TODO: delete all plugins when a new path is set?
	function setConfig(config, callback) {
		home = config.homePlugin;
		path = config.pluginsPath;
		callback();
	}

	// setHome detects the home Plugin or otherwise the alphabetically first
	// plugin and sets its button to be first as well as it to be the first
	// view
	function setHome(pluginNames) {
		// Detect if home plugin is installed
		var homeIndex = pluginNames.indexOf(home);
		if (homeIndex !== -1 && pluginNames[0] !== home) {
			// Swap it to be first
			pluginNames[homeIndex] = pluginNames[0];
			pluginNames[0] = home;
		}
	}

	// addPlugin is used as a callback to process each new plugin
	function addPlugin(name) {
		// Make the plugin, giving it a standard transition event to tie to its button
		SiaPlugin(path, name, function(err, plugin) {
			// Show the default plugin view
			if (name === home) {
				plugin.show();
				current = plugin;
			}

			// Add button clickability
			plugin.button.addEventListener('click', function() {
				current.hide();
				plugin.show();
				current = plugin;
			});

			// Store the plugin
			plugins.push(plugin);
		});
	}

	// initPlugins() actually makes the plugins to the UI
	function initPlugins() {
		Fs.readdir(path, function (err, pluginNames) {
			if (err) {
				console.log(err);
			}

			// Determine default plugin
			setHome(pluginNames);
			
			// Initialize each plugin
			pluginNames.forEach(addPlugin);
		});
	}

	// init() sets config and initializes the plugins
	function init(config) {
		setConfig(config, initPlugins);
	}

	// expose 'public' elements and functions
	return {
		setConfig: setConfig,
		init: init
	};
})();
