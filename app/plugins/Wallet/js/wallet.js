'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Variables to store api result values
var wallet = {};
// Keeps track of if the view is shown
var updating;
// DOM shortcut
var element = function makeAlias() {
	return document.getElementById.apply(document, arguments);
};

function callAPI(call, callback) {
	IPC.sendToHost('api-call', call);
	if (callback) {
		IPC.on(call, callback);
	}
}

function formatSiacoin(baseUnits) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(baseUnits).dividedBy(ConversionFactor);
	return display + ' SC';
}

function createAddress() {
	callAPI("/wallet/address", function(err, result) {
		wallet.addresses.push(result.Address);
	});
}

function sendAmount(amount, destination) {
	var transaction = {
		amount: amount,
		destination: destination,
	};
	var call = {
		url: "/wallet/send",
		type: "POST",
		args: transaction,
	};
	callAPI(call);
}

function initListeners() {
	element('create-address').onclick = function() {
		//ui._tooltip(this, "Creating Address");
		createAddress();
	};
	element('send-money').onclick = function() {
		//ui._transferFunds.setFrom("account", accountName);
		//ui._transferFunds.setTo("address");
		//ui.switchView("transfer-funds");
	};
}

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 });
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

	// Enable click events
	initListeners();
 
	// Call the API regularly to update page
	// updating = setInterval(update, 1000);
}

function kill() {
	clearInterval(updating);
}

function update() {
	callAPI('/wallet/status', function(err, result) {
		wallet.balance = result.Balance || wallet.balance;
		wallet.numAddresses = result.NumAddresses || wallet.numAddresses;
		wallet.addresses = result.VisibleAddresses || wallet.addresses;
	
		element('balance').innerHTML = 'Balance: ' + formatSiacoin(wallet.balance);

		// Populate addresses
		wallet.addresses.forEach(function(address) {
			var item = element('blueprint').cloneNode(true);
			item.find(".address").textContent(address);
			element('list').appendChild(item);
		});

	});
}

