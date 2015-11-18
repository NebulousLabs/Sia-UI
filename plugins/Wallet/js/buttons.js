'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Address Handling  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Address creation
$('#create-address').click(function() {
	tooltip('Creating...', this);
	var call = {
		url: '/wallet/address',
		type: 'GET',
	};
	IPC.sendToHost('api-call', call, 'new-address');
});

// Button to display all wallet addresses
$('#view-all-addresses').click(function() {
	$('#address-list').children().show();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Transactions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define send call
function sendCoin(amount, address) {
	var transaction = {
		amount: amount.toString(),
		destination: address,
	};
	IPC.sendToHost('api-call', {
		url: '/wallet/siacoins',
		type: 'POST',
		args: transaction,
	}, 'coin-sent');

	// Reflect it asap
	setTimeout(update, 100);
}

// Transaction has to be legitimate
function validateTransaction(caller, callback) {
	var amount = $('#transaction-amount').val();
	var unit = $('#send-unit').val();
	var total = new BigNumber(amount).times(unit);
	var address = $('#transaction-address').val();

	// Verify number
	if (!isNumber(amount)) {
		tooltip('Enter numeric amount of Siacoin to send!', caller);
		return;
	} 
	// Verify balance
	if (wallet.confirmedsiacoinbalance < total) {
		tooltip('Balance too low!', caller);
		return;
	} 
	// Verify address
	if (!isAddress(address)) {
		tooltip('Enter correct address to send to!', caller);
		return;
	}

	callback(total, address);
}

// Button to send coin
$('#send-money').click(function() {
	validateTransaction(this, function() {
		tooltip('Are you sure?', $('#confirm').get(0));
		$('#confirm').removeClass('transparent');
	});
});

// Button to confirm transaction
$('#confirm').click(function() {
	// If the button's transparent, don't do anything
	if ($('#confirm').hasClass('transparent')) {
		return;
	}
	validateTransaction(this, function(amount, address) {
		tooltip('Sending...', $('#confirm').get(0));
		sendCoin(amount, address);
	});
	$('#confirm').addClass('transparent');
});

// Transaction was sent
addResultListener('coin-sent', function(result) {
	notify('Transaction sent to network!', 'sent');
	$('#transaction-amount').val('');
});

// Button to load all wallet transactions
$('#view-all-transactions').click(function() {
	tooltip('Loading all transactions', this);
	IPC.sendToHost('api-call', {
		url: '/wallet/transactions',
		args: {
			startheight: 0,
			endheight: 1000000,
		},		
		type: 'GET',
	}, 'update-history');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Capsule ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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

$('.close').click(function() {
	$(this).closest('.popup').hide();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Load ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
$('#load-legacy-wallet').click(function() {
	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Legacy Wallet File Path',
		filters: [
			{ name: 'Legacy wallet', extensions: ['dat'] }
		],
		properties: ['openFile'],
	});
	if (loadPath) {
		// kind of a hack; we want to reuse the enter-password dialog, but in
		// order to do so we must temporarily overwrite its onclick method.
		var oldOnclick = $('#enter-password').onclick;
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
