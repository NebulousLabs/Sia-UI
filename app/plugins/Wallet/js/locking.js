'use strict';

// Unlock the wallet
function unlock() {
	IPC.sendToHost('api-call', {
		url: '/wallet/unlock',
		type: 'POST',
		args: {
			encryptionKey : password,
		},
	}, 'unlocked');
}
IPC.on('unlocked', function(err, result) {
	console.log('unlocking wallet...');
	if (assertSuccess('unlocked', err)) {
		update();
	}
});

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Unlock the wallet if we're just switching back to it
	if (password !== null) {
		unlock();
	} else {
		// Need to check if wallet's unencrypted
		IPC.sendToHost('api-call', '/wallet', 'on-opened');
	}
}
IPC.on('on-opened', function(err, result) {
	if (!assertSuccess('on-opened', err)) {
		return;
	}
	wallet = result;

	if (!wallet.Encrypted && wallet.Unlocked) {
		IPC.sendToHost('api-call', {
			Dictionary: 'english',
		}, 'encrypted')
	}
});
IPC.on('encrypted', function(err, result) {
	if (!assertSuccess('encrypted', err)) {
		return;
	}
	eID('password-popup').classList.remove('blueprint');
	eID('password-popup').innerText = result.PrimarySeed;

	password = result.PrimarySeed;
});

// Called upon transitioning away from this view
function stop() {
	console.log('stopping...');
	// Save password for the session before closing
	IPC.sendToHost('api-call', {
		url: '/wallet/seeds',
		type: 'GET',
		args: {
			Dictionary: 'english',
		}
	}, 'save-password');

	// Stop updating
	clearTimeout(updating);
}
// Received password
IPC.on('save-password', function(err, result) {
	console.log('saving password...');
	if (!assertSuccess('save-password', err)) {
		return;
	}

	password = result.PrimarySeed;
	remainingAddresses = result.AddressesRemaining;
	
	// Lock the wallet
	console.log('locking wallet...');
	IPC.sendToHost('api-call', {
		url: '/wallet/lock',
		type: 'POST',
	}, 'locked');
});
IPC.on('locked', function(err, result) {
	if (!assertSuccess('locked', err)) {
		return;
	}
	console.log(wallet);
});
