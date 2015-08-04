'use strict';
var Plugin = require('./js/plugin');

/**
 * PluginManager manages all plugin logic for the UI
 * @class PluginManager
 */
function PluginManager() {
	// The home view to be opened first
	var home;
	// The plugins folder
	var plugPath;
	// The current plugin
	var current;
	// Array to store all plugins
	var plugins = [];

	// Detects the home Plugin or otherwise the alphabetically first
	// plugin and sets its button and view to be first in order
	function setHome(pluginNames) {
		// Detect if home plugin is installed
		var homeIndex = pluginNames.indexOf(home);
		if (homeIndex !== -1 && pluginNames[0] !== home) {
			// Swap it to be first
			pluginNames[homeIndex] = pluginNames[0];
			pluginNames[0] = home;
			return;
		}
		// No home plugin installed
		home = pluginNames[0];
	}

	// Handles listening for plugin messages and reacting to them
	function addListeners(plugin) {
		// Only show the default plugin view
		if (plugin.name === home) {
			plugin.on('did-finish-load', plugin.show);
			current = plugin;
		} else {
			plugin.on('did-finish-load', plugin.hide);
		}

		/** 
		 * Standard transition upon button click.
		 * @typedef transition
		 * @todo Add smoother transitions
		 */
		plugin.transition(function() {
			if (current === plugin) {
				return;
			}
			var main = document.getElementById('mainbar').classList;
			main.add('transition');
			setTimeout(function() {
				main.remove('transition');
			}, 250);
			current.hide();
			current = plugin;
			current.show();
		});
		
		// Handle any ipc messages from the plugin
		plugin.on('ipc-message', function(event) {
			switch(event.channel) {
				case 'api-call':
					Daemon.apiCall(event.args[0], function(err, callResult) {
						plugin.sendToView(event.args[0], err, callResult);
					});
					break;
				case 'devtools':
					plugin.toggleDevTools();
					break;
				default:
					console.log('Unknown ipc message: ' + event.channel);
			}
		});

		// Display any console logs from the plugin
		plugin.on('console-message', function(event) {
			console.log(plugin.name + ' plugin logged> ', event.message);
		});	
	}

	// Constructs the plugins and adds them to this manager 
	function addPlugin(name) {
		// Make the plugin, giving its button a standard transition
		var plugin = new Plugin(plugPath, name);

		// addListeners deals with any webview related async tasks
		addListeners(plugin);

		// Store the plugin
		plugins.push(plugin);
	}

	// Reads the config's plugPath for plugin folders
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

	// Sets the member variables based on the passed config
	// TODO: delete all plugins when a new path is set?
	function setConfig(config, callback) {
		home = config.homePlugin;
		plugPath = config.pluginsPath;
		callback();
	}

	/**
	 * Initializes the plugins to the UI
	 * @function PluginManager~init
	 * @param {config} config - config in memory
	 */
	this.init = function(config) {
		setConfig(config, initPlugins);
	};
}
