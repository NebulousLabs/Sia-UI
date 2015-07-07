// plugin.js is used to hold plugin components and functions

// Elements used across this file. GCed after file execution
'use strict';
const WebFrame = require('web-frame');
const Path = require('path');

// When required, plugin.js can be called as a function to create a plugin's
// elements
module.exports = function plugin(path, name) {
	// Encapsulated 'private' elements
	var view, button;

	// initialize plugin components
	initView();
	initButton();

	// initView() loads up the webview
	function initView(callback) {
		// Make webview element
		view = document.createElement('webview');

		// Set inner values
		view.id = name + '-view';
		view.style.display = 'none';
		view.src = Path.join(path, name, 'index.html');

		// Give webviews nodeintegration
		view.setAttribute('nodeintegration', 'on');

		// Set the zoom by default to be the same as the UI, can
		// only be done after webview starts loading
		view.addEventListener("did-start-loading", function setZoom() {
			var zoomCode = 'require("web-frame").setZoomFactor(' + WebFrame.getZoomFactor() + ');';
			view.executeJavaScript(zoomCode);
		});

		// Start loading it to the mainbar
		document.getElementById('mainbar').appendChild(view);
	}

	// initButton() loads up the sideBar button
	function initButton(callback) {
		// Make button elements to be combined
		button = document.createElement('div');
		var icon = document.createElement('img');
		var text = document.createElement('div');

		// Set inner values
		button.id = name + '-button';
		button.style.cursor = 'pointer';
		button.className = 'pure-u-1-1 sidebar-button';
		icon.src = Path.join(path, name, 'button64.png');
		icon.className = 'pure-u sidebar-icon';
		text.innerText = name;
		text.className = 'pure-u sidebar-text';

		// Put it together
		button.appendChild(icon)
		button.appendChild(text)

		// Add it to the sidebar
		document.getElementById('sidebar').appendChild(button)
	}

	// show() shows the plugin's view
	function show() {
		view.style.display = '';
	}

	// show() hides the plugin's view
	function hide() {
		view.style.display = 'none';
	}

	// Expose public elements of this plugin
	// TODO: verify plugin structure before opening or just deal with
	// errors in async manner?
	return {
		name: name,
		view: view,
		button: button,
		show: show,
		hide: hide,
	};
};
