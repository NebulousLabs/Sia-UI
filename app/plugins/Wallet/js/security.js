'use strict';

// Unlock the wallet
function unlock() {
	IPC.sendToHost('api-call', {
		url: '/wallet/unlock',
		type: 'POST',
		args: {
			EncryptionPassword : password,
		},
	}, 'unlocked');
}
IPC.on('unlocked', function(err, result) {
	if (!assertSuccess('unlocked', err)) {
		return;
	}
	update();
});

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Unlock the wallet if we're just switching back to it
	if (password) {
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

	if (!wallet.Encrypted && !wallet.Unlocked) {
		IPC.sendToHost('api-call', {
			url: '/wallet/encrypt',
			type: 'POST',
			args: {
				EncryptionPassword: '',
				Dictionary: 'english',
			},
		}, 'encrypted')
	} else if (!wallet.Unlocked && !password) {
		show('request-password');
	} else if (!wallet.Unlocked && password) {
		unlock();
	} else if (wallet.Unlocked) {
		update();
	} else {
		console.error('Unexpected situation!', wallet, result, password);
	}
});
IPC.on('encrypted', function(err, result) {
	if (!assertSuccess('encrypted', err)) {
		return;
	}
	var popup = eID('show-password');
	show(popup);
	
	popup.querySelector('.password').innerText = result.PrimarySeed;
	password = result.PrimarySeed;
});

// Called upon transitioning away from this view
function stop() {
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
	if (!assertSuccess('save-password', err)) {
		return;
	}

	password = result.PrimarySeed;
	remainingAddresses = result.AddressesRemaining;
	
	// Lock the wallet
	IPC.sendToHost('api-call', {
		url: '/wallet/lock',
		type: 'POST',
	}, 'locked');
});
IPC.on('locked', function(err, result) {
	if (!assertSuccess('locked', err)) {
		return;
	}
});
