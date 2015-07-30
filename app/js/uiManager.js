"use strict";
var Config = require("./js/uiConfig.js");

/**
 * The first renderer process, handles initializing all other managers
 * @class UIManager
 */
function UIManager() {
	/**
	 * Config.json variables
	 * @member {string} UIManager~configPath
	 */
	var configPath = Path.join(__dirname, "config.json");
	/**
	 * Config variable held in working memory
	 * @member {config} UIManager~memConfig
	 */
	var memConfig;

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
		//Shell.openExternal("https://www.github.com/NebulousLabs/Sia-UI/releases");
	}
	*/

	/**
	 * Makes the app more readable on high dpi screens. 
	 * @function UIManager~adjustHighResZoom
	 * @param {config} config - config in memory
	 * @todo Take better approach, resolution doesn"t mean high dpi. Though
	 * supposedly there"s not a sure-fire way to find dpi on all platforms.
	 */
	function adjustHighResZoom(config) {
		// Calculated upon function call to get appropriate zoom (even if the
		// primary display were to change).
		var screenSize = ElectronScreen.getPrimaryDisplay().workAreaSize;
		var screenArea = screenSize.width * screenSize.height;
		if (screenArea >= 2048*1152) {
			config.zoom = 2;
			WebFrame.setZoomFactor(config.zoom);
			WebFrame.setZoomFactor(config.zoom);
			WebFrame.setZoomFactor(config.zoom);
		}
	}

	/**
	* Called at window.onready, initalizes the UI
	* @function UIManager#init
	*/
	this.init = function() {
	   Config.load(configPath, function(config) {
		   memConfig = config;
		   //adjustHighResZoom(config);
		   Plugins.init(config);
		   Daemon.init(config);
	   });
   };

   /**
	* Called at window.beforeunload, closes the UI
	* @function UIManager#kill
	*/
   this.kill = function() {
	   Config.save(memConfig, configPath);
   };
}
