'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Table Header  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Address creation
eID('create-address').onclick = function() {
	tooltip('Creating...', this);
	var call = {
		url: '/wallet/address',
		type: 'GET',
	};
	IPC.sendToHost('api-call', call, 'new-address');
};
// Adds an address to the address list
function appendAddress(address) {
	if (eID(address)) {
		return;
	}
	var entry = eID('addressbp').cloneNode(true);
	entry.id = address;
	entry.querySelector('.address').innerHTML = address;
	show(entry);
	eID('address-list').appendChild(entry);
}
// Add the new address
IPC.on('new-address', function(err, result) {
	if (!assertSuccess('new-address', err)) {
		return;
	}
	notify('Address created!', 'success');
	appendAddress(result.address);
});

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

	// Reflect it asap
	setTimeout(update, 100);
}
// Transaction has to be legitimate
// TODO: verify address
function verifyTransaction(callback) {
	var amount = eID('transaction-amount').value;
	var e = eID('send-unit');
	var unit = e.options[e.selectedIndex].value;
	var address = eID('transaction-address').value;

	// Verify number
	if (!isNumber(amount)) {
		tooltip('Enter numeric amount of Siacoin to send!', eID('send-money'));
		return;
	} 
	// Verify balance
	if (wallet.Balance < amount) {
		tooltip('Balance too low!', eID('send-money'));
		return;
	} 
	// Verify address
	if (!isAddress(address)) {
		tooltip('Enter correct address to send to!', eID('send-money'));
		return;
	}

	var total = new BigNumber(amount).times(unit).round();
	callback(total, address);
}
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
// Make the call
IPC.on('coin-sent', function(err, result) {
	if (!assertSuccess('coin-sent', err)) {
		return;
	}
	notify('Transaction sent to network!', 'sent');
	eID('transaction-amount').value = '';
	eID('confirm').classList.add('hidden');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Capsule  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Lock or unlock the wallet
eID('lock-pod').onclick = function() {
	var state = eID('lock-status').innerHTML;
	if (wallet.unlocked && state === 'Unlocked') {
		lock();
	} else if (!wallet.unlocked && state === 'Locked'){
		show('request-password');
	} else {
		console.error('lock-pod disagrees with wallet variable!', wallet.unlocked, state);
	}
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Popups  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// On popup upon entering an encrypted, locked wallet, enter password
eID('enter-password').onclick = function() {
	// Record password
	var field = eID('password-field');

	// Hide popup and start the plugin
	unlock(field.value);
	field.value = '';
};
// Make sure the user read the password
eID('confirm-password').onclick = function() {
	hide('show-password');
	update();
};

