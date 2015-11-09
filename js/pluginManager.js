'use strict';

/**
 * PluginManager manages all plugin logic for the UI
 * @class PluginManager
 */
function PluginManager() {
	/**
	 * Plugin constructor
	 * @member {Plugin} PluginManager~Plugin
	 */
	var Plugin = require('./js/plugin');
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
	var plugins = {};

	/**
	 * Detects the home Plugin or otherwise the alphabetically first
	 * plugin and sets its button and view to be first in order
	 * @function PluginManager~setOrder
	 * @todo: this is hardcoded, perhaps can add priority system
	 * @param {string[]} pluginNames - array of subdirectories of plugins/
	 */
	function setOrder(pluginNames) {
		// Detect if about plugin is installed
		var aboutIndex = pluginNames.indexOf('About');
		if (aboutIndex !== -1) {
			// Swap it to be last
			pluginNames[aboutIndex] = pluginNames[pluginNames.length - 1];
			pluginNames[pluginNames.length - 1] = 'About';
		}

		// Detect if home plugin is installed
		var homeIndex = pluginNames.indexOf(home);
		if (homeIndex !== -1) {
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
		/** 
		 * Standard transition upon button click.
		 * @typedef transition
		 * TODO: Can sometime have two 'current' buttons when selecting a
		 * sidebar button too quickly
		 */
		plugin.transition(function() {
			// Don't do anything if already on this plugin
			if (current === plugin || current.isLoading()) {
				return;
			}

			// Fadein and fadeout mainbar
			var main = document.getElementById('mainbar').classList;
			main.add('transition');
			setTimeout(function() {
				main.remove('transition');
			}, 170);

			// Switch plugins
			current.hide();
			current = plugin;
			current.show();
		});
		
		// Handle any ipc messages from the plugin
		plugin.on('ipc-message', function(event) {
			var responseChannel;
			switch(event.channel) {
				case 'api-call':
					// Redirect api calls to the daemonManager
					var call = event.args[0];
					responseChannel = event.args[1];
					// Send the call only if the Daemon appears to be running
					if (!Daemon.Running) {
						return;
					}
					Daemon.apiCall(call, function(err, result) {
						if (err) {
							// If a call didn't work, test that the
							// `/consensus` call still works
							console.error(err, call);
							Daemon.ifSiad(function() {
								// Send error response back to the plugin
								plugin.sendToView(responseChannel, err, result);
							}, function() {
								// `/consensus` call failed too, assume siad
								// has stopped
								UI.notify('siad seems to have stopped working!', 'stop');
							});
						} else if (responseChannel) {
							plugin.sendToView(responseChannel, err, result);
						}
					});
					break;
				case 'notify':
					// Use UI notification system
					UI.notify.apply(null, event.args);
					break;
				case 'tooltip':
					// Use UI tooltip system
					event.args[1].top += $('.header').height();
					event.args[1].left += $('#sidebar').width();
					UI.tooltip.apply(null, event.args);
					break;
				case 'config':
					// get or set something in the config.json
					var args = event.args[0];
					var result = UI.config(args);
					responseChannel = event.args[1];
					if (responseChannel) {
						plugin.sendToView(responseChannel, result);
					}
					break;
				case 'devtools':
					// Plugin called for its own devtools, toggle it
					plugin.toggleDevTools();
					break;
				default:
					console.log('Unknown ipc message: ' + event.channel);
			}
		});

		// Display any console logs from the plugin
		plugin.on('console-message', function(event) {
			var srcFile = event.sourceId.replace(/^.*[\\\/]/, '');
			console.log(plugin.name + ' plugin logged from ' + srcFile +'(' + event.line + '): ' + event.message);
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

		// Start with the home plugin as current
		if (name === home) {
			current = plugin;
			plugin.on('dom-ready', current.show);
		}

		// addListeners deals with any webview related async tasks
		addListeners(plugin);

		// Store the plugin
		plugins[name] = plugin;
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
			setOrder(pluginNames);
			
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
		plugPath = Path.join(__dirname, 'plugins');
		callback();
	}

	/**
	 * Initializes the plugins to the UI
	 * @function PluginManager.init
	 * @param {config} config - config in memory
	 */
	this.init = function(config) {
		setConfig(config, initPlugins);
	};
}
