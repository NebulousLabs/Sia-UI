// UI.js, the first renderer process, handles loading and transitioning between
// buttons and views. Pretty much all user interaction response should go
// through here.

// Global variables and require statements available to all renderer processes
'use strict';
var fs = require('fs');
var path = require('path');
var webFrame = require('web-frame');

// Defines the functions and private vars of UI.js
var UI = (function() {

	// Used to make the app more readable on hidpi screens. web-frame has 
	// TODO: Automate this based on screen size
	var atomScreen = require('screen');
	var screenSize = atomScreen.getPrimaryDisplay().workAreaSize;
	webFrame.setZoomFactor(2);

	// Called at $(window).ready to initalize the view
	function init() {
		UI._plugins.init();
	}

	// Expose elements to be made public
	return {
		"init": init
	};

})();
