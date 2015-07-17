// pluginFactory.js is used to create plugin components
'use strict';

// icon() creates the image element for a button
function icon(path) {
	var i = document.createElement('img');
	i.src = path;
	i.className = 'pure-u sidebar-icon';
	return i;
}

// text() creates the text element for a button
function text(name) {
	var t = document.createElement('div');
	t.innerText = name;
	t.className = 'pure-u sidebar-text';
	return t;
}

// When required, pluginFactory gives plugin.js the functions to make its components
module.exports = {
	// view() creates the webview to be put on the mainbar
	view: function view(markupPath, name) {
		// Make webview element
		var v = document.createElement('webview');
		v.id = name + '-view';
		v.className = 'mainbar-view';
		v.src = markupPath;
		
		// Turn nodeintegration on so plugins can use electron & node libraries
		v.nodeintegration = 'on';
		// TODO: If security becomes a concern, specify preload script to give
		// plugins their dependencies and access to libraries, but turn off
		// nodeintegration superpowers
		// view.preload = Path.join(__dirname, 'preload.js')
		
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
		b.className = 'pure-u-1-1 sidebar-button';

		return b;
	},
};
