// pluginsManager manages plugin functionality and affects the DOM dynamically
// according to the plugins folder
var fs = require('fs');

var pluginsManager = (function() {
	'use strict';
	// Get array of plugins
	var pluginDir = __dirname + '/plugins/';
	var plugins;

	function init() {
		plugins = fs.readdirSync(pluginDir);
		initButtons(plugins);
		initButtonHandlers(plugins);
	}

	function initButtons(plugins) {
		// Populate index.html's sidebar with buttons
		var sideBar = document.getElementById('sidebar');
		for (var i = 0; i < plugins.length; i+=1) {
			var plugin = plugins[i];
			var tmpl = document.getElementById('button-template').content.cloneNode(true);
			tmpl.querySelector('.sidebar-icon').innerHTML = '<i class=\'fa fa-bars\'></i>';
			tmpl.querySelector('.sidebar-text').innerText = plugin;

			var button = tmpl.querySelector('.sidebar-button');
			button.id = plugin + '-button';
			button.style.cursor = 'pointer';

			sideBar.appendChild(tmpl);
		}
	}

	function initButtonHandlers(plugins) {
		// Setup self-evident variable names
		var mainView = $('#view');

		// Default to the 'Overview' view.
		mainView.load('plugins/Overview/Overview.html');

		// Add click listeners to buttons
		plugins.forEach(function(plugin) {
			$("#" + plugin + "-button").click(function() {
				mainView.load(pluginDir + plugin + '/' + plugin + '.html');
			});
		});
	}

	return {
		"init": init
	};
})();
