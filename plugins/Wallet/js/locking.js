'use strict';

// Keeps track of wallet status results
var wallet = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Lock Icon  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Helper function for the lock-icon to make sure its classes are cleared
function setLockIcon(lockStatus, lockAction, iconClass) {
	$('#status span').text(lockStatus);
	$('#lock.button span').text(lockAction);
	$('#lock.button .fa').get(0).className = 'fa ' + iconClass;
}

// Markup changes to reflect state
function setLocked() {
	setLockIcon('Locked', 'Unlock Wallet', 'fa-lock');
}
function setUnlocked() {
	setLockIcon('Unlocked', 'Lock Wallet', 'fa-unlock');
}
function setUnlocking() {
	setLockIcon('Unlocking', 'Unlocking', 'fa-cog fa-spin');
}
function setUnencrypted() {
	setLockIcon('New Wallet', 'Create Wallet', 'fa-plus');
}

// Update wallet summary in header capsule
function updateStatus(result) {
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
		// TODO: Janky fix for graphical difficulty where a 2px border line appears when 1px is expected
		$('#status.pod').css('border-left', '1px solid #00CBA0');
		$('#confirmed').show();
		$('#unconfirmed').show();
		$('#confirmed').html('Balance: ' + bal + ' S');
		$('#unconfirmed').html('Pending: ' + pend + ' S');
	} else {
		// TODO: Janky fix for graphical difficulty where a 2px border line appears when 1px is expected
		$('#status.pod').css('border-left', 'none');
		$('#confirmed').hide();
		$('#unconfirmed').hide();
	}
}

// Make wallet api call
function getStatus() {
	Siad.apiCall('/wallet', updateStatus);
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Locking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Lock the wallet
function lock() {
	Siad.apiCall({
		url: '/wallet/lock',
		method: 'POST',
	}, function(result) {
		notify('Wallet locked', 'locked');	
		update();
	});
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Unlocking ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Unlock the wallet
function unlock(password) {
	// Password attempted, show responsive processing icon
	setUnlocking();
	Siad.call({
		url: '/wallet/unlock',
		method: 'POST',
		qs: {
			encryptionpassword : password,
		},
	}, function(err, result) {
		if (err) {
			notify('Wrong password', 'error');
			$('#request-password').show();
		} else {
			notify('Wallet unlocked', 'unlocked');
		}
		update();
	});
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Encrypting ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Encrypt the wallet (only applies to first time opening)
function encrypt() {
	Siad.apiCall({
		url: '/wallet/init',
		method: 'POST',
		qs: {
			dictionary: 'english',
		},
	}, function(result) {
		setLocked();
		var popup = $('#show-password');
		popup.show();
	
		// Clear old password in config if there is one
		var settings = IPCRenderer.sendSync('config', 'wallet');
		if (settings) {
			settings.password = null;
		} else {
			settings = {password: null};
		}
		IPCRenderer.sendSync('config', 'wallet', settings);
	
		// Show password in the popup
		$('#generated-password').text(result.primaryseed);
		update();
	});
}
