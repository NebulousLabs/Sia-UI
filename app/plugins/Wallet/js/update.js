'use strict';

// Make API calls, sending a channel name to listen for responses
function update() {
	IPC.sendToHost('api-call', '/wallet', 'update-status');
	IPC.sendToHost('api-call', '/consensus', 'update-height');

	setTimeout(update, 15000);
}
IPC.on('update-status', function(err, result) {
	if (!assertSuccess('update-status', err)) {
		return;
	}

	wallet = result;
	
	// Update balance
	eID('balance').innerHTML = 'Balance: ' + formatSiacoin(wallet.ConfirmedSiacoinBalance);
});
IPC.on('update-height', function(err, result) {
	if (!assertSuccess('update-height', err)) {
		return;
	}
	// Got the height, get the transactions ... if we're not on block 0
	currentHeight = result.Height;
	if (currentHeight === 0) {
		return;
	}
	IPC.sendToHost('api-call', {
		url: '/wallet/transactions',
		type: 'GET',
		args: {
			startHeight: 0,
			endHeight: currentHeight,
		}
	}, 'update-transactions');
});
// TODO: update transaction history and addresses
IPC.on('update-transactions', function(err, result) {
	if (!assertSuccess('update-transactions', err)) {
		return;
	}
});

