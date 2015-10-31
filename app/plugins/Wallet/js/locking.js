'use strict';

// Helper function for the lock-icon to make sure its classes are cleared
function clearLockIcon() {
	eID('lock-icon').className = 'fa';
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Locking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Markup changes to reflect locked state
function setLocked() {
	clearLockIcon();
	eID('lock-status').innerHTML = 'Unlock Wallet';
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

function checkForPassword() {
	IPC.sendToHost('api-call', '/wallet', 'lock-check');
}
addResultListener('lock-check', function(result) {
	if (!result.unlocked) {
		IPC.sendToHost('config', {key: 'wallet-password'}, 'password');
	}
});
IPC.on('password', function(pw) {
	if (pw) {
		unlock(pw);
	}
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Unlocking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Markup changes to reflect unlocked state
function setUnlocked() {
	clearLockIcon();
	eID('lock-status').innerHTML = 'Lock Wallet';
	eID('lock-icon').classList.add('fa-unlock');
}

// Markup changes to reflect unlocked state
function setUnlocking() {
	clearLockIcon();
	eID('lock-status').innerHTML = 'Unlocking';
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Encrypting ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// setUnencrypted sets the wallet lock status to unencrypted.
function setUnencrypted() {
	clearLockIcon();
	eID('lock-status').innerHTML = 'Create Wallet';
	eID('lock-icon').classList.add('fa-plus');
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Load ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function loadLegacyWallet(filename, password) {
	IPC.sendToHost('api-call', {
		url: '/wallet/load/033x',
		type: 'POST',
		args: {
			filepath: filename,
			encryptionpassword: password,
		},
	}, 'load-wallet');
}
addResultListener('load-wallet', function(result) {
	notify('Loaded Wallet', 'success');
});
