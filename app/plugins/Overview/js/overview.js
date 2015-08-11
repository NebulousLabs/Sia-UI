'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Keeps track of if the view is shown
var updating;

// Make API calls, sending a channel name to listen for responses
function update() {
	IPC.sendToHost('api-call', '/wallet/status', 'balance');
	IPC.sendToHost('api-call', '/gateway/status', 'peers');
	IPC.sendToHost('api-call', '/consensus/status', 'height');
	updating = setTimeout(update, 1000);
}

// Updates element text
function updateField(err, caption, newValue, elementID) {
	if (err) {
		console.error(err);
	} else if (newValue === null) {
		console.error('Unknown occurence: no error and no result from API call!');
	} else {
		document.getElementById(elementID).innerHTML = caption + newValue;
	}
}

// Convert to Siacoin
function formatSiacoin(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display + ' SC';
}

// Called upon showing
function show() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API regularly to update page
	updating = setTimeout(update, 0);
}

// Called upon transitioning away from this view
function hide() {
	clearTimeout(updating);
}

// Define IPC listeners and update DOM per call
IPC.on('balance', function(err, result) {
	updateField(err, 'Balance: ', formatSiacoin(result.Balance), 'balance');
});
IPC.on('peers', function(err, result) {
	updateField(err, 'Peers: ', result.Peers.length, 'peers');
});
IPC.on('height', function(err, result) {
	updateField(err, 'Block Height: ', result.Height, 'height');
});

