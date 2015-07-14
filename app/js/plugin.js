// plugin.js is used to hold plugin components and functions

// Elements used across this file. GCed after file execution
'use strict';
const WebFrame = require('web-frame');
const Path = require('path');
const Fs = require('fs');
var Factory = require('./pluginFactory')

// When required, plugin.js can be called as a function to create a plugin
module.exports = function plugin(plugPath, name) {
	// initialize components
	var view = new Factory.view(Path.join(plugPath, name, 'index.html'), name);
	var button = new Factory.button(Path.join(plugPath, name, 'button64.png'), name);
	// Start loading the view to the mainbar
	document.getElementById('mainbar').appendChild(view);
	// Add the button to the sidebar
	document.getElementById('sidebar').appendChild(button);

	// Have all plugins displaying UI's zoom and css
	onView('did-finish-load', function() {
		hide();

		var zoomCode = 'require("web-frame").setZoomFactor(' + WebFrame.getZoomFactor() + ');';
		view.executeJavaScript(zoomCode);
		
		// TODO: common css styling injected in plugins?
		/*
		Fs.readFile(Path.join(__dirname, '../css/general.css'), 'utf8', function(err, file) {
			if (err) {
				console.error(err);
			}
			view.insertCSS(file);
		});
	   */
	});

	// show() shows the plugin's view
	function show() {
		button.classList.add('current');
		view.style.display = '';
		view.send('show');
	}

	// hides() hides the plugin's view
	function hide() {
		button.classList.remove('current');
		view.style.display = 'none';
		view.send('hide');
	}

	// onButtonClick() is used to specify what happens when the plugin's
	// sidebar button is clicked
	function onButtonClick(transition) {
		button.onclick = transition;
	}
	
	// onView() is used to interact with the view element in an easy manner.
	// It's even exported as 'on' so the requirer can call
	// `plugin.on(event,response);` to add a listener.
	function onView(event, listener) {
		view.addEventListener(event, listener);
	}

	// sendIPC is for communicating with the plugin's webview, while still
	// keeping it private to plugin
	function sendIPC(channel, args) {
		view.send(channel, args);
	}

	// toggleDevTools() opens or closes the webviews devtools for more specific
	// output viewing
	function toggleDevTools() {
		if (view.isDevToolsOpened()) {
			view.closeDevTools();
		} else {
			view.openDevTools();
		}
		return;
	}

	// return the newly made plugin and its public elements
	return {
		name: name,
		show: show,
		hide: hide,
		transition: onButtonClick,
		on: onView,
		sendIPC: sendIPC,
		toggleDevTools: toggleDevTools,
	};
};
