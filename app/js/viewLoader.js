// viewLoader manages which view is currently being displayed in the mainbar of
// the UI.

var fs = require('fs');
var path = require('path');

// Can only start doing view based stuff once the windows loaded
window.onload = function() {
	"use strict";
	// Setup self-evident variable names
	var winView = $('#view');

	// Get array of plugins
	var pluginDir = __dirname + '/plugins/';
	fs.readdir(pluginDir, function(error, plugins) {
		if (error) {
			console.log(error);
			window.alert(error);
			return;
		}

		// Populate index.html's sidebar with buttons
		var sideBar = document.getElementById('sidebar');
		for (var i = 0; i < plugins.length; i+=1) {
			var plugin = plugins[i];
			var tmpl = document.getElementById('button-template').content.cloneNode(true);
			var button = tmpl.querySelector('.sidebar-button');
			button.id = plugin + '-button';
			tmpl.querySelector('.sidebar-icon').innerHTML = '<i class=\'fa fa-bars\'></i>';
			tmpl.querySelector('.sidebar-text').innerText = plugin;
			button.style.cursor = 'pointer';
			sideBar.appendChild(tmpl);
		}
		var sidebarOverviewButton = document.getElementById('Overview-button');
		var sidebarLibraryButton = document.getElementById('Library-button');
		var sidebarWalletButton = document.getElementById('Wallet-button');

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
	});
};
