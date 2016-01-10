'use strict';

// Variable to store transaction history
var transactions = [];

// Criteria by which to filter transactions
var criteria = {
	startHeight:             0,
	endHeight:               1000000,
	startTime:               null,
	endTime:                 null,
	minValue:                null,
	maxValue:                null,
	currency: [
		'siacoin',
		'siafund',
		'claim',
		'miner',
	],
	inputs:                  true,
	outputs:                 true,
	confirmedTransactions:   true,
	uncomfirmedTransactions: true,
	txnId:                   null,
	address:                 null,
	itemsPerPage:            25,
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ Checking Transactions ~~~~~~~~~~~~~~~~~~~~~~~~~~
// Returns if the transaction fits the criteria
function checkCriteria(txn) {
	// Checks each criteria value if it's relaxed or if the transaction passes
	// Failing one check returns false but passing all checks returns true
	return (criteria.endTime   === null || txn.confirmationtimestamp <= criteria.endTime)   &&
	       (criteria.startTime === null || txn.confirmationtimestamp >= criteria.startTime) &&
	       (criteria.maxValue  === null || txn.value                 <= criteria.maxValue)  &&
	       (criteria.minValue  === null || txn.value                 >= criteria.minValue)  &&
	       (criteria.currency  === null || criteria.currency.indexOf(txn.currency) !== -1)  &&
	       (criteria.inputs    === true || txn.value                 >= 0)                  &&
	       (criteria.outputs   === true || txn.value                 <= 0);
}

// Compute aggregate value of the transaction
function computeSum(txn) {
	// Compute transaction net value
	var value = new BigNumber(0);
	var currency;
	if (txn.inputs) {
		txn.inputs.forEach( function(input) {
			if (input.walletaddress) {
				value = value.sub(input.value);
			}
			// TODO: Imperfect way to go about determining currency of
			// transaction from 'miner', 'siacoin', or 'siafund'
			currency = input.fundtype.split(' ')[0];
		});
	}
	if (txn.outputs) {
		txn.outputs.forEach( function(output) {
			if (output.walletaddress) {
				value = value.add(output.value);
			}
			// TODO: Imperfect way to go about determining currency of
			// transaction from 'miner', 'siacoin', or 'siafund'
			currency = output.fundtype.split(' ')[0];
		});
	}
	txn.value = convertSiacoin(value);
	txn.currency = currency;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Updating DOM  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Append a transaction to Transactions list
function makeTransaction(txn) {
	var element = $(`
		<div class='transaction entry s-font' id=''>
			<div class='currency'></div>
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
	if (txn.value.isNegative()) {
		element.find('.currency').addClass('negative');
	} else {
		element.find('.currency').addClass('positive');
	}

	// Set transaction currency icon
	var currencyIcon = {
		miner:   'fa fa-heartbeat',
		claim:   'fa fa-percent',
		siafund: 'fa fa-diamond',
		siacoin: 'fa fa-usd',
	}[txn.currency];
	element.find('.currency').append('<i class=\'' + currencyIcon + '\'></i>');

	// Add and display transaction
	$('#transaction-list').append(element);
}

// Fill address page with search results or addresses
function updateTransactionPage() {
	$('#transaction-list').empty();

	// Set page limits
	var maxPage = transactions.length === 0 ? 1 : Math.ceil(transactions.length / criteria.itemsPerPage);
	$('#transaction-page').attr({
		min: 1,
		max: maxPage,
	});
	$('#transaction-page').next().text('/' + maxPage);

	// Make elements for this page
	var n = (($('#transaction-page').val() - 1) * criteria.itemsPerPage);
	transactions.slice(n, n + criteria.itemsPerPage).forEach(function(processedTransaction) {
		makeTransaction(processedTransaction);
	});
}

// Update transactions on page navigation
$('#transaction-page').on('input', updateTransactionPage);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ Updating Transactions ~~~~~~~~~~~~~~~~~~~~~~~~~~
// Update transaction in memory with result from api call
function updateTransactions(result) {
	var txns = [];
	// Transaction by id
	if (result.transaction) {
		txns.push(result.transaction);
	} else if (result.txns) {
		// Transactions by Address
		txns = result.transactions;
	} else {
		// All transactions
		if (criteria.confirmedTransactions && result.confirmedtransactions !== null) {
			txns = result.confirmedtransactions;
		}
		if (criteria.unconfirmedTransactions && result.unconfirmedtransactions !== null) {
			txns = txns.concat(result.unconfirmedtransactions);
		}
	}

	// Reverse direction of transactions list (most recent first)
	txns.reverse();
	txns.forEach(computeSum);
	transactions = txns.filter(checkCriteria);
	updateTransactionPage();
}

// Fill transactions array
function getTransactions() {
	// Decide what call to make based on criteria
	var url, qs;
	if (criteria.txnId) {
		url = '/wallet/transaction/' + criteria.txnId;
	} else if (criteria.address) {
		url = '/wallet/transactions/' + criteria.address;
	} else {
		// Default call to /wallet/tranasctions
		url = '/wallet/transactions';
		qs = {
			startheight: criteria.startHeight,
			endheight: criteria.endHeight,
		};
	}

	// Make call
	Siad.apiCall({
		url: url,
		qs: qs,
	}, updateTransactions);
}

// Apply new criteria and update
function updateTransactionCriteria(newCriteria) {
	Object.assign(criteria, newCriteria);
	getTransactions();
}

// Refresh button to load all wallet transactions
$('#view-all-transactions').click(function() {
	tooltip('Loading all transactions', this);
	criteria.txnId = null;
	criteria.address = null;
	getTransactions();
});

