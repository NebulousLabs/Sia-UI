'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Capsule ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get and use password from the UI's config.json
function getPassword() {
	var pw = IPCRenderer.sendSync('config', 'walletPassword');
	if (pw) {
		unlock(pw);
	} else {
		$('#request-password').show();
		$('#password-field').focus();
	}
}

// Lock or unlock the wallet
$('#lock-pod').click(function() {
	var state = $('#lock-status').html();
	if (!wallet.unlocked && state === 'Create Wallet') {
		encrypt();
	} else if (wallet.unlocked && state === 'Lock Wallet') {
		lock();
	} else if (!wallet.unlocked && state === 'Unlock Wallet'){
		getPassword();
	} else {
		console.error('lock-pod disagrees with wallet variable!', wallet.unlocked, state);
	}
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Popups ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Save password to the UI's config.json
function savePassword(pw) {
	IPCRenderer.sendSync('config', 'walletPassword', pw);
}

// On popup upon entering an encrypted, locked wallet, enter password
$('#enter-password').click(function() {
	// Save password if checked
	var pw = $('#password-field').val();
	if ($(this).siblings('.save-password').get(0).checked) {
		savePassword(pw);
	}

	// Hide popup and start the plugin
	unlock(pw);
	$('#password-field').val('');
	$('#request-password').hide();
});

// Make sure the user read the password
$('#confirm-password').click(function() {
	// Save password if checked
	var pw = $('#generated-password').text();
	if ($(this).siblings('.save-password').get(0).checked) {
		savePassword(pw);
	}

	// Hide popup and start the plugin
	unlock(pw);
	$('#generated-password').text('');
	$('#show-password').hide();
});

// An 'Enter' keypress in the input field will submit it.
$('#password-field').keydown(function(e) {
	e = e || window.event;
	if (e.keyCode === 13) {
		$('#enter-password').click();
	}
});

// If the user wants to save the password in either popup, they
// should be warned of the security risks
$('.save-password').click(function() {
	if (this.checked) {
		$(this).siblings('.warning').show();
	} else {
		$(this).siblings('.warning').hide();
	}
});

// Exit popup
$('.close').click(function() {
	$(this).closest('.popup').hide();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Load ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Load legacy wallet from 0.33 fork
// TODO: Reimplement this currently unused code in a pretty fashion
// TODO: Enable loading from siagkey and seed as well
function loadLegacyWallet(filename, password) {
	Siad.apiCall({
		url: '/wallet/033x',
		method: 'POST',
		qs: {
			filepath: filename,
			encryptionpassword: password,
		},
	}, function(result) {
		notify('Loaded Wallet', 'success');
	});
}

// Load legacy wallet from 0.33 fork
$('#load-legacy-wallet').click(function() {
	var loadPath = IPCRenderer.sendSync('dialog', 'open', {
		title: 'Legacy Wallet File Path',
		filters: [
			{ name: 'Legacy wallet', extensions: ['dat'] }
		],
		properties: ['openFile'],
	});
	if (loadPath) {
		// kind of a hack; we want to reuse the enter-password dialog, but in
		// order to do so we must temporarily overwrite its onclick method.
		var oldOnclick = $('#enter-password').get(0).onclick;
		$('#enter-password').click(function() {
			var field = $('#password-field');
			loadLegacyWallet(loadPath[0], field.val());
			field.val('');
			$('#enter-password').click(oldOnclick);
			$('#request-password').hide();
		});
		$('#request-password').show();
	}
});

