"use strict";
// Library for communicating with Sia-UI
const IPC = require("ipc");
// Library for arbitrary precision in numbers
const BigNumber = require("bignumber.js");
// Variables to store api result values
var wallet = {};
// Keeps track of if the view is shown
var updating;
// Keeps track of if listeners were already instantiated
var listening = false;
// DOM shortcut
var eID = function() {
	return document.getElementById.apply(document, [].slice.call(arguments));
};

// Call API and listen for response to call
function callAPI(call, callback) {
	IPC.sendToHost("api-call", call);
	// prevents adding duplicate listeners
	if (!listening) {
		IPC.on(call, callback);
	}
}

// Updates element text
function updateField(err, caption, newValue, elementID) {
	if (newValue !== null) {
		document.getElementById(elementID).innerHTML = caption + newValue;
	}
}

// Convert to Siacoin
function formatSiacoin(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display + " SC";
}

// Create a new address
function createAddress() {
	callAPI("/wallet/address");
}

// Send the specified transaction
function sendCoin(amount, address) {
	var transaction = {
		amount: amount.toString(),
		destination: address,
	};
	var call = {
		url: "/wallet/send",
		type: "POST",
		args: transaction,
	};
	callAPI(call);
}

// Amount has to be a number
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Transaction has to be legitimate
// TODO: verify address
function verifyTransaction(callback) {
	var amount = eID("transaction-amount").value;
	var e = eID("send-unit");
	var unit = e.options[e.selectedIndex].value;

	var address = eID("transaction-address").value;

	if (!isNumber(amount)) {
		window.alert("Enter numeric amount of Siacoin to send");
	} else if (wallet.Balance < amount) {
		window.alert("Balance too low!");
	} else if (callback) {
		var total = new BigNumber(amount).times(unit).round();
		callback(total, address);
	}
}

// Give the buttons interactivity
function initListeners() {
	eID("create-address").onclick = function() {
		//ui._tooltip(this, "Creating Address");
		// TODO: Make this responsive such as above
		createAddress();
	};
	eID("send-money").onclick = function() {
		verifyTransaction(function() {
			eID("confirm").classList.remove("hidden");
		});
	};
	eID("confirm").onclick = function() {
		verifyTransaction(function(amount, address) {
			sendCoin(amount, address);
			window.alert(amount.dividedBy("1e24") + " Siacoin sent to " + address);
			eID("transaction-amount").value = "";
			eID("confirm").classList.add("hidden");
		});
	};
}

// Define API calls and update DOM per call
function update() {
	callAPI("/wallet/status", function(err, result) {
		if (err) {
			console.error(err);
			return;
		} else if (result) {
			wallet = result;
		} else {
			console.error("Unknown occurence: no error and no result from callAPI!")
			return;
		}
		
		// Populate addresses
		for (var i = 0; i < wallet.VisibleAddresses.length; i++) {
			var address = wallet.VisibleAddresses[i];
			if (eID(address)) {
				return;
			}
			var entry = eID("abp").cloneNode(true);
			entry.id = address;
			entry.querySelector(".address").innerHTML = address;
			entry.classList.remove("blueprint");
			eID("address-list").appendChild(entry);
		};
		
		// Update balance
		updateField(err, "Balance: ", formatSiacoin(wallet.Balance), "balance");
	});
	listening = true;
}

// Called upon showing
function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost("devtools");
	
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

