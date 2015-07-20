'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Variables to store values
var balance = 0;
var peerCount = 0;
var blockHeight = 0;
// Keeps track of if the view is shown
var updating;
// Variables to store API call values
var calls = ['/wallet/status', '/gateway/status', '/consensus/status'];

function callAPI() {
	calls.forEach(function(call) {
		IPC.sendToHost('api-call', call);
	});
}

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API regularly to update page
	updating = setInterval(callAPI, 1000);
}

function kill() {
	clearInterval(updating);
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

function update(call, result) {
	switch (call) {
		case calls[0]:
			balance = formatKSiacoin(result.Balance) || balance;
			document.getElementById('balance').innerHTML = 'Balance: ' balance;
			break;
		case calls[1]:
			peerCount = result.Peers.length || peerCount;
			document.getElementById('peers').innerHTML = 'Peers: ' + peerCount;
			break;
		case calls[2]:
			blockHeight = result.Height || blockHeight;
			document.getElementById('block-height').innerHTML = 'Block Height: ' + blockHeight;
			break;
		default:
			console.error('Unexpected call: ' + call + ' and result: ' + result);
	}
}

IPC.on('api-result', update);
