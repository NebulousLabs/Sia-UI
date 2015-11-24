'use strict';

// How often /wallet updates
var refreshRate = 500; // half-second
var finalRefreshRate = 1000 * 60 * 5; // five-minutes
// Keeps track of if the view is shown
var updating;
// Keeps track of wallet status results
var wallet = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Updating  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make API calls, sending a channel name to listen for responses
function update() {
	IPC.sendToHost('api-call', '/wallet', 'update-status');

	// Get list of wallet addresses
	IPC.sendToHost('api-call', {
		url: '/wallet/addresses',
		type: 'GET',
	}, 'update-addresses');

	updating = setTimeout(update, refreshRate);
}

// Update wallet summary in header
addResultListener('update-status', function(result) {
	wallet = result;

	// slow down after first successful call
	refreshRate = finalRefreshRate;

	// Show correct lock status.
	if (!wallet.encrypted) {
		setUnencrypted();
	} else if (!wallet.unlocked) {
		setLocked();
	} else if (wallet.unlocked) {
		setUnlocked();
	}

	// Update balance confirmed and uncomfirmed
	var bal = convertSiacoin(wallet.confirmedsiacoinbalance);
	var pend = convertSiacoin(wallet.unconfirmedincomingsiacoins).sub(convertSiacoin(wallet.unconfirmedoutgoingsiacoins));
	if (wallet.unlocked && wallet.encrypted) {
		$('#confirmed').show();
		$('#unconfirmed').show();
		$('#confirmed').html('Balance: ' + bal + ' S');
		$('#unconfirmed').html('Pending: ' + pend + ' S');
	} else {
		$('#confirmed').hide();
		$('#unconfirmed').hide();
	}
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Transactions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Append a transaction to Transactions list
function appendTransaction(txn) {
	// Add only new transactions
	if (typeof(txn) === 'undefined') { return; }
	if ($('#' + txn.transactionid).length !== 0) { return; }

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

	// Add only non-zero transactions
	amount = convertSiacoin(amount);
	if (amount.equals(0)) {
		return;
	}

	// Make transaction
	var txnElement = $('#transactionbp').clone();
	txnElement.id = txn.transactionid;

	txnElement.timestamp = txn.confirmationtimestamp * 1000;
	var timestamp = new Date(txn.confirmationtimestamp * 1000);
	var time = timestamp.toLocaleString();

	// Insert transaction values in UI
	txnElement.find('.amount').html(amount + ' S');
	txnElement.find('.txnid').html(txn.transactionid);
	txnElement.find('.time').html(time);

	// Set transaction type
	if (amount < 0) {
		txnElement.find('.send').show();
		txnElement.find('.receive').hide();
	} else {
		txnElement.find('.send').hide();
		txnElement.find('.receive').show();
	}

	// Display transaction
	$('#transaction-list').append(txnElement);
	txnElement.show();
}

// Update transaction history
addResultListener('update-history', function(result) {
	if (result.confirmedtransactions) {
		// Reverse direction of transactions list (most recent first)
		result.confirmedtransactions.reverse();
		result.confirmedtransactions.forEach(function (txn) {
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

	update();
}

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}

