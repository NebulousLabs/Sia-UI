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
// Encryption password, for now treated as the primary seed
var password;
var remainingAddresses;
var currentHeight;
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
	IPC.sendToHost('api-call', '/wallet', 'update-status');
	IPC.sendToHost('api-call', '/consensus', 'update-height');

	console.log('updating...');
	console.log('password is: ', password);
	updating = setTimeout(update, 15000);
}

// Unlock the wallet
function unlock() {
	IPC.sendToHost('api-call', {
		url: '/wallet/unlock',
		type: 'PUT',
		args: {
			encryptionKey : password,
		},
	}, 'unlocked');
}

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Unlock the wallet if we're just switching back to it
	if (password !== null) {
		unlock();
	} else {
		// Need to check if wallet's unencrypted
		IPC.sendToHost('api-call', '/wallet', 'on-opened');
		// First time opening up the wallet plugin this session
		var popup = eID('password-popup');
		popup.classList.remove('blueprint');
	}
}

// Called upon transitioning away from this view
function stop() {
	console.log('stopping...');
	// Save password for the session before closing
	IPC.sendToHost('api-call', {
		url: '/wallet/seeds',
		type: 'GET',
	}, 'save-password');

	// Stop updating
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
		url: '/wallet/siacoins',
		type: 'POST',
		args: transaction,
	};
	IPC.sendToHost('api-call', call, 'coin-sent');
}

// Adds an address to the address list
function appendAddress(address) {
	var entry = eID('abp').cloneNode(true);
	entry.id = address;
	entry.querySelector('.address').innerHTML = address;
	entry.classList.remove('blueprint');
	eID('address-list').appendChild(entry);
}

// Give the buttons interactivity
eID('enter-password').onclick = function() {
	// Record password
	var field = eID('password-field');
	password = field.value;

	// Hide popup and start the plugin
	field.classList.add('blueprint');
	unlock();
};
eID('create-address').onclick = function() {
	tooltip('Creating...', this);
	var call = {
		url: '/wallet/address',
		type: 'GET',
	};
	IPC.sendToHost('api-call', call, 'new-address');
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

// Error checking shortcut
function assertSuccess(ipcmsg, err) {
	if (err) {
		console.error(ipcmsg, err);
		IPC.sendToHost('notify', 'API Call errored!', 'error');
		return false;
	} else {
		return true;
	}
}

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
IPC.on('coin-sent', function(err, result) {
	if (!assertSuccess('coin-sent', err)) {
		return;
	}
	IPC.sendToHost('notify',  'Transaction sent!', 'sent');
	eID('transaction-amount').value = '';
	eID('confirm').classList.add('hidden');
});
IPC.on('new-address', function(err, result) {
	if (!assertSuccess('new-address', err)) {
		return;
	}
	IPC.sendToHost('notify', 'Address created!', 'success');
	appendAddress(result.Address);
});
IPC.on('save-password', function(err, result) {
	console.log('saving password...');
	if (!assertSuccess('save-password', err)) {
		return;
	}

	password = result.PrimarySeed;
	remainingAddresses = result.AddressesRemaining;
	
	// Lock the wallet
	console.log('locking wallet...');
	IPC.sendToHost('api-call', {
		url: '/wallet/lock',
		type: 'POST',
	}, 'locked');
});
IPC.on('unlocked', function(err, result) {
	console.log('unlocking wallet...');
	if (assertSuccess('unlocked', err)) {
		update();
	}
});
IPC.on('locked', function(err, result) {
	if (!assertSuccess('unlocked', err)) {
		return;
	}
	console.log(wallet);
});
IPC.on('update-status', function(err, result) {
	if (!assertSuccess('update-status', err)) {
		return;
	}

	wallet = result;
	
	// Update balance
	eID('balance').innerHTML = 'Balance: ' + formatSiacoin(wallet.ConfirmedSiacoinBalance);
});
IPC.on('update-height', function(err, result) {
	if (!assertSuccess('update-height', err)) {
		return;
	}
	// Got the height, get the transactions ... if we're not on block 0
	currentHeight = result.Height;
	if (currentHeight === 0) {
		return;
	}
	IPC.sendToHost('api-call', {
		url: '/wallet/transactions',
		type: 'GET',
		args: {
			startHeight: 0,
			endHeight: currentHeight,
		}
	}, 'update-transactions');
});
// TODO: update transaction history and addresses
IPC.on('update-transactions', function(err, result) {
	console.log(currentHeight, wallet);
	if (!assertSuccess('update-transactions', err)) {
		return;
	}
});
