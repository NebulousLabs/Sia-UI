// plugin.js is used to hold plugin components and functions
'use strict';
const Path = require('path');
var Factory = require('./pluginFactory');

// When required, plugin.js can be called as a function to create a plugin
module.exports = function plugin(plugPath, name) {
	// initialize components
	var view = new Factory.view(Path.join(plugPath, name, 'index.html'), name);
	var button = new Factory.button(Path.join(plugPath, name, 'assets', 'button.png'), name);

	if (button) {
		console.log('button works')
	}

	// show() shows the plugin's view
	function show() {
		button.classList.add('current');
		view.style.display = '';
		view.executeJavaScript('if (typeof init === "function") init();');
	}

	// hides() hides the plugin's view
	function hide() {
		button.classList.remove('current');
		view.style.display = 'none';
		view.executeJavaScript('if (typeof kill === "function") kill();');
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
		view.send.apply(view, [].slice.call(arguments));
		//view.send(channel, args);
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
