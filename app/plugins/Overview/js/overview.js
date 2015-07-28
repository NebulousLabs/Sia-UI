'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Keeps track of if the view is shown
var updating;
// Keeps track of if listeners were already instantiated
var listening = false;

// Call API and listen for response to call
function callAPI(call, callback) {
	IPC.sendToHost('api-call', call);
	// prevents adding duplicate listeners
	if (!listening) IPC.on(call, callback);
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

// Define API calls and update DOM per call
function update() {
	callAPI('/wallet/status', function(err, result) {
		updateField(err, 'Balance: ', formatSiacoin(result.Balance), 'balance');
	});
	callAPI('/gateway/status', function(err, result) {
		updateField(err, 'Peers: ', result.Peers.length, 'peers');
	});
	callAPI('/consensus/status', function(err, result) {
		updateField(err, 'Block Height: ', result.Height, 'block-height');
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
	
	// Call the API regularly to update page
	updating = setInterval(update, 1000);
}

// Called upon transitioning away from this view
function kill() {
	clearInterval(updating);
}
