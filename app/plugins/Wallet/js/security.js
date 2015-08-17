'use strict';

// Unlock the wallet
function unlock(password) {
	IPC.sendToHost('api-call', {
		url: '/wallet/unlock',
		type: 'POST',
		args: {
			EncryptionPassword : password,
		},
	}, 'unlocked');
}
IPC.on('unlocked', function(err, result) {
	if (err) {
		notify('Wrong password', 'error');
	} else {
		eID('lock-status').innerHTML = 'Unlocked';
		notify('Wallet unlocked', 'unlocked');
	}
	hide('request-password');
	update();
});

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

	// Show correct lock status or show password
	if (!wallet.Encrypted && !wallet.Unlocked) {
		IPC.sendToHost('api-call', {
			url: '/wallet/encrypt',
			type: 'POST',
			args: {
				EncryptionPassword: '',
				Dictionary: 'english',
			},
		}, 'encrypted')
	} else if (!wallet.Unlocked) {
		eID('lock-status').innerHTML = 'Locked';
	} else if (wallet.Unlocked) {
		eID('lock-status').innerHTML = 'Unlocked';
	}

	// Start updating
	update();
});
IPC.on('encrypted', function(err, result) {
	if (!assertSuccess('encrypted', err)) {
		return;
	}
	var popup = eID('show-password');
	show(popup);
	
	popup.querySelector('.password').innerText = result.PrimarySeed;
});

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}
IPC.on('locked', function(err, result) {
	if (!assertSuccess('locked', err)) {
		return;
	}

	notify('Wallet locked', 'locked');
	eID('lock-status').innerHTML = 'Locked';
});
