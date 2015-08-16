'use strict';

// Make API calls, sending a channel name to listen for responses
function update() {
	IPC.sendToHost('api-call', '/wallet', 'update-status');
	IPC.sendToHost('api-call', '/consensus', 'update-height');

	console.log('updating...');
	console.log('password is: ', password);
}
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
// Adds an address to the address list
function appendAddress(address) {
	if (eID(address)) {
		return;
	}
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

// Address creation
eID('create-address').onclick = function() {
	tooltip('Creating...', this);
	var call = {
		url: '/wallet/address',
		type: 'GET',
	};
	IPC.sendToHost('api-call', call, 'new-address');
};
IPC.on('new-address', function(err, result) {
	if (!assertSuccess('new-address', err)) {
		return;
	}
	IPC.sendToHost('notify', 'Address created!', 'success');
	appendAddress(result.Address);
});

// Button to send coin
eID('send-money').onclick = function() {
	verifyTransaction(function() {
		eID('confirm').classList.remove('hidden');
	});
};
// Button to confirm transaction
eID('confirm').onclick = function() {
	tooltip('Sending...', this);
	verifyTransaction(function(amount, address) {
		sendCoin(amount, address);
	});
};
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
// Define send call
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
// Make the call
IPC.on('coin-sent', function(err, result) {
	if (!assertSuccess('coin-sent', err)) {
		return;
	}
	IPC.sendToHost('notify',  'Transaction sent!', 'sent');
	eID('transaction-amount').value = '';
	eID('confirm').classList.add('hidden');
});
