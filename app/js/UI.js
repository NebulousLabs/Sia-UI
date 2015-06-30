'use strict';

// Global require statements used across the project.
const webFrame = require('web-frame');
const electronScreen = require('screen');
var plugins = require('./plugins')

// UI.js, the first renderer process, handles loading and transitioning between
// buttons and views. Pretty much all user interaction response should go
// through here.
var UI = (function() {
	// Private/Encapsulated elements
	// Constants used to calculate appropriate zoom
	const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
	const screenArea = screenSize.width * screenSize.height;
	const highRes = 2048*1152;
	var coherentZoom = 2;

	// setDoubleZoom makes the app more readable on high dpi screens. 
	// TODO: Take better approach, resolution doesn't mean high dpi. Though
	// supposedly there's not a sure-fire way to find dpi on all platforms.
	function adjustZoom() {
		if (screenArea >= highRes) {
			webFrame.setZoomFactor(coherentZoom);
		}
	}
	
	// init, called at $(window).ready, initalizes the view
	function init() {
		adjustZoom();
		plugins.init();
	}

	// call init and start the UI
	init();
})();

module.exports = UI;
