'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Variables to store api result values
var balance = 0;
var peerCount = 0;
var blockHeight = 0;
// Keeps track of if the view is shown
var updating;
var listening = false;

// call api and listen for response to call
function callAPI(call, callback) {
	IPC.sendToHost('api-call', call);
	// prevents adding duplicate listeners
	if (!listening) IPC.on(call, callback);
}

function formatSiacoin(baseUnits) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(baseUnits).dividedBy(ConversionFactor);
	return display + ' SC';
}

function update() {
	callAPI('/wallet/status', function(err, result) {
		balance = formatSiacoin(result.Balance) || balance;
		document.getElementById('balance').innerHTML = 'Balance: ' + balance;
	});
	callAPI('/gateway/status', function(err, result) {
		peerCount = result.Peers.length || peerCount;
		document.getElementById('peers').innerHTML = 'Peers: ' + peerCount;
	});
	callAPI('/consensus', function(err, result) {
		blockHeight = result.Height || blockHeight;
		document.getElementById('block-height').innerHTML = 'Block Height: ' + blockHeight;
	});
	listening = true;
}

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	//IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 })
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
	
	// Call the API regularly to update page
	updating = setInterval(update, 1000);
}

function kill() {
	clearInterval(updating);
}
