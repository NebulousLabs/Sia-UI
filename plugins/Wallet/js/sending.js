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
		tooltip('Enter numeric value to send!', caller);
		return;
	} 
	// Verify balance
	var total = new BigNumber(value).times(unit);
	// TODO: Sending siafunds is momentous. Should make the whole wallet have a
	// 'Siafund' mode. Add this option to the wallet settings page
	// TODO: Add a wallet settings page
	var bal = unit === '1' ? new BigNumber(wallet.siafundbalance) : new BigNumber(wallet.confirmedsiacoinbalance);
	if (bal.lt(total)) {
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
function sendTransaction(amount, address) {
	var url = unit !== '1' ? '/wallet/siacoins' : '/wallet/siafunds';
	var transaction = {
		amount: amount.toString(),
		destination: address,
	};
	Siad.apiCall({
		url: url,
		method: 'POST',
		qs: transaction,
	}, function(result) {
		notify('Transaction sent to network!', 'sent');
		$('#transaction-value').val('0');
	
		// Reflect it asap
		setTimeout(update, 100);
	});
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
	validateTransaction(this, function(total, address) {
		tooltip('Sending...', $('#confirm').get(0));
		sendTransaction(total, address);
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
	var amountJQ = $('#amount');
	var remainingJQ = $('#remaining');
	if (changedElement !== amountJQ.get(0)) {
		var r = remainingJQ.val() || '0';
		amountJQ.val(total.minus(r));
	}
	if (changedElement !== remainingJQ.get(0)) {
		var a = amountJQ.val() || '0';
		remainingJQ.val(total.minus(a));
	}

	// Check for negative numbers
	if (amountJQ.val() < 0) {
		amountJQ.val(0);
		remainingJQ.val(total);
	}
	if (remainingJQ.val() < 0) {
		remainingJQ.val(0);
		amountJQ.val(total);
	}
}

$('#make-transaction').find('input').change(calculateFields);

// Make sure all fields are the same unit
$('#make-transaction').find('select').change(function() {
	var unitJQs = $('#make-transaction').find('select');
	unit = this.value;
	unitJQs.val(unit);
	if (unit === '1') {
		unitJQs.addClass('siafund');
	} else {
		unitJQs.removeClass('siafund');
	}
	calculateFields();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Navigation  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Show the transaction making frame
$('#create-transaction').click(function() {
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

