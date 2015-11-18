'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Lock Icon  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helper function for the lock-icon to make sure its classes are cleared
function setLockIcon(lockStatus, iconClass) {
	$('#lock-status').html(lockStatus);
	$('#lock-icon').className = 'fa ' + iconClass;
}

// Markup changes to reflect locked state
function setLocked() {
	setLockIcon('Unlock Wallet', 'fa-lock');
}

// Markup changes to reflect unlocked state
function setUnlocked() {
	setLockIcon('Lock Wallet', 'fa-unlock');
}

// Markup changes to reflect unlocked state
function setUnlocking() {
	setLockIcon('Unlocking', 'fa-cog fa-spin');
}

// setUnencrypted sets the wallet lock status to unencrypted.
function setUnencrypted() {
	setLockIcon('Create Wallet', 'fa-plus');
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Locking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Lock the wallet
function lock() {
	IPC.sendToHost('api-call', {
		url: '/wallet/lock',
		type: 'POST',
	}, 'locked');
}
addResultListener('locked', function(result) {
	setLocked();
	notify('Wallet locked', 'locked');	

	update();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Unlocking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
	setUnlocking();
}
IPC.on('unlocked', function(err, result) {
	// Remove unlocking icon
	if (err) {
		setLocked();
		notify('Wrong password', 'error');
		$('#request-password').show();
	} else {
		setUnlocked();
		notify('Wallet unlocked', 'unlocked');
	}

	update();
});

// Get and use password from the UI's config.json
function getPassword() {
	IPC.sendToHost('config', {key: 'walletPassword'}, 'use-password');
}
IPC.on('use-password', function(pw) {
	if (pw) {
		unlock(pw);
	} else {
		$('#request-password').show();
		$('#password-field').focus();
	}
});

// Save password to the UI's config.json
function savePassword(pw) {
	IPC.sendToHost('config', {
		key: 'walletPassword',
		value: pw,
	});
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Encrypting ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
	var popup = $('#show-password');
	popup.show();

	// Clear old password in config if there is one
	IPC.sendToHost('config', {
		key: 'walletPassword',
		value: '',
	});

	// Show password in the popup
	$('#generated-password').text(result.primaryseed);

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
