'use strict';

// Elements used across this file. GCed after file execution
const webFrame = require('web-frame');
const electronScreen = require('screen');
const path = require('path');
var plugins = require('./pluginManager');

// Default config constants
const highRes= 2048*1152;
const defaultConfig = {
	zoom : 1.5,
	pluginsDir : path.join(__dirname, '../plugins'),
	homePlugin : 'Overview'
};

// UI.js, the first renderer process, handles loading and transitioning between
// buttons and views. Pretty much all user interaction response should go
// through here.
var UI = (function() {
	// Encapsulated 'private' elements
	
	// Configurable UI settings
	// TODO: Allow configuration through some settings page
	var config = defaultConfig;

	// adjustZoom makes the app more readable on high dpi screens. 
	// TODO: Take better approach, resolution doesn't mean high dpi. Though
	// supposedly there's not a sure-fire way to find dpi on all platforms.
	function adjustZoom() {
		// Calculated upon function call to get appropriate zoom (even if the
		// primary display were to change).
		var screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
		var screenArea = screenSize.width * screenSize.height;
		if (screenArea >= highRes) {
			webFrame.setZoomFactor(config.zoom);
		}
	}
	
	// init, called at $(window).ready, initalizes the view
	function init() {
		adjustZoom();
		plugins(config);
	}

	// call init and start the UI
	init();
})();

// When required, the UI initializes itself through a single call to init()
module.exports = UI;
