// pluginManager.js manages all plugin logic on a more back-end level for the UI

// Elements used across this file. GCed after file execution
'use strict';
const Fs = require('fs');
var SiaPlugin = require('./plugin');
var Daemon = require('./daemonManager')

// When required, pluginManager can be called with a config object to
// initialize plugins
module.exports = (function pluginManager() {
	// Encapsulated 'private' elements
	var home;
	var plugPath;
	var current;
	var plugins = [];
	var siadAddress;

	// setConfig() sets the member variables based on the passed config
	// Callback, if there is one, returns no arguments
	// TODO: delete all plugins when a new path is set?
	function setConfig(config, callback) {
		home = config.homePlugin;
		plugPath = config.pluginsPath;
		siadAddress = config.siadAddress;
		callback(config);
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
		// Make the plugin, giving its button a standard transition
		var plugin = new SiaPlugin(plugPath, name);

		// Upon finishing view loading
		plugin.on('did-finish-load', function() {
			// Have all plugins start out at UI's zoom
			plugin.adjustZoom();
			plugin.sendIPC('init', siadAddress)
		});

		// Show the default plugin view
		if (name === home) {
			plugin.on('did-finish-load', plugin.show);
			current = plugin;
		}
		
		// Add standard transition upon button click
		plugin.transition(function() {
			current.hide();
			plugin.show();
			current = plugin;
		});

		// Display any ipc messages from the plugin
		plugin.on('ipc-message', function(event) {
			console.log(name + ' plugin sent ipc> ', event.channel);
		});

		// Display any console logs from the plugin
		plugin.on('console-message', function(event) {
			console.log(name + ' plugin logged> ', event.message);
		});	

		// Store the plugin
		plugins.push(plugin);
	}

	// initPlugins() actually creates the plugins to the UI
	function initPlugins() {
		Fs.readdir(plugPath, function (err, pluginNames) {
			if (err) {
				console.log(err);
			}

			// Determine default plugin
			setHome(pluginNames);
			
			// Initialize each plugin according to config
			pluginNames.forEach(addPlugin);
		});
	}

	// init() sets config and initializes the plugins
	function init(config) {
		setConfig(config, initPlugins);
		// TODO: This is hardcoded. daemonManager could be a plugin, siad
		// be a plugin itself, or even have a new class of initialized
		// components called dependencies.
		Daemon.init(config);
	}

	// expose 'public' elements and functions
	return {
		setConfig: setConfig,
		init: init
	};
})();
