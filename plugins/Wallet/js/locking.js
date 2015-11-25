'use strict';

// Keeps track of wallet status results
var wallet = {};

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
	console.log(password);
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
IPC.on('unlocked', function(event, err, result) {
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
	IPC.sendToHost('api-call', {
		url: '/wallet/init',
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

