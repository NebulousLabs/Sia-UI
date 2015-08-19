'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Unlocking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Markup changes to reflect unlocked state
function unlocked() {
	eID('lock-status').innerHTML = 'Unlocked';
	eID('lock-icon').classList.remove('fa-lock');
	eID('lock-icon').classList.add('fa-unlock');
	update();
}

// Unlock the wallet
function unlock(password) {
	IPC.sendToHost('api-call', {
		url: '/wallet/unlock',
		type: 'POST',
		args: {
			encryptionpassword : password,
		},
	}, 'unlocked');
}

// React to the api call result
IPC.on('unlocked', function(err, result) {
	if (err) {
		notify('Wrong password', 'error');
	} else {
		unlocked();
		notify('Wallet unlocked', 'unlocked');
	}
	hide('request-password');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Locking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Markup changes to reflect locked state
function locked() {
	eID('lock-status').innerHTML = 'Locked';
	eID('lock-icon').classList.remove('fa-unlock');
	eID('lock-icon').classList.add('fa-lock');
	update();
}

// Lock the wallet
function lock() {
	IPC.sendToHost('api-call', {
		url: '/wallet/lock',
		type: 'POST',
	}, 'locked');
}

// React to the api call result
addResultListener('locked', function(result) {
	notify('Wallet locked', 'locked');
	locked();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Encrypting ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Encrypt the wallet (only applies to first time opening)
// TODO: Add copy to clipboard button
function encrypt() {
	IPC.sendToHost('api-call', {
		url: '/wallet/encrypt',
		type: 'POST',
		args: {
			dictionary: 'english',
		},
	}, 'encrypted');
}
addResultListener('encrypted', function(result) {
	var popup = eID('show-password');
	show(popup);
	
	popup.querySelector('.password').innerHTML = result.primaryseed;
});

