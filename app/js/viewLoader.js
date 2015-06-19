// viewLoader manages which view is currently being displayed in the mainbar of
// the UI.

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
