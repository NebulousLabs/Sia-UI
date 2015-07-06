// pluginFactory offers creation logic to make plugin parts
// Elements used across this file. GCed after file execution
'use strict';

// When required, pluginFactory gives the functions addView() and addButton()
module.exports = {
	// load adds the webView to the HTML node 'section'
	addView: function(name, path, callback) {
		// DOM element shortcut
		var mainBar = document.getElementById('mainbar');

		// Adding the webview tag
		var view = document.createElement('webview');
		view.id = name + '-view';
		view.src = path;

		// Give webviews nodeintegration
		view.setAttribute('nodeintegration', 'on');

		// Start loading it
		mainBar.appendChild(view);

		// Initiate callback and give it a reference to the appended webview
		callback(view);
	},

	// addButton creates the button html to be added and gives
	// it a listener to show its view 
	addButton: function(name, path, callback) {
		// DOM element shortcuts
		var sideBar = document.getElementById('sidebar');

		// Make button elements to be combined
		var button = document.createElement('div');
		var icon = document.createElement('img');
		var text = document.createElement('div');

		// Set inner values
		button.id = name + '-button';
		button.style.cursor = 'pointer';
		icon.src = path;
		text.innerText = name;

		// Put it together
		button.appendChild(icon)
			.className = 'pure-u sidebar-icon';
		button.appendChild(text)
			.className = 'pure-u sidebar-text';

		// Add it to the sideBar
		sideBar.appendChild(button)
			.className = 'pure-u-1-1 sidebar-button';

		callback(button);
	}
};
