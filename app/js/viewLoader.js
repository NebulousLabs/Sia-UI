// viewLoader manages which view is currently being displayed in the mainbar of
// the UI.

var fs = require('fs');
var path = require('path');

// Can only start doing view based stuff once the windows loaded
window.onload = function() {
	"use strict";
	// Setup self-evident variable names
	var winView = $('#view');
	var sidebarOverviewButton = document.getElementById('sidebar-overview-button');
	var sidebarLibraryButton = document.getElementById('sidebar-library-button');
	var sidebarWalletButton = document.getElementById('sidebar-wallet-button');

	// Style the button cursors
	sidebarOverviewButton.style.cursor = 'pointer';
	sidebarLibraryButton.style.cursor = 'pointer';
	sidebarWalletButton.style.cursor = 'pointer';

	// Get array of plugin directories
	fs.readdir(__dirname + '/plugins', function(error, files) {
		if (error) {
			console.log(error);
			window.alert(error);
			return;
		}
		for (var i = 0; i < files.length; ++i) {
			files[i] = path.join(__dirname + '/plugins', files[i]);
			console.log(files[i]);
		}
	})

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
