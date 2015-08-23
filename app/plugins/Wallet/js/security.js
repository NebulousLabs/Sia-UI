'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Unlocking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Markup changes to reflect unlocked state
function setUnlocked() {
	eID('lock-status').innerHTML = 'Unlocked';
	eID('lock-icon').classList.remove('fa-cog');
	eID('lock-icon').classList.remove('fa-spin');
	eID('lock-icon').classList.add('fa-unlock');
}

// Markup changes to reflect unlocked state
function setUnlocking() {
	eID('lock-status').innerHTML = 'Unlocking';
	eID('lock-icon').classList.remove('fa-lock');
	eID('lock-icon').classList.remove('fa-times');
	eID('lock-icon').classList.add('fa-cog');
	eID('lock-icon').classList.add('fa-spin');
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
	// Password attempted, show responsive processing icon
	hide('request-password');
	setUnlocking();
}

// React to the api call result
IPC.on('unlocked', function(err, result) {
	// Remove processing icon
	if (err) {
		setLocked();
		notify('Wrong password', 'error');
	} else {
		setUnlocked();
		notify('Wallet unlocked', 'unlocked');
	}

	update();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Locking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Markup changes to reflect locked state
function setLocked() {
	eID('lock-status').innerHTML = 'Locked';
	eID('lock-icon').classList.remove('fa-unlock');
	eID('lock-icon').classList.remove('fa-times');
	eID('lock-icon').classList.add('fa-lock');
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
	setLocked();
	notify('Wallet locked', 'locked');
	
	update();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Encrypting ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// setUnencrypted sets the wallet lock status to encrypted.
function setUnencrypted() {
	eID('lock-status').innerHTML = 'Unencrypted';
	eID('lock-icon').classList.remove('fa-lock');
	eID('lock-icon').classList.remove('fa-unlock');
	eID('lock-icon').classList.add('fa-times');
}

// Encrypt the wallet (only applies to first time opening)
function encrypt() {
	IPC.sendToHost('api-call', {
		url: '/wallet/encrypt',
		type: 'POST',
		args: {
			dictionary: 'english',
		},
	}, 'encrypted');
	setLocked();
}
addResultListener('encrypted', function(result) {
	var popup = eID('show-password');
	show(popup);

	popup.querySelector('.password').innerHTML = result.primaryseed;

	update();
});

