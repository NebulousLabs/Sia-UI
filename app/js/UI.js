// UI.js, the first renderer process, handles loading and transitioning between
// buttons and views. Pretty much all user interaction response should go
// through here.

// Global variables and require statements available to all UI submodules
'use strict';
var fs = require('fs');
var path = require('path');

// Defines the functions and private vars of UI.js
var UI = (function() {

	// Called at $(window).ready to initalize the view
	function init() {
		UI._plugins.init();
	}

	// Expose elements to be made public
	return {
		"init": init
	};

})();
