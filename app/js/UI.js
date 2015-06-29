// Global require statements
'use strict';

// UI.js, the first renderer process, handles loading and transitioning between
// buttons and views. Pretty much all user interaction response should go
// through here.
UI = (function() {
	// UI specific constants
	// Constants used to calculate appropriate zoom
	const screenSize = electronScreen.getPrimaryDisplay().workAreaSize;
	const screenArea = screenSize.width * screenSize.height;
	const highRes = 3200 * 1745;

	// setDoubleZoom makes the app more readable on high dpi screens. 
	// TODO: Take better approach, resolution doesn't mean high dpi. Though
	// supposedly there's not a sure-fire way to find dpi on all platforms.
	function setDoubleZoom() {
		if (screenArea >= highRes) {
			webFrame.setZoomFactor(2);
		}
	}
	
	// init, called at $(window).ready, initalizes the view
	function init() {
		setDoubleZoom();
		plugins.init();
	}

	// Expose elements to be made public
	return {
		'init': init,
	};
})();
