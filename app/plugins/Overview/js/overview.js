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
	IPC.sendToHost('api-call', '/wallet', 'balance-update');
	IPC.sendToHost('api-call', '/gateway/status', 'peers-update');
	IPC.sendToHost('api-call', '/consensus', 'height-update');
	updating = setTimeout(update, 1000);
}

// Updates element text
function updateField(err, caption, value, elementID) {
	if (err) {
		console.error(err);
	} else if (value === null) {
		console.error('Unknown occurence: no error and no result from API call!');
	} else {
		document.getElementById(elementID).innerHTML = caption + value;
	}
}

// Convert to Siacoin
function formatSiacoin(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display + ' S';
}

// Called by the UI upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called by the UI upon transitioning away from this view
function stop() {
	clearTimeout(updating);
}

// Ask UI to show tooltip bubble
function tooltip(message, element) {
	var rect = element.getBoundingClientRect();
	IPC.sendToHost('tooltip', message, {
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right,
		height: rect.height,
		width: rect.width,
		length: rect.length,
	});
}

// Define IPC listeners and update DOM per call
IPC.on('balance-update', function(err, result) {
	var value = result ? formatSiacoin(result.ConfirmedSiacoinBalance) : null;
	updateField(err, 'Balance: ', value, 'balance');
});
IPC.on('peers-update', function(err, result) {
	var value = result ? result.Peers.length : null;
	updateField(err, 'Peers: ', value, 'peers');
});
IPC.on('height-update', function(err, result) {
	var value = result ? result.Height : null;
	updateField(err, 'Block Height: ', value, 'height');
});

