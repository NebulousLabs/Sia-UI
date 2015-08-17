'use strict';

// Markup changes to reflect locked state
function locked() {
	eID('lock-status').innerHTML = 'Locked';
	eID('lock-icon').classList.remove('fa-unlock');
	eID('lock-icon').classList.add('fa-lock');
	update();
}
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
			EncryptionPassword : password,
		},
	}, 'unlocked');
}
IPC.on('unlocked', function(err, result) {
	if (err) {
		notify('Wrong password', 'error');
	} else {
		unlocked();
		notify('Wallet unlocked', 'unlocked');
	}
	hide('request-password');
});

// Lock the wallet
function lock() {
	IPC.sendToHost('api-call', {
		url: '/wallet/lock',
		type: 'POST',
	}, 'locked');
}
IPC.on('locked', function(err, result) {
	if (!assertSuccess('locked', err)) {
		return;
	}

	notify('Wallet locked', 'locked');
	locked();
});

// Encrypt the wallet (only applies to first time opening)
function encrypt() {
	IPC.sendToHost('api-call', {
		url: '/wallet/encrypt',
		type: 'POST',
		args: {
			EncryptionPassword: '',
			Dictionary: 'english',
		},
	}, 'encrypted')
}
IPC.on('encrypted', function(err, result) {
	if (!assertSuccess('encrypted', err)) {
		return;
	}
	var popup = eID('show-password');
	show(popup);
	
	popup.querySelector('.password').innerHTML = result.PrimarySeed;
});

// Lock or unlock the wallet
eID('lock-pod').onclick = function() {
	var state = eID('lock-status').innerHTML;
	if (wallet.Unlocked && state == 'Unlocked') {
		lock();
	} else if (!wallet.Unlocked && state == 'Locked'){
		show('request-password');
	} else {
		console.error('lock-pod disagrees with wallet variable!', wallet.Unlocked, state)
	}
}
// On popup upon entering an encrypted, locked wallet, enter password
eID('enter-password').onclick = function() {
	// Record password
	var field = eID('password-field');

	// Hide popup and start the plugin
	unlock(field.value);
};
// Make sure the user read the password
eID('confirm-password').onclick = function() {
	hide('show-password');
	update();
}

