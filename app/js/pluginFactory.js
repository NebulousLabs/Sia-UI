// pluginFactory.js is used to create plugin components
'use strict';
const WebFrame = require('web-frame');

// icon() creates the image element for a button
function icon(path) {
	var i = document.createElement('img');
	i.src = path;
	i.className = 'pure-u icon';
	return i;
}

// text() creates the text element for a button
function text(name) {
	var t = document.createElement('div');
	t.innerText = name;
	t.className = 'pure-u text';
	return t;
}

// When required, pluginFactory gives plugin.js the functions to make its components
module.exports = {
	// view() creates the webview to be put on the mainbar
	view: function view(markupPath, name) {
		// Make webview element
		var v = document.createElement('webview');
		v.id = name + '-view';
		v.className = 'plugin-view';
		v.src = markupPath;
		v.autosize = 'on';
		
		// Turn nodeintegration on so plugins can use electron & node libraries
		// TODO: nodeintegration breaks some global variables on sites, like
		// jquery. We should turn nodeintegration on only for the plugins that
		// need it.
		v.nodeintegration = 'on';
		// TODO: If security becomes a concern, specify preload script to give
		// plugins their dependencies and access to libraries, but turn off
		// nodeintegration superpowers
		// view.preload = Path.join(__dirname, 'preload.js')

		// Have all plugins displaying UI's zoom by default
		v.addEventListener('did-finish-load', function() {
			var zoomCode = 'require("web-frame").setZoomFactor(' + WebFrame.getZoomFactor() + ');';
			v.executeJavaScript(zoomCode);
		});

		// Start loading the view to the mainbar
		document.getElementById('mainbar').appendChild(v);
		return v;
	},
	// button() creates the button to be put on the sidebar
	button: function button(iconPath, name) {
		// Make button elements and combine
		var b= document.createElement('div');
		b.appendChild(new icon(iconPath));
		b.appendChild(new text(name));

		// Set inner values
		b.id = name + '-button';
		b.className = 'pure-u-1-1 button';

		// Add the button to the sidebar
		document.getElementById('sidebar').appendChild(b);
		return b;
	},
};
