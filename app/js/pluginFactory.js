// pluginFactory.js is used to create plugin components

// Elements used across this file. GCed after file execution
'use strict';
const Path = require('path');

// icon() creates the image element for a button
function icon(path) {
	var icon = document.createElement('img');
	icon.src = path;
	icon.className = 'pure-u sidebar-icon';
	return icon;
}

// text() creates the text element for a button
function text(name) {
	var text = document.createElement('div');
	text.innerText = name;
	text.className = 'pure-u sidebar-text';
	return text;
}

// When required, pluginFactory gives plugin.js the functions to make its components
module.exports = {
	// view() creates the webview to be put on the mainbar
	view: function view(markupPath, name) {
		// Make webview element
		var view = document.createElement('webview');
		view.id = name + '-view';
		view.src = markupPath;
		
		// Turn nodeintegration on so plugins can use electron & node libraries
		view.nodeintegration = 'on';
		// TODO: If security becomes a concern, specify preload script to give
		// plugins their dependencies and access to libraries, but turn off
		// nodeintegration superpowers
		// view.preload = Path.join(__dirname, 'preload.js')
		
		return view;
	},
	// button() creates the button to be put on the sidebar
	button: function button(iconPath, name) {
		// Make button elements and combine
		var button = document.createElement('div');
		button.appendChild(new icon(iconPath));
		button.appendChild(new text(name));

		// Set inner values
		button.id = name + '-button';
		button.className = 'pure-u-1-1 sidebar-button';

		return button;
	},
}
