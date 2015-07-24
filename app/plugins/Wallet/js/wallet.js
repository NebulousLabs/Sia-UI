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

function formatKSiacoin(baseUnits) {
	var ksiaConversionFactor = new BigNumber(10).pow(27);
	var display = new BigNumber(baseUnits).dividedBy(ksiaConversionFactor);

	return display.toPrecision(35) + ' KS';
}

// Update values per call
IPC.on('/wallet/status', function(err, result) {
	balance = formatKSiacoin(result.Balance) || balance;
	document.getElementById('balance').innerHTML = 'Balance: ' + balance;

	document.getElementById('t1').innerHTML = 'T1: ' + formatKSiacoin(new BigNumber(10).pow(27));
	document.getElementById('t2').innerHTML = 'T2: ' + formatKSiacoin(new BigNumber(10).pow(27).add(1000000000));
	document.getElementById('t3').innerHTML = 'T3: ' + formatKSiacoin(new BigNumber(10).pow(27).add(2));
	document.getElementById('t4').innerHTML = 'T4: ' + formatKSiacoin(new BigNumber(10).pow(27).sub(100000000));
	document.getElementById('t5').innerHTML = 'T5: ' + formatKSiacoin(new BigNumber(10).pow(27).sub(2));
});

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 500 })


	// Call the API regularly to update page
	updating = setInterval(callAPI, 1000);
}

function kill() {
	clearInterval(updating);
}
