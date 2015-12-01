'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sending  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define send call
function sendCoin(amount, address) {
	var transaction = {
		amount: amount.toString(),
		destination: address,
	};
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/siacoins',
		type: 'POST',
		args: transaction,
	}, 'coin-sent');

	// Reflect it asap
	setTimeout(update, 100);
}

// Transaction was sent
addResultListener('coin-sent', function(result) {
	notify('Transaction sent to network!', 'sent');
	$('#transaction-value').val('');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Validation  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Amount has to be a number
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Address has to be lowercase hex and 76 chars
function isAddress(str) {
	return str.match(/^[a-f0-9]{76}$/) !== null;
}

// Transaction has to be legitimate
function validateTransaction(caller, callback) {
	var value = $('#transaction-value').val() || 0;
	var unit = $('#send-unit').val();
	var total = new BigNumber(value).times(unit);
	var address = $('#transaction-address').val();

	// Verify number
	if (!isNumber(value)) {
		tooltip('Enter numeric value of Siacoin to send!', caller);
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Buttons  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Show the transaction making frame
$('#new-transaction').click(function() {
	//if (!wallet.unlocked) {
	//	tooltip('Can\'t make a transaction while the wallet is locked!', this);
	//	return;
	//}
	$(this).closest('.frame').hide();
	$('#make-transaction').show();
});

// Hide the transaction making frame
$('.back').click(function() {
	$(this).closest('.frame').hide();
	$('#wallet').show();
});

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
	validateTransaction(this, function(value, address) {
		tooltip('Sending...', $('#confirm').get(0));
		sendCoin(value, address);
	});
	$('#confirm').addClass('transparent');
});

// Calculate input fields based on changed one
//function ()
