'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Variables to store api result values
var balance = 0;
// Keeps track of if the view is shown
var updating;

function callAPI() {
	IPC.sendToHost('api-call', '/wallet/status');
}

function formatSiacoin(baseUnits) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(baseUnits).dividedBy(ConversionFactor);
	return display + ' SC';
}

// Update values per call
IPC.on('/wallet/status', function(err, result) {
	balance = formatSiacoin(result.Balance) || balance;
	document.getElementById('balance').innerHTML = 'Balance: ' + balance;
});

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	//IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 })
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

	// Call the API regularly to update page
	updating = setInterval(callAPI, 1000);
}

function kill() {
	clearInterval(updating);
}
