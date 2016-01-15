'use strict';

// Popup creating functions
const popups = require('./js/popups');
// Popup creating functions
const loaders = require('./js/loaders');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Capsule ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make sure the user read the password
$('#confirm-password').click(function() {
	// Save password if checked
	var pw = $('#generated-password').text();
	if ($(this).siblings('.save-password').get(0).checked) {
		popups.savePassword(pw);
	}

	// Hide popup and start the plugin
	unlock(pw);
	$('#generated-password').text('');
	$('#show-password').hide();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Load Buttons ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Show and hide dropdown
$('#status').click(function() {
	$('.dropdown').toggle('fast');
});
$(document).click(function(e) {
	var el = $(e.target);
	var dropdownClicked = el.closest('.dropdown').length;
	var statusClicked = el.closest('#status').length;
	if (!dropdownClicked && !statusClicked) {
		$('.dropdown').hide('fast');
		$('.dropdown li').show('fast');
		$('#paste-seed').hide('fast');
		$('#paste-seed input').val('');
	}
});

// Load siagkey, seed, or legacy wallet from 0.33 fork
$('.dropdown .button').click(function(e) {
	var el = $(e.target);
	var choice = el.closest('.button').text().trim();
	switch (choice) {
		case 'Load Siag Key':
			// TODO:
			loaders.siagKey();
			break;
		case 'Paste Seed':
			$('.dropdown li').hide('fast');
			$('#paste-seed').show('fast');
			$('#paste-seed input').focus();
			return; // Don't close dropdown
		case 'Load Seed':
			let seed = $('#paste-seed input').val();
			$('.dropdown li').show('fast');
			$('#paste-seed').hide('fast');
			$('#paste-seed input').val('');
			loaders.seed(seed);
			break;
		case 'Load Legacy Wallet':
			loaders.legacyWallet();
			break;
		default:
			// Assumed to be a lock action
			break;
	}
	$('.dropdown').hide('fast');
});

// Lock or unlock the wallet
$('#lock').click(function() {
	var state = $('#status span').html();
	if (!wallet.unlocked && state === 'No Wallet') {
		encrypt();
	} else if (wallet.unlocked && state === 'Unlocked') {
		lock();
	} else if (!wallet.unlocked && state === 'Locked') {
		popups.getPassword(unlock);
	} else {
		console.error('Lock status disagrees with wallet variable!', wallet.unlocked, state);
	}
});
