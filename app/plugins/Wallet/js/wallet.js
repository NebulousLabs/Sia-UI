'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Variables to store api result values
var wallet = {};
// Keeps track of if the view is shown
var updating;
// Keeps track of if listeners were already instantiated
var listening = false;
// DOM shortcut
var eID = function() {
	return document.getElementById.apply(document, arguments);
};

// Call API and listen for response to call
function callAPI(call, callback) {
	IPC.sendToHost('api-call', call);
	// prevents adding duplicate listeners
	if (!listening) {
		IPC.on(call, callback);
	}
}

// Updates element text
function updateField(err, caption, newValue, elementID) {
	if (err) {
		console.error(err);
	}
	if (newValue !== null) {
		document.getElementById(elementID).innerHTML = caption + newValue;
	}
}

// Convert to Siacoin
function formatSiacoin(baseUnits) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(baseUnits).dividedBy(ConversionFactor);
	return display + ' SC';
}

// Create a new address
function createAddress() {
	callAPI("/wallet/address", function(err, result) {
		wallet.addresses.push(result.Address);
	});
}

// Send the specified transaction
function sendCoin(amount, destination) {
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

// Give the buttons interactivity
function initListeners() {
	eID('create-address').onclick = function() {
		//ui._tooltip(this, "Creating Address");
		createAddress();
	};
	eID('send-money').onclick = function() {
		//ui._transferFunds.setFrom("account", accountName);
		//ui._transferFunds.setTo("address");
		//ui.switchView("transfer-funds");
	};
}

// Define API calls and update DOM per call
function update() {
	callAPI('/wallet/status', function(err, result) {
		wallet.balance = result.Balance || wallet.balance || 0;
		wallet.numAddresses = result.NumAddresses || wallet.numAddresses || 0;
		wallet.addresses = result.VisibleAddresses || wallet.addresses;
	
		updateField(err, 'Balance: ', formatSiacoin(wallet.balance), 'balance');

		// Populate addresses
		wallet.addresses.forEach(function(address) {
			var entry = eID('blueprint').cloneNode(true);
			entry.querySelector(".address").innerHTML = address;
			entry.id = address;
			if (!eID(address)) {
				eID('address-list').appendChild(entry);
			}
		});
	});
	listening = true;
}

// Called upon showing
function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 });
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

	// Enable click events
	initListeners();
 
	// Call the API regularly to update page
	updating = setInterval(update, 1000);
}

// Called upon transitioning away from this view
function kill() {
	clearInterval(updating);
}

