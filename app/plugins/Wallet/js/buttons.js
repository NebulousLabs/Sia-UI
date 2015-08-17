'use strict';

eID('lock-status').onclick = function() {
	if (wallet.Unlocked && this.innerHTML == 'Unlocked') {
		// Lock the wallet
		IPC.sendToHost('api-call', {
			url: '/wallet/lock',
			type: 'POST',
		}, 'locked');
	} else if (!wallet.Unlocked && this.innerHTML == 'Locked'){
		show('request-password');
	} else {
		notify('Locking the wallet is in progress', 'ongoing');
	}
}
// On popup upon entering an encrypted, locked wallet, enter password
eID('enter-password').onclick = function() {
	// Record password
	var field = eID('password-field');

	// Hide popup and start the plugin
	unlock(field.value);
};
// On popup upon entering an unencrypted, locked wallet, show password and
// confirm reading
eID('confirm-password').onclick = function() {
	hide('show-password');
	update();
}
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
	notify('Address created!', 'success');
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
	notify('Transaction sent!', 'sent');
	eID('transaction-amount').value = '';
	eID('confirm').classList.add('hidden');
});
