// plugin.js is used to hold plugin components and functions

// Elements used across this file. GCed after file execution
'use strict';
const webFrame = require('web-frame');
const path = require('path');
const factory = require('./pluginFactory.js');

// When required, plugin.js can be called as a function to create a plugin's
// elements
module.exports = function plugin(pluginsPath, name, callback) {
	// Encapsulated 'private' elements
	
	// Required elements of each plugin
	var markupPath = path.join(pluginsPath, name, 'index.html');
	var iconPath = path.join(pluginsPath, name, 'button64.png');
	
	// The main parts to this plugin
	var view, button;

	// show the view
	function show() {
		view.style.display = '';
	}

	// hide the view
	function hide() {
		view.style.display = 'none';
	}	

	// setZoom gives the view the same zoom as the UI
	function setZoom() {
		var zoomCode = 'require("web-frame").setZoomFactor(' + webFrame.getZoomFactor() + ');';
		view.executeJavaScript(zoomCode);
	}


	// init makes the separate UI components for a plugin
	function init() {
		// Load index.html into its own webview, then hide it
		factory.addView(name, markupPath, function(addedView) {
			view = addedView;
			// Set the zoom by default to be the same as the UI, can
			// only be done after webview starts loading
			view.addEventListener("did-start-loading", setZoom); 
			// Hide view by default
			hide();
		});

		// Give the plugin a sidebar button
		factory.addButton(name, iconPath, function(addedButton) {
			button = addedButton;
		});

		// Expose public elements of this plugin
		// TODO: verify plugin structure before opening or just deal with
		// errors in async manner?
		callback(null, {
			name: name,
			view: view,
			button: button,
			show: show,
			hide: hide,
			setZoom: setZoom
		});
	}	

	// Initialize this plugin
	init();
}
