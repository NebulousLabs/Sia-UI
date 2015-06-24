// UI.js handles loading and transitioning between buttons and views
// Pretty much all user interaction response should go through here
'use strict';
var fs = require('fs');
var path = require('path');

// Defines the functions and private vars of UI.js
var UI = (function() {
	// Get array of plugins
	var pluginDir = path.join(__dirname, 'plugins');

	// Called at $(window).ready to initalize the view
	function init() {
		// Initialize buttons according to what's in app/plugins
		// TODO: verify plugin folders
		fs.readdir(pluginDir, function (err, plugins) {
			if (err) {
				throw err;
			}

			// Default to Overview or first plugin
			window.onload = function() {
				$('#view').load(path.join(pluginDir, plugins[0], 'index.html'));
			};
			initButtons(plugins);
		});
	}

	// Initializes sidebar buttons based on what's in plugins folder
	function initButtons(plugins) {
		// Detect if Overview plugin is installed and set it to be the 
		// top button and autoloaded view if so
		var ovIndex = $.inArray('Overview', plugins);
		if (ovIndex !== 0 && plugins[0] !== 'Overview') {
			plugins[ovIndex] = plugins[0];
			plugins[0] = 'Overview';
		}

		// Populate index.html's sidebar with buttons
		var sideBar = document.getElementById('sidebar');
		for (var i = 0; i < plugins.length; i++) {
			var plugin = plugins[i];
			var tmpl = document.getElementById('button-template').content.cloneNode(true);
			var iconDir = path.join(pluginDir, plugin, 'button.ico');
			tmpl.querySelector('.sidebar-icon').innerHTML = '<link rel="icon" href=' + iconDir + ' />';
			tmpl.querySelector('.sidebar-text').innerText = plugin;

			var button = tmpl.querySelector('.sidebar-button');
			button.id = plugin + '-button';
			button.style.cursor = 'pointer';

			sideBar.appendChild(tmpl);
		}

		// Add click listeners to buttons
		var mainView = $('#view');
		plugins.forEach(function(plugin) {
			$("#" + plugin + "-button").click(function() {
				mainView.load(path.join(pluginDir, plugin, 'index.html'));
			});
		});
	}

	return {
		"init": init
	};
})();
