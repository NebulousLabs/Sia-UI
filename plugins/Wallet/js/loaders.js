'use strict';

// Module to manage password saving and retrieval
const popups = require('./popups');

// ~~~~~~~~~~~~~~~~~~~~~~~~~ Load Functions/Prompts ~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Load a siag key
function siagKey(pw, keyfiles) {
	Siad.apiCall({
		url: '/wallet/siagkey',
		method: 'POST',
		qs: {
			encryptionpassword: pw,
			keyfiles: keyfiles,
		},
	}, function(result) {
		notify('Loaded Siag Key!', 'success');
	});
}

// Get data from user input to load a siag key
function siagKeyPrompt() {
	var loadPath = IPCRenderer.sendSync('dialog', 'open', {
		title: 'Siag Key Files',
		filters: [
			{ name: 'Siag key', extensions: ['siakey'] }
		],
		properties: ['openFile', 'multiSelections'],
	});
	if (loadPath && loadPath.length > 0) {
		popups.getPassword(function(pw) {
			siagKey(pw, loadPath.join(','));
		});
	}
}

// Load legacy wallet from 0.33 fork
function loadSeed(pw, seed) {
	Siad.apiCall({
		url: '/wallet/seed',
		method: 'POST',
		qs: {
			encryptionpassword: pw,
			dictionary: 'english',
			seed: seed,
		},
	}, function(result) {
		notify('Loaded Seed', 'success');
	});
}

// Get data from user input to load a seed
function seedPrompt(seed) {
	// Password not stored, ask for it along with seed
	popups.getPassword(function(pw) {
		loadSeed(pw, seed);
	});
}

// Load legacy wallet from 0.33 fork
function loadLegacyWallet(pw, source) {
	Siad.apiCall({
		url: '/wallet/033x',
		method: 'POST',
		qs: {
			source: source,
			encryptionpassword: pw,
		},
	}, function(result) {
		notify('Loaded Wallet!', 'success');
	});
}

// Get data from user input to load a legacy wallet
function legacyWalletPrompt() {
	var loadPath = IPCRenderer.sendSync('dialog', 'open', {
		title: 'Legacy Wallet File Path',
		filters: [
			{ name: 'Legacy wallet', extensions: ['dat'] }
		],
		properties: ['openFile'],
	});
	if (loadPath && loadPath.length > 0) {
		popups.getPassword(function(pw) {
			loadLegacyWallet(pw, loadPath[0]);
		});
	}
}

module.exports = {
	siagKey: siagKeyPrompt,
	seed: seedPrompt,
	legacyWallet: legacyWalletPrompt,
};
