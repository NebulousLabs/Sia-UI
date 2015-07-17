// UI.js, the first renderer process, handles initializing all other manager
// processes. 

// Electron/Node libraries used across this file
'use strict';
const WebFrame = require('web-frame');
const ElectronScreen = require('screen');
const Path = require('path');
const Fs = require('fs');
const Shell = require('shell');
var Config = require('./js/config.js');

// UI exports one function, init, called by index.html
var UI = (function() {
	// config.json variables
	var configPath = Path.join(__dirname, 'config.json');
	var config;

	// TODO: upon release, enable this
	/*
	function promptUserIfUpdateAvailable() {
		checkForUpdate(function(update) {
			if (update.Available) {
				//ui.notify("New Sia Client Available: Click to update to " + update.Version + "!", "update", function() {
				//	updateClient(update.Version);
				//});
			} else {
				//ui.notify("Sia client up to date!", "success");
			}
		});
	}

	function getVersion(callback) {
		Daemon.call("/daemon/version", callback);
	}

	function checkForUpdate(callback) {
		Daemon.call("/daemon/updates/check", callback);
	}

	function updateClient(version) {
		//Shell.openExternal('https://www.github.com/NebulousLabs/Sia-UI/releases');
	}
	*/

	// adjustZoom() makes the app more readable on high dpi screens. 
	// TODO: Take better approach, resolution doesn't mean high dpi. Though
	// supposedly there's not a sure-fire way to find dpi on all platforms.
	function adjustHighResZoom(config) {
		// Calculated upon function call to get appropriate zoom (even if the
		// primary display were to change).
		var screenSize = ElectronScreen.getPrimaryDisplay().workAreaSize;
		var screenArea = screenSize.width * screenSize.height;
		if (screenArea >= 2048*1152) {
			config.zoom = 2;
			WebFrame.setZoomFactor(config.zoom);
		}
	}

	// init(), called at window.onready, initalizes the view
	function init() {
		Config.load(configPath, function(cfg) {
			config = cfg;
			adjustHighResZoom(config);
			Plugins.init(config);
			Daemon.init(config);
		});
	}

	function close() {
		Config.save(config, configPath);
	}

	// expose 'public' elements
	return {
		init: init,
		close: close,
	};
}());

