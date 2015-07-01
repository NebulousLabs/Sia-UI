'use strict';

// Elements used across this file.  These are not contained in
// the module and are GCed after execution of this file.
const fs = require('fs');
var newPlugin = require('./pluginFactory');

// pluginManager.js manages all plugin logic on a more back-end level for the UI
var pluginManager = function(config) {
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

	// initPlugins initializes plugins based on the passed config
	function initPlugins() {
		fs.readdir(config.pluginsDir, function (err, pluginNames) {
			if (err) {
				throw err;
			}

			// Determine default plugin
			setHome(pluginNames);
			
			// Initialize each plugin as an attribute
			pluginNames.forEach(function(name) {
				newPlugin(name, function(err, plugin) {
					if (err) { 
						console.log(err);
					}

					// Show the default plugin view
					if (name === config.homePlugin) {
						plugin.show();
					}

					// Give the pluginManager ownership of the new plugin
					pluginManager[name] = plugin;
				});
			});
		});
	}

	// Expose elements to be made public
	return {
		init: initPlugins
	}
}

// When required, pluginManager gives tools to manage plugins created
module.exports = pluginManager;
