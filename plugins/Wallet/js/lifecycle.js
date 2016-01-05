'use strict';

// How often /wallet updates
var refreshRate = 500; // half-second
var finalRefreshRate = 1000 * 60 * 5; // five-minutes
// Keeps track of if the view is shown
var updating;

// DEVTOOL: uncomment to bring up devtools on plugin view
// IPCRenderer.sendToHost('devtools');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Updating  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make API calls, sending a channel name to listen for responses
function update() {
	// Get wallet status and balance
	getStatus();
	// Get list of wallet transactions
	getTransactions();
	// Get list of wallet addresses
	getAddresses();

	updating = setTimeout(update, refreshRate);

	// slow down after first call
	refreshRate = finalRefreshRate;
}

// Called upon showing
IPCRenderer.on('shown', update);
// Called upon transitioning away from this view
IPCRenderer.on('hidden', function() {
	clearTimeout(updating);
});
