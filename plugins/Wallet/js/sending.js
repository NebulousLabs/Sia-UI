'use strict';

// By default, transactions assume Siacoin as the unit
var unit = '1e24';

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
	var address = $('#transaction-address').val();

	// Verify number
	if (!isNumber(value)) {
		tooltip('Enter numeric value of Siacoin to send!', caller);
		return;
	} 
	var total = new BigNumber(value).times(unit);
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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Responsive Fields  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Calculate input fields based on changed field
function calculateFields(event) {
	// Update total with correct unit
	var bal;
	if (unit !== '1') {
		bal = wallet.confirmedsiacoinbalance;
	} else {
		bal = wallet.siafundbalance;
	}
	var total = new BigNumber(bal).dividedBy(unit);
	$('#total').val(total);

	// Update other two fields
	var changedElement = event ? event.target : null;
	var amount = $('#amount');
	var remaining = $('#remaining');
	if (changedElement !== amount.get(0)) {
		var r = remaining.val() || '0';
		amount.val(total.minus(r));
	}
	if (changedElement !== remaining.get(0)) {
		var a = amount.val() || '0';
		remaining.val(total.minus(a));
	}

	// Check for negative numbers
	if (amount.val() < 0) {
		amount.val(0);
		remaining.val(total);
	}
	if (remaining.val() < 0) {
		remaining.val(0);
		amount.val(total);
	}
}

$('#make-transaction').find('input').change(calculateFields);

// Make sure all fields are the same unit
$('#make-transaction').find('select').change(function() {
	var units = $('#make-transaction').find('select');
	unit = this.value;
	units.val(unit);
	if (unit === '1') {
		units.addClass('siafund');
	} else {
		units.removeClass('siafund');
	}
	calculateFields();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Navigation  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Show the transaction making frame
$('#new-transaction').click(function() {
	if (!wallet.unlocked) {
		tooltip('Can\'t make a transaction while the wallet is locked!', this);
		return;
	}
	$(this).closest('.frame').hide();
	$('#make-transaction').show();
	calculateFields();
});

// Hide the transaction making frame
$('.back').click(function() {
	$(this).closest('.frame').hide();
	$('#wallet').show();
});

