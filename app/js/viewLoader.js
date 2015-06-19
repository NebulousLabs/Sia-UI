// viewLoader manages which view is currently being displayed in the mainbar of
// the UI.

var fs = require('fs');
var path = require('path');

// Can only start doing view based stuff once the windows loaded
window.onload = function() {
	"use strict";
	// Setup self-evident variable names
	var winView = $('#view'), i;

	// Get array of plugins
	var pluginDir = __dirname + '/plugins/';
	fs.readdir(pluginDir, function(error, plugins) {
		if (error) {
			console.log(error);
			window.alert(error);
			return;
		}

		// DEVTOOL: Log the directory names out
		for (var i = 0; i < plugins.length; i+=1) {
			console.log(plugins[i]);
		}

		// Populate sidebar with buttons
		var sideBar = document.getElementById('sidebar');
		for (i = 0; i < plugins.length; i+=1) {
			var directory = plugins[i];
			var tmpl = document.getElementById('plugin-template').content.cloneNode(true);
			tmpl.querySelector('.sidebar-icon').innerHTML = '<i class=\'fa fa-bars\'></i>';
			tmpl.querySelector('.sidebar-text').innerText = directory;
			sideBar.appendChild(tmpl);
		}
	});
	var sidebarOverviewButton = document.getElementById('sidebar-overview-button');
	var sidebarLibraryButton = document.getElementById('sidebar-library-button');
	var sidebarWalletButton = document.getElementById('sidebar-wallet-button');

	// Style the button cursors
	sidebarOverviewButton.style.cursor = 'pointer';
	sidebarLibraryButton.style.cursor = 'pointer';
	sidebarWalletButton.style.cursor = 'pointer';

	// Default to the 'Overview' view.
	winView.load('html/overview.html');

	// Enable button functionalities.
	sidebarOverviewButton.onclick = function(){
		winView.load('html/overview.html');
	};
	sidebarLibraryButton.onclick = function(){
		winView.load('html/library.html');
	};
	sidebarWalletButton.onclick = function(){
		winView.load('html/wallet.html');
	};
};
