'use strict';

// Popup creating functions
const popups = require('./js/popups');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Capsule ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Get and use password from the UI's config.json
function getPassword() {
	var settings = IPCRenderer.sendSync('config', 'wallet');
	if (settings && settings.password) {
		callback(settings.password);
	} else {
		popups.password(callback);
	}
}

// Lock or unlock the wallet
$('#lock-pod').click(function() {
	var state = $('#lock-pod span').html();
	if (!wallet.unlocked && state === 'Create Wallet') {
		encrypt();
	} else if (wallet.unlocked && state === 'Lock Wallet') {
		lock();
	} else if (!wallet.unlocked && state === 'Unlock Wallet') {
		getPassword(unlock);
	} else {
		console.error('lock-pod disagrees with wallet variable!', wallet.unlocked, state);
	}
});

// Save password to the UI's config.json
function savePassword(pw) {
	var settings = IPCRenderer.sendSync('config', 'wallet') || {};
	settings.password = pw;
	IPCRenderer.sendSync('config', 'wallet', settings);
}

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Load ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Load legacy wallet from 0.33 fork
function loadLegacyWallet(source, password) {
	Siad.apiCall({
		url: '/wallet/033x',
		method: 'POST',
		qs: {
			source: source,
			encryptionpassword: password,
		},
	}, function(result) {
		notify('Loaded Wallet!', 'success');
	});
}

// Get data from user input to load a legacy wallet
function loadLegacyWalletPrompts() {
	var loadPath = IPCRenderer.sendSync('dialog', 'open', {
		title: 'Legacy Wallet File Path',
		filters: [
			{ name: 'Legacy wallet', extensions: ['dat'] }
		],
		properties: ['openFile'],
	});
	if (loadPath) {
		getPassword(function(pw) {
			loadLegacyWallet(loadPath[0], pw);
		});
	}
}

// Load legacy wallet from 0.33 fork
function loadSeed(password, seed) {
	Siad.apiCall({
		url: '/wallet/seed',
		method: 'POST',
		qs: {
			encryptionpassword: password,
			dictionary: 'english',
			seed: seed,
		},
	}, function(result) {
		notify('Loaded Seed', 'success');
	});
}

// Get data from user input to load a seed
function loadSeedPrompt() {
	var pw = IPCRenderer.sendSync('config', 'walletPassword');
	// Password stored, don't need to ask for it
	if (pw) {
		popups.seed(function(seed) {
			loadSeed(pw, seed);
		});
	} else {
		// Password not stored, ask for it along with seed
		popups.passwordSeed(function(password, seed) {
			loadSeed(password, seed);
		});
	}
}

// Load siagkey, seed, or legacy wallet from 0.33 fork
$('#load').click(function() {
	var choice = IPCRenderer.sendSync('dialog', 'message', {
		type: 'question',
		title: 'Load Into Wallet',
		message: 'Load previous wallet keys, seeds, or backups',
		detail: `If you haven't had a previous wallet or involvement with Sia,
			this probably isn't for you`,
		buttons: ['Siagkey', 'Seed', 'Legacy Wallet', 'Cancel'],
	});
	switch (choice) {
		case 0:
			return;
		case 1:
			loadSeedPrompt();
			break;
		case 2:
			loadLegacyWalletPrompts();
			break;
		case 3:
			//TODO:
			return;
		default:
	}
});

