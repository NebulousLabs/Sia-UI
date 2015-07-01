'use strict';

// Elements used across this file.  These are not contained in
// the module and are GCed after execution of this file.
const path = require('path');
const webview = require('./webview.js');
// Directory of plugins
const pluginsDir = path.join(__dirname, '../plugins');

// pluginFactory.js is used to hold plugin creation logic
function pluginFactory(name, callback) {
	// Encapsulated elements private to the this module
	
	// Required elements of each plugin
	var markupPath = path.join(pluginsDir, name, 'index.html');
	var iconPath = path.join(pluginsDir, name, 'button64.png');
	
	// DOM element shortcuts
	var sideBar = document.getElementById('sidebar');
	var mainBar = document.getElementById('mainbar');

	// The main parts to this plugin
	var view, button;
	
	// addClickResponse gives elements show the corresponding plugin-view
	function addClickResponse(element) {
		element.addEventListener('click', function () {
			show();
		});
	}

	// addButton creates the button html to be added and gives
	// it a listener to show its view 
	function addButton() {
		// Make button elements to be combined
		button = document.createElement('div');
		var icon = document.createElement('img');
		var text = document.createElement('div');

		// Set inner values
		button.id = name + '-button';
		button.style.cursor = 'pointer';
		icon.src = iconPath;
		text.innerText = name;

		// Make the button show the plugin page on click 
		addClickResponse(button);

		// Put it together
		button.appendChild(icon)
			.className = 'pure-u sidebar-icon';
		button.appendChild(text)
			.className = 'pure-u sidebar-text';

		// Add it to the sideBar
		sideBar.appendChild(button)
			.className = 'pure-u-1-1 sidebar-button';
	}
	
	// show the view
	function show() {
		view.style.display = '';
	}

	// hide the view
	function hide() {
		view.style.display = 'none';
	}

	// init makes the separate UI components for a plugin
	function init() {
		// Load index.html into its own webview, then hide it
		webview.load(mainBar, name + '-view', markupPath, function(loadedView) {
			view = loadedView;
			// Hide view by default
			hide();
		});

		// Give the plugin a sidebar button
		addButton();

		// Expose elements to be made public
		// TODO: verify plugin structure before opening or just deal with
		// errors in async manner?
		callback(null, {
			show: show,
			hide: hide,
		});
	}	

	// Initialize this plugin
	init();
}

// When required, pluginFactory.js can be called as a function
// to create a plugin's elements
module.exports = pluginFactory;
