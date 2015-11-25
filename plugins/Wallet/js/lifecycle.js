'use strict';

// How often /wallet updates
var refreshRate = 500; // half-second
var finalRefreshRate = 1000 * 60 * 5; // five-minutes
// Keeps track of if the view is shown
var updating;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Updating  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make API calls, sending a channel name to listen for responses
function update() {
	// Get wallet status and balance
	IPC.sendToHost('api-call', '/wallet', 'update-status');
	// Get list of wallet transactions
	IPC.sendToHost('api-call', {
		url: '/wallet/transactions',
		type: 'GET',
		args: {
			startheight: 0,
			// Superfluous endheight to get whole history
			endheight: 1000000,
		}
	}, 'update-transactions');
	// Get list of wallet addresses
	IPC.sendToHost('api-call', {
		url: '/wallet/addresses',
		type: 'GET',
	}, 'update-addresses');

	updating = setTimeout(update, refreshRate);

	// slow down after first call
	refreshRate = finalRefreshRate;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Start/Stop ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');

	update();
}

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}

