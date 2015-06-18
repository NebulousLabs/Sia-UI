// viewLoader manages which view is currently being displayed in the mainbar of
// the UI.
var window = null;

window.onload = function() {
	var view = window.$('#view'),
		sidebarOverviewButton = window.document.getElementById('sidebar-overview-button'),
		sidebarLibraryButton = window.document.getElementById('sidebar-library-button'),
		sidebarWalletButton = window.document.getElementById('sidebar-wallet-button');

	// Default to the 'Overview' view.
	view.load('overview.html');

	// Enable the overview button.
	sidebarOverviewButton.style.cursor = 'pointer';
	sidebarOverviewButton.onclick = function() {
		view.load('overview.html');
	};

	// Enable the library button.
	sidebarLibraryButton.style.cursor = 'pointer';
	sidebarLibraryButton.onclick = function() {
		view.load('library.html');
	};

	// Enable the wallet button.
	sidebarWalletButton.style.cursor = 'pointer';
	sidebarWalletButton.onclick = function() {
		view.load('wallet.html');
	};
};
