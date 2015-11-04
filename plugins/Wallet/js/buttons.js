'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Address Handling  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Address creation
eID('create-address').onclick = function() {
	tooltip('Creating...', this);
	var call = {
		url: '/wallet/address',
		type: 'GET',
	};
	IPC.sendToHost('api-call', call, 'new-address');
};

// Filter address list by search string
function filterAddressList(searchstr) {
	NodeList.prototype.forEach = Array.prototype.forEach;
	var entries = eID('address-list').childNodes;
	entries.forEach( function(entry) {
		if (entry.querySelector('.address').innerHTML.indexOf(searchstr) > -1) {
			show(entry);
		} else {
			hide(entry);
		}
	});
}

// Start search when typing in Search field
eID('search-bar').onkeyup = function() {
	tooltip('Searching...', this);
	var searchstr = eID('search-bar').value;
	filterAddressList(searchstr);
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
addResultListener('new-address', function(result) {
	notify('New address created', 'created');
	appendAddress(result);
	filterAddressList(result.address);
});

// Button to display all wallet addresses
eID('view-all-addresses').onclick = function() {
	NodeList.prototype.forEach = Array.prototype.forEach;
	eID('address-list').childNodes.forEach( function(entry) { show(entry); } );
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Transactions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
function verifyTransaction(caller, callback) {
	var amount = eID('transaction-amount').value;
	var e = eID('send-unit');
	var unit = e.options[e.selectedIndex].value;
	var address = eID('transaction-address').value;

	// Verify number
	if (!isNumber(amount)) {
		tooltip('Enter numeric amount of Siacoin to send!', caller);
		return;
	} 
	// Verify balance
	if (wallet.Balance < amount) {
		tooltip('Balance too low!', caller);
		return;
	} 
	// Verify address
	if (!isAddress(address)) {
		tooltip('Enter correct address to send to!', caller);
		return;
	}

	var total = new BigNumber(amount).times(unit);
	callback(total, address);
}

// Button to send coin
eID('send-money').onclick = function() {
	verifyTransaction(this, function() {
		tooltip('Are you sure?', eID('confirm'));
		eID('confirm').classList.remove('transparent');
	});
};

// Button to confirm transaction
eID('confirm').onclick = function() {
	// If the button's transparent, don't do anything
	if (eID('confirm').classList.contains('transparent')) {
		return;
	}
	verifyTransaction(this, function(amount, address) {
		tooltip('Sending...', eID('confirm'));
		sendCoin(amount, address);
	});
	eID('confirm').classList.add('transparent');
};

// Transaction was sent
addResultListener('coin-sent', function(result) {
	notify('Transaction sent to network!', 'sent');
	eID('transaction-amount').value = '';
});

// Button to load all wallet transactions
eID('view-all-transactions').onclick = function() {
	tooltip('Loading all transactions', this);
	IPC.sendToHost('api-call', {
		url: '/wallet/transactions',
		args: {
			startheight: 0,
			endheight: 1000000,
		},		
		type: 'GET',
	}, 'update-history');
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Capsule ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Lock or unlock the wallet
eID('lock-pod').onclick = function() {
	var state = eID('lock-status').innerHTML;
	if (!wallet.unlocked && state === 'Create Wallet') {
		encrypt();
	} else if (wallet.unlocked && state === 'Lock Wallet') {
		lock();
	} else if (!wallet.unlocked && state === 'Unlock Wallet'){
		getPassword();
	} else {
		console.error('lock-pod disagrees with wallet variable!', wallet.unlocked, state);
	}
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Popups ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// On popup upon entering an encrypted, locked wallet, enter password
eID('enter-password').onclick = function() {
	// Record password
	var field = eID('password-field');

	// Hide popup and start the plugin
	unlock(field.value);
	field.value = '';
};

// An 'Enter' keypress in the input field will submit it.
eID('password-field').addEventListener("keydown", function(e) {
    e = e || window.event;
    if (e.keyCode === 13) {
        eID('enter-password').click();
    }
}, false);

// User wants to save the password
eID('save-password').onclick = function() {
	if (eID('save-password').checked) {
		show('warning');
	} else {
		hide('warning');
	}
};

// Make sure the user read the password
eID('confirm-password').onclick = function() {
	var pw = eID('generated-password').innerText;
	if (eID('save-password').checked) {
		savePassword(pw);
	}
	eID('generated-password').innerText = '';
	hide('show-password');
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Load ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
eID('load-legacy-wallet').onclick = function() {
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
		var oldOnclick = eID('enter-password').onclick;
		eID('enter-password').onclick = function() {
			var field = eID('password-field');
			loadLegacyWallet(loadPath[0], field.value);
			field.value = '';
			eID('enter-password').onclick = oldOnclick;
			hide('request-password');
		};
		show('request-password');
	}
};
