// viewLoader manages which view is currently being displayed in the mainbar of
// the UI.

window.onload = function() {
	// Default to the 'Overview' view.
	$('#view').load('html/overview.html');

	// Enable the overview button.
	var sidebarOverviewButton = document.getElementById('sidebar-overview-button');
	sidebarOverviewButton.style.cursor = 'pointer';
	sidebarOverviewButton.onclick = function(){
		$('#view').load('html/overview.html');
	};

	// Enable the library button.
	var sidebarLibraryButton = document.getElementById('sidebar-library-button');
	sidebarLibraryButton.style.cursor = 'pointer';
	sidebarLibraryButton.onclick = function(){
		$('#view').load('html/library.html');
	};

	// Enable the wallet button.
	var sidebarWalletButton = document.getElementById('sidebar-wallet-button');
	sidebarWalletButton.style.cursor = 'pointer';
	sidebarWalletButton.onclick = function(){
		$('#view').load('html/wallet.html');
	};
}
