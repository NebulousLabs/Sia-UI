'use strict';

var blockheight = 0;

// Library for working with clipboard
const Clipboard = require('clipboard');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Updating  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make API calls, sending a channel name to listen for responses
function update(address) {
	IPC.sendToHost('api-call', '/wallet', 'update-status');

	// Get list of wallet addresses
	IPC.sendToHost('api-call', {
		url: '/wallet/addresses',
		type: 'GET',
	}, 'update-address');

	updating = setTimeout(update, 60000 * 5); // update every 5 min
	return;
}

// Add transactions to view list per address
addResultListener('update-address', function(result) {
	// Update address list
	eID('address-list').innerHTML = '';
	result.addresses.forEach( function (address) {
		appendAddress(address);
	});
	return;

	/* Fetch all wallet transactions by iterate over wallet addresses
	var loopmax = result.addresses.length;
	var counter = 0;
	(function next() {
		setTimeout(function() {
			updateAddrTxn(result.addresses[counter].address);
			next();
		}, 50); // force 50 ms delay between each GET request
	})();*/
});

// Get transactions for a specific wallet address
function updateAddrTxn(addr) {
	eID('transaction-list').innerHTML = '';
	IPC.sendToHost('api-call', {
		url: '/wallet/transactions/' + addr,
		type: 'GET',
	}, 'update-history');
}

// Update wallet summary in header
addResultListener('update-status', function(wallet) {
	// Update balance confirmed and uncomfirmed
	var bal = convertSiacoin(wallet.confirmedsiacoinbalance);
	var pend = convertSiacoin(wallet.unconfirmedincomingsiacoins).sub(convertSiacoin(wallet.unconfirmedoutgoingsiacoins));
	if (wallet.unlocked && wallet.encrypted) {
		eID('confirmed').style.display = 'inline';
		eID('unconfirmed').style.display = 'inline';
		eID('confirmed').innerHTML = 'Balance: ' + bal + ' S';
		eID('unconfirmed').innerHTML = 'Pending: ' + pend + ' S';
	} else {
		eID('confirmed').style.display = 'none';
		eID('unconfirmed').style.display = 'none';
	}
});

// Append wallet address to Addresses list
function appendAddress(addr) {
	// Create only new addresses
	if (typeof(addr) == 'undefined') { return; }
	var addrElement = eID('addressbp').cloneNode(true);

	// DOM shortcut
	// TODO: Don't know if bad practice because memleak or if it GCs well
	var field = function(selector) {
		return addrElement.querySelector(selector);
	};

	// Insert values
	field('.listnum').innerHTML = eID('address-list').childNodes.length + 1;
	field('.address').innerHTML = addr.address;
	field('.address').id = addr.address;
	field('.address').addEventListener("click", getAddress);

	// Make copy-to-clipboard buttin clickable
	field('.copy-address').onclick = function() {
		Clipboard.writeText(addr.address);
		notify('Copied address to clipboard');
	};

	// Append, but not do display, address
	eID('address-list').appendChild(addrElement);
	return;
}

// Display transactions of clicked address
function getAddress(event) {
	updateAddrTxn(event.target.id);
}

// Append a transaction to Transactions list
function appendTransaction(txn) {
	if (typeof(txn) == 'undefined') { return; }

	// Add only new transactions
	if (eID(txn.transactionid)) { return; }
	var txnElement = eID('transactionbp').cloneNode(true);
	txnElement.id = txn.transactionid;
	txnElement.timestamp = txn.confirmationtimestamp * 1000;

	// DOM shortcut
	// TODO: Don't know if bad practice because memleak or if it GCs well
	var field = function(selector) {
		return txnElement.querySelector(selector);
	};

	// Compute transaction net amount
	var amount = new BigNumber(0);
	if (txn.inputs) {
		txn.inputs.forEach( function(input) {
			if (input.walletaddress) {
				amount = amount.sub(input.value);
			}
		});
	}
	if (txn.outputs) {
		txn.outputs.forEach( function(output) {
			if (output.walletaddress) {
				amount = amount.add(output.value);
			}
		});
	}

	// Convert hastings to siacoin and round to 2 decimals
	amount = convertSiacoin(amount);

	if (amount == 0) { return; }

	// Format transaction timestamp
	var timestamp = new Date(txn.confirmationtimestamp * 1000);
	var time = timestamp.toLocaleString();

	// Insert transaction values in UI
	field('.amount').innerHTML = amount + ' S';
	field('.txnid').innerHTML = txn.transactionid;
	field('.time').innerHTML = time;

	// Set transaction type
	if (amount < 0) {
		show(field('.send'));
		hide(field('.receive'));
	} else {
		hide(field('.send'));
		show(field('.receive'));
	}

	// Display transaction
	eID('transaction-list').appendChild(txnElement);
	show(txnElement);
	return;
}

// Update transaction history
addResultListener('update-history', function(result) {
	if (result.confirmedtransactions) {
		// Reverse direction of transactions list (most recent first)
		result.confirmedtransactions.reverse();
		result.confirmedtransactions.forEach( function (txn) {
			appendTransaction(txn);
		});
	}
	// TODO Register unconfirmed transactions
	/*if (result.unconfirmed) {
		result.unconfirmedtransactions.forEach(function(processedtxn) {
		});
	}*/
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Start/Stop ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Need to check if wallet's unencrypted
	IPC.sendToHost('api-call', '/wallet', 'on-opened');
}

// First status call to diagnose the state of the wallet
addResultListener('on-opened', function(result) {
	wallet = result;

	// Show correct lock status. TODO: If the wallet is encrypted, prompt with
	// a pw.
	if (!wallet.encrypted) {
		setUnencrypted();
   	} else if (!wallet.unlocked) {
		setLocked();
	} else if (wallet.unlocked) {
		setUnlocked();
	}

	// Start updating
	update();
});

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}

