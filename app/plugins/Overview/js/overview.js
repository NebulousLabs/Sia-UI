'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Variables to store api result values
var balance = 0;
var peerCount = 0;
var blockHeight = 0;
// Keeps track of if the view is shown
var updating;

function callAPI() {
	IPC.sendToHost('api-call', '/wallet/status');
	IPC.sendToHost('api-call', '/gateway/status');
	IPC.sendToHost('api-call', '/consensus');
}

function formatKSiacoin(baseUnits, precision) {
	if (!precision) {
		precision = 10;
	}

	var ksiaConversionFactor = Math.pow(10,27);
	var display = parseFloat((baseUnits/ksiaConversionFactor).toFixed(1));

	// Indicate if the user has some value with a last digit of '1'
	if (baseUnits > 0 && string === parseFloat((0).toFixed(1))) {
		string = parseFloat((0).toFixed(precision).substring(0,precision-1) + '1');
	}

	return display + ' KS';
}

// Update values per call
IPC.on('/wallet/status', function(err, result) {
	balance = formatKSiacoin(result.Balance) || balance;
	document.getElementById('balance').innerHTML = 'Balance: ' + balance;
});
IPC.on('/gateway/status', function(err, result) {
	peerCount = result.Peers.length || peerCount;
	document.getElementById('peers').innerHTML = 'Peers: ' + peerCount;
});
IPC.on('/consensus', function(err, result) {
	blockHeight = result.Height || blockHeight;
	document.getElementById('block-height').innerHTML = 'Block Height: ' + blockHeight;
});

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API regularly to update page
	updating = setInterval(callAPI, 1000);
}

function kill() {
	clearInterval(updating);
}
