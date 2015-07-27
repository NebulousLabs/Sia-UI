'use strict';
var Plugin = require('./js/plugin');

/**
 * PluginManager manages all plugin logic for the UI
 * @class PluginManager
 */
function PluginManager() {
	/**
	 * The home view to be opened first
	 * @member {string} PluginManager~home
	 */
	var home;
	/**
	 * The plugins folder
	 * @member {string} PluginManager~plugPath
	 */
	var plugPath;
	/**
	 * The current plugin
	 * @member {Plugin} PluginManager~current
	 */
	var current;
	/**
	 * Array to store all plugins
	 * @member {Plugin[]} PluginManager~plugins
	 */
	var plugins = [];

	/**
	 * Detects the home Plugin or otherwise the alphabetically first
	 * plugin and sets its button and view to be first in order
	 * @function PluginManager~setHome
	 * @param {string[]} pluginNames - array of subdirectories of app/plugins/
	 */
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

	/**
	 * Handles listening for plugin messages and reacting to them
	 * @function PluginManager~addListeners
	 * @param {Plugin} plugin - a newly made plugin object
	 */
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
			current.hide();
			plugin.show();
			current = plugin;
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

	/**
	 * Constructs the plugins and adds them to this manager 
	 * @function PluginManager~addPlugin
	 * @param {string} name - The plugin folder's name
	 */
	function addPlugin(name) {
		// Make the plugin, giving its button a standard transition
		var plugin = new Plugin(plugPath, name);

		// addListeners deals with any webview related async tasks
		addListeners(plugin);

		// Store the plugin
		plugins.push(plugin);
	}

	/**
	 * Reads the config's plugPath for plugin folders
	 * @function PluginManager~initPlugins
	 */
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

	/**
	 * Sets the member variables based on the passed config
	 * @function PluginManager~setConfig
	 * @param {config} config - config in memory
	 * @param {callback} callback
	 * @todo delete all plugins when a new path is set?
	 */
	function setConfig(config, callback) {
		home = config.homePlugin;
		plugPath = config.pluginsPath;
		callback();
	};

	/**
	 * Initializes the plugins to the UI
	 * @function PluginManager~init
	 * @param {config} config - config in memory
	 */
	this.init = function(config) {
		setConfig(config, initPlugins);
	};
}
var Plugins = new PluginManager();
