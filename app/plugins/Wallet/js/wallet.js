'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Variable to store api result values
var wallet = {};
// Keeps track of if the view is shown
var updating;

// DOM shortcut
function eID() {
	return document.getElementById.apply(document, [].slice.call(arguments));
}

// Convert to Siacoin
function formatSiacoin(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display + ' S';
}

// Amount has to be a number
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Ask UI to show tooltip bubble
function tooltip(message, element) {
	var rect = element.getBoundingClientRect();
	IPC.sendToHost('tooltip', message, {
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right,
		height: rect.height,
		width: rect.width,
		length: rect.length,
	});
}

// Make API calls, sending a channel name to listen for responses
function update() {
	IPC.sendToHost('api-call', '/wallet/status', 'balance-update');
	updating = setTimeout(update, 15000);
}

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API regularly to update page
	updating = setTimeout(update, 0);
}

// Called upon transitioning away from this view
function stop() {
	clearTimeout(updating);
}

// Transaction has to be legitimate
// TODO: verify address
function verifyTransaction(callback) {
	var amount = eID('transaction-amount').value;
	var e = eID('send-unit');
	var unit = e.options[e.selectedIndex].value;

	var address = eID('transaction-address').value;

	if (!isNumber(amount)) {
		tooltip('Enter numeric amount of Siacoin to send', eID('send-money'));
	} else if (wallet.Balance < amount) {
		tooltip('Balance too low!', eID('send-money'));
	} else if (callback) {
		var total = new BigNumber(amount).times(unit).round();
		callback(total, address);
	}
}

// Send the specified transaction
function sendCoin(amount, address) {
	var transaction = {
		amount: amount.toString(),
		destination: address,
	};
	var call = {
		url: '/wallet/send',
		type: 'POST',
		args: transaction,
	};
	IPC.sendToHost('api-call', call, 'coin-sent');
}

// Give the buttons interactivity
eID('create-address').onclick = function() {
	tooltip('Creating...', this);
	IPC.sendToHost('api-call', '/wallet/address', 'new-address');
};
eID('send-money').onclick = function() {
	verifyTransaction(function() {
		eID('confirm').classList.remove('hidden');
	});
};
eID('confirm').onclick = function() {
	tooltip('Sending...', this);
	verifyTransaction(function(amount, address) {
		sendCoin(amount, address);
	});
};

function appendAddress(address) {
	if (eID(address)) {
		return;
	}
	var entry = eID('addressbp').cloneNode(true);
	entry.id = address;
	entry.querySelector('.address').innerHTML = address;
	entry.classList.remove('blueprint');
	eID('address-list').appendChild(entry);
}

// Define IPC listeners
IPC.on('balance-update', function(err, result) {
	if (err) {
		console.error(err);
		return;
	}

	// Populate addresses
	wallet = result;
	for (var i = 0; i < wallet.VisibleAddresses.length; i++) {
		appendAddress(wallet.VisibleAddresses[i]);
	}
	
	// Update balance
	eID('balance').innerHTML = 'Balance: ' + formatSiacoin(wallet.Balance);
});
IPC.on('coin-sent', function(err, result) {
	if (err) {
		console.error(err);
		IPC.sendToHost('notify', 'Transaction errored!', 'error');
		return;
	} else if (!result.Success) {
		IPC.sendToHost('notify', 'Transaction failed!', 'error');
		return;
	}
	IPC.sendToHost('notify',  'Transaction sent!', 'sent');
	eID('transaction-amount').value = '';
	eID('confirm').classList.add('hidden');
});
IPC.on('new-address', function(err, result) {
	if (err) {
		console.error(err);
		return;
	}
	IPC.sendToHost('notify', 'Address created!', 'success');
	appendAddress(result.Address);
});

