'use strict';

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Need to check if wallet's unencrypted
	IPC.sendToHost('api-call', '/wallet', 'on-opened');
}
IPC.on('on-opened', function(err, result) {
	if (!assertSuccess('on-opened', err)) {
		return;
	}
	wallet = result;

	// If first time opening, show password
	if (!wallet.encrypted) {
		encrypt();
	}
	// Show correct lock status
   	if (!wallet.unlocked) {
		locked();
	} else if (wallet.unlocked) {
		unlocked();
	}

	// Start updating
	update();
});

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}

// Make API calls, sending a channel name to listen for responses
function update() {
	IPC.sendToHost('api-call', '/wallet', 'update-status');
	IPC.sendToHost('api-call', {
		url: '/wallet/history',
		type: 'GET',
		args: {
			startheight: 0,
			// arbitrarily large endheight to get full history
			endheight: Math.pow(2,62),
		}
	}, 'update-history');
	
	setTimeout(update, 15000);
}
// Update transaction history and addresses
IPC.on('update-status', function(err, result) {
	if (!assertSuccess('update-status', err)) {
		return;
	}

	wallet = result;
	
	// Update balance
	var bal = convertSiacoin(wallet.confirmedsiacoinbalance);
	var pend = convertSiacoin(wallet.unconfirmedincomingsiacoins - wallet.unconfirmedoutgoingsiacoins);
	console.log(wallet);
	console.log(bal);
	console.log(pend);
	console.log(wallet.unconfirmedincomingsiacoins - wallet.unconfirmedoutgoingsiacoins);
	eID('balance').innerHTML = 'Balance: ' + bal + ' S';
	eID('uncomfirmed').innerHTML = 'Pending: ' + pend + ' S';
});
// Adds an address to the address list
function appendTransaction(txn) {
	if (eID(txn.transactionid)) {
		return;
	}
	var entry = eID('transactionbp').cloneNode(true);
	entry.id = txn.transactionid;

	// Determine how to disaply transaction
	// Have to use !== logic to represent miner payouts
	var sign, unit, amount, related;
	var ft = txn.fundtype.split(' ');
	sign = ft[1] !== 'input' ? '+' : '-';
	amount = ft[0] !== 'siafund' ? convertSiacoin(txn.value) : txn.value;
	unit = ft[0] !== 'siafund' ? ' Siacoin ' : ' Siafund ';
	related = ft[1] !== 'input' ? ' received into ' : ' sent from ';
	related += txn.relatedaddress;
	// Describe if from mining or from a transaction
	related += ft[1] === 'payout' ? ' via mining' : ' via trading ';

	// Sentence to display transaction
	var txndisplay = sign + amount + unit + related;

	// Display transaction
	entry.querySelector('.transaction').innerHTML = txndisplay;
	eID('transaction-list').appendChild(entry);
	show(entry);
}
// Update transaction history and addresses
IPC.on('update-history', function(err, result) {
	if (!assertSuccess('update-history', err)) {
		return;
	}
	if (result.confirmedhistory) {
		result.confirmedhistory.forEach(function(wlttxn) {
			appendTransaction(wlttxn);
			// Only add addresses that the wallet paid out from
			appendAddress(wlttxn.relatedaddress);
		});
	}
	if (result.unconfirmedhistory) {
		result.unconfirmedhistory.forEach(function(wlttxn) {
		});
	}
});

