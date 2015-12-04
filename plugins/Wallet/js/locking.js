'use strict';

// Keeps track of wallet status results
var wallet = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Lock Icon  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helper function for the lock-icon to make sure its classes are cleared
function setLockIcon(lockStatus, iconClass) {
	$('#lock-status').html(lockStatus);
	$('#lock-icon').get(0).className = 'fa ' + iconClass;
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

// Update wallet summary in header
addResultListener('update-status', function(result) {
	wallet = result;

	// Show correct lock status.
	if (!wallet.encrypted) {
		setUnencrypted();
	} else if (!wallet.unlocked) {
		setLocked();
	} else if (wallet.unlocked) {
		setUnlocked();
	}

	// Update balance confirmed and uncomfirmed
	var bal = convertSiacoin(wallet.confirmedsiacoinbalance);
	var pend = convertSiacoin(wallet.unconfirmedincomingsiacoins).sub(convertSiacoin(wallet.unconfirmedoutgoingsiacoins));
	if (wallet.unlocked && wallet.encrypted) {
		$('#confirmed').show();
		$('#unconfirmed').show();
		$('#confirmed').html('Balance: ' + bal + ' S');
		$('#unconfirmed').html('Pending: ' + pend + ' S');
	} else {
		$('#confirmed').hide();
		$('#unconfirmed').hide();
	}
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Locking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Lock the wallet
function lock() {
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/lock',
		method: 'POST',
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
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/unlock',
		method: 'POST',
		qs: {
			encryptionpassword : password,
		},
	}, 'unlocked');

	// Password attempted, show responsive processing icon
	setUnlocking();
}
IPCRenderer.on('unlocked', function(event, err, result) {
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Encrypting ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Encrypt the wallet (only applies to first time opening)
function encrypt() {
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/init',
		method: 'POST',
		qs: {
			dictionary: 'english',
		},
	}, 'encrypted');
	setLocked();
}
addResultListener('encrypted', function(result) {
	var popup = $('#show-password');
	popup.show();

	// Clear old password in config if there is one
	IPCRenderer.sendToHost('config', {
		key: 'walletPassword',
		value: '',
	});

	// Show password in the popup
	$('#generated-password').text(result.primaryseed);

	update();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Load ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function loadLegacyWallet(filename, password) {
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/load/033x',
		method: 'POST',
		qs: {
			filepath: filename,
			encryptionpassword: password,
		},
	}, 'load-wallet');
}
addResultListener('load-wallet', function(result) {
	notify('Loaded Wallet', 'success');
});
