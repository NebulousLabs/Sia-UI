'use strict';

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Need to check if wallet's unencrypted
	IPC.sendToHost('api-call', '/wallet', 'on-opened');
}
IPC.on('on-opened', function(err, result) {
	if (!assertSuccess('on-opened', err)) {
		return;
	}
	wallet = result;

	// If first time opening, show password
	if (!wallet.Encrypted) {
		encrypt();
	}
	// Show correct lock status
   	if (!wallet.Unlocked) {
		locked();
	} else if (wallet.Unlocked) {
		unlocked();
	}

	// Start updating
	update();
});

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}

// Make API calls, sending a channel name to listen for responses
function update() {
	console.log('updating...');
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
	console.log('updating height...');
	if (!assertSuccess('update-height', err)) {
		return;
	}
	// Got the height, get the transactions ... if we're not on block 0
	currentHeight = result.Height;
	if (currentHeight === 0) {
		return;
	}
	IPC.sendToHost('api-call', {
		url: '/wallet/history',
		type: 'GET',
		args: {
			startHeight: 1,
			endHeight: currentHeight,
		}
	}, 'update-history');
});
// TODO: update transaction history and addresses
IPC.on('update-history', function(err, result) {
	console.log('updating history...');
	if (!assertSuccess('update-history', err)) {
		return;
	}
	result.ConfirmedHistory.forEach(function(wlttxn) {
		console.log(wlttxn);
	});
	result.UnconfirmedHistory.forEach(function(wlttxn) {
		console.log(wlttxn);
	});
});

