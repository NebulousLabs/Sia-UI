'use strict';

// Tracks addresses
var transactions = [];
// Criteria by which to view transactions
var criteria = {
	startHeight: 0,
	endHeight: 1000000,
	startTime: undefined,
	endTime: undefined,
	minValue: undefined,
	maxValue: undefined,
	fundTypes: [
		'siacoin input',
		'siacoin output',
		'siafund input',
		'siafund output',
		'claim output',
		'miner payout',
	],
	confirmedTransactions: true,
	uncomfirmedTransactions: true,
	txnId: undefined,
	address: undefined,
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Updating  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Append a transaction to Transactions list
function makeTransaction(txn) {
	var element = $(`
		<div class='transaction' id='` + txn.transactionid + `'>
			<div class='type'></div>
			<div class='value'></div>
			<div class='txnid'></div>
			<div class='time'></div>
		</div>
	`);

	// Insert transaction values in UI
	element.attr('id', txn.transactionid);
	element.find('.value').html(txn.value + ' S');
	element.find('.txnid').html(txn.transactionid);
	var timestamp = new Date(txn.confirmationtimestamp * 1000);
	var time = timestamp.toLocaleString();
	element.find('.time').html(time);

	// Set transaction positive or negative
	if (txn.value > 0) {
		element.find('.type').addClass('positive');
	} else {
		element.find('.type').addClass('negative');
	}

	// Set transaction type icon
	var currencyIcon;
	if (txn.type === 'miner') {
		currencyIcon = '<i class=\'fa fa-heartbeat\'></i>';
	} else if (txn.type === 'siafund') {
		currencyIcon = '<i class=\'fa fa-diamond\'></i>';
	} else if (txn.type === 'siacoin'){
		currencyIcon = '<i class=\'fa fa-usd\'></i>';
	}
	element.find('.type').append(currencyIcon);

	// Add and display transaction
	$('#transaction-list').append(element);
}

// Fill address page with search results or addresses
function updateTransactionPage() {
	$('#transaction-list').empty();

	// Set page limits
	$('#transaction-page').attr({
		min: 1,
		max: transactions.length === 0 ? 1 : Math.ceil(transactions.length / 25),
	});

	// Make elements for this page
	var n = (($('#transaction-page').val() - 1) * 25);
	transactions.slice(n, n + 25).forEach(function(processedTransaction) {
		makeTransaction(processedTransaction);
	});
}

// Update transactions on page navigation
$('#transaction-page').on('input', updateTransactionPage);

// Filters the transactions array down to what fits the criteria
function filterTransactions() {
	// Compute aggregate value of the transaction
	transactions.forEach(function(txn) {
		// Compute transaction net value
		var value = new BigNumber(0);
		var type;
		if (txn.processedinputs) {
			txn.processedinputs.forEach( function(input) {
				if (input.walletaddress) {
					value = value.sub(input.value);
				}
				// TODO: Imperfect way to go about determining type of
				// transaction from 'miner', 'siacoin', or 'siafund'
				type = input.fundtype.split(' ')[0];
			});
		}
		if (txn.processedoutputs) {
			txn.processedoutputs.forEach( function(output) {
				if (output.walletaddress) {
					value = value.add(output.value);
				}
				// TODO: Imperfect way to go about determining type of
				// transaction from 'miner', 'siacoin', or 'siafund'
				type = output.fundtype.split(' ')[0];
			});
		}
		txn.value = convertSiacoin(value);
		txn.type = type;
	});

	// Filter against criteria
	transactions = transactions.filter(function(txn) {
		// TODO add criteria filtering
		return true;
	});
}

// Fill transactions array
function getTransactions() {
	// Decide what call to make based on criteria
	var url, args;
	if (criteria.txnId) {
		args = {};
		url = '/wallet/transaction/' + criteria.txnId;
	} else if (criteria.address) {
		args = {};
		url = '/wallet/transactions/' + criteria.address;
	} else {
		// Default call to /wallet/tranasctions
		url = '/wallet/transactions';
		args = {
			startheight: criteria.startHeight,
			endheight: criteria.endHeight,
		};
	}

	// Make call
	IPCRenderer.sendToHost('api-call', {
		url: url,
		type: 'GET',
		args: args,
	}, 'update-transactions');
}

// Update transaction in memory with result from api call
addResultListener('update-transactions', function(result) {
	transactions = [];
	// Transaction by id
	if (result.transaction) {
		transactions.push(result.transaction);
	} else if (result.transactions) {
		// Transactions by Address
		transactions = result.transactions;
	} else {
		// All transactions
		if (criteria.confirmedTransactions && result.confirmedtransactions !== null) {
			transactions = result.confirmedtransactions;
		}
		if (criteria.unconfirmedTransactions && result.unconfirmedtransactions !== null) {
			transactions = transactions.concat(result.unconfirmedtransactions);
		}
	}

	// Reverse direction of transactions list (most recent first)
	transactions.reverse();
	filterTransactions();
	updateTransactionPage();
});

// Apply new criteria and update
function updateTransactionCriteria(newCriteria) {
	for (var prop in newCriteria) {
		if (newCriteria.hasOwnProperty(prop)) {
			criteria[prop] = newCriteria[prop];
		}
	}
	getTransactions();
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Sending  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Define send call
function sendCoin(amount, address) {
	var transaction = {
		amount: amount.toString(),
		destination: address,
	};
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/siacoins',
		type: 'POST',
		args: transaction,
	}, 'coin-sent');

	// Reflect it asap
	setTimeout(update, 100);
}

// Transaction was sent
addResultListener('coin-sent', function(result) {
	notify('Transaction sent to network!', 'sent');
	$('#transaction-value').val('');
});

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
	var value = $('#transaction-value').val();
	var unit = $('#send-unit').val();
	var total = new BigNumber(value).times(unit);
	var address = $('#transaction-address').val();

	// Verify number
	if (!isNumber(value)) {
		tooltip('Enter numeric value of Siacoin to send!', caller);
		return;
	} 
	// Verify balance
	if (wallet.confirmedsiacoinbalance < total) {
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
	validateTransaction(this, function(value, address) {
		tooltip('Sending...', $('#confirm').get(0));
		sendCoin(value, address);
	});
	$('#confirm').addClass('transparent');
});

