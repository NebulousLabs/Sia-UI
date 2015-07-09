// plugin.js is used to hold plugin components and functions

// Elements used across this file. GCed after file execution
'use strict';
const WebFrame = require('web-frame');
const Path = require('path');
const Factory = require('./pluginFactory')

// When required, plugin.js can be called as a function to create a plugin
module.exports = function plugin(plugPath, name, callback) {
	// initialize components
	var view = new Factory.view(Path.join(plugPath, name, 'index.html'), name);
	var button = new Factory.button(Path.join(plugPath, name, 'button64.png'), name);

	// Start loading the view to the mainbar
	document.getElementById('mainbar').appendChild(view);

	// Add the button to the sidebar
	document.getElementById('sidebar').appendChild(button);

	// show() shows the plugin's view
	function show() {
		view.style.display = '';
	}

	// hides() hides the plugin's view
	function hide() {
		view.style.display = 'none';
	}

	// adjustZoom() sets the zoom to be the same as the UI
	function adjustZoom() {
		var zoomCode = 'require("web-frame").setZoomFactor(' + WebFrame.getZoomFactor() + ');';
		view.executeJavaScript(zoomCode);
	}

	// addButtonClickListener() is used to specify what happens when the
	// plugin's sidebar button is clicked
	function onButtonClick(transition) {
		button.onclick = transition;
	}
	
	// addViewEventListener() is used to interact with the view
	// element in an easy manner. It's even exported as 'on' so
	// the requirer can call `plugin.on(event,response);` to add
	// a listener.
	function addViewEventListener(event, listener) {
		view.addEventListener(event, listener);
	}

	// setConfig() sends a memory copy of the config to the
	// plugin. Primarily to give it access to the siad port, but
	// also to allow it to change the config and add customization
	function sendIPC(channel, args) {
		// DEVTOOL: turn on devtools for the plugin itself
		view.openDevTools();
		view.send(channel, args);
	}

	// return the newly made plugin and its public elements
	return {
		name: name,
		show: show,
		hide: hide,
		adjustZoom: adjustZoom,
		transition: onButtonClick,
		on: addViewEventListener,
		sendIPC: sendIPC,
	};
};
