// Global require statements
'use strict';
const webFrame = require('web-frame');
const electronScreen = require('screen');

// UI.js, the first renderer process, handles loading and transitioning between
// buttons and views. Pretty much all user interaction response should go
// through here.
var UI = (function() {
	// UI specific constants
	// Constants used to calculate appropriate zoom
	const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
	const screenArea = screenSize.width * screenSize.height;
	const screenUnit = 800 * 600;

	// configurable UI variables
	// TODO: Allow these to be configurable by the user in some 'settings' page
	var zoomScale = 2;

	// setLogScaleZoom makes the app more readable on high dpi screens. 
	// TODO: Take better approach, resolution doesn't mean high dpi.
	function setLogScaleZoom() {
		var zoomFactor = Math.floor(util.log(zoomScale, screenArea / screenUnit));
		webFrame.setZoomFactor(zoomFactor);
	}
	
	// init, called at $(window).ready, initalizes the view
	function init() {
		setLogScaleZoom();
		plugins.init();
	}

	// Expose elements to be made public
	return {
		'init': init,
	};

})();
