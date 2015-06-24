// UI.js handles loading and transitioning between buttons and views
// Pretty much all user interaction response should go through here
'use strict';
var fs = require('fs');
var path = require('path');

// Defines the functions and private vars of UI.js
var UI = (function() {

	// Called at $(window).ready to initalize the view
	function init() {
		UI['_pluginManager'].init();
	}

	// Expose elements to be made public
	return {
		"init": init
	};

})();
