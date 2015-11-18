'use strict';

// Library for communicating with Sia-UI
const IPC = require('electron').ipcRenderer;
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Keeps track of if the view is shown
var updating;

// Make API calls, sending a channel name to listen for responses
function update() {
	IPC.sendToHost('api-call', '/wallet', 'wallet-update');
	IPC.sendToHost('api-call', '/gateway/status', 'peers-update');
	IPC.sendToHost('api-call', '/consensus', 'height-update');
	updating = setTimeout(update, 5000);
}

// Updates element text
function updateField(err, caption, value, elementID) {
	if (err) {
		IPC.sendToHost('notify', err.toString(), 'error');
	} else if (value === null) {
		IPC.sendToHost('notify', 'API result seems to be null!', 'error');
	} else {
		document.getElementById(elementID).innerHTML = caption + value;
	}
}

// Convert to Siacoin
function formatSiacoin(hastings) {
	// TODO: JS automatically loses precision when taking numbers from the API.
	// This deals with that imperfectly, rounding to nearest hasting
	var number = new BigNumber(hastings);
	var ConversionFactor = new BigNumber(10).pow(24);
	// Display two digits of Siacoin
	var display = number.dividedBy(ConversionFactor).round(2) + ' S';
	return display;
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
IPC.on('wallet-update', function(event, err, result) {
	if (!result) {
		return;
	}

	var unlocked = result.unlocked;
	var encrypted = result.encrypted;
	if (!encrypted) {
		updateField(err, 'New Wallet', '', 'lock');
	} else if (unlocked) {
		updateField(err, 'Unlocked', '', 'lock');
	} else {
		updateField(err, 'Locked', '', 'lock');
	}

	var bal = formatSiacoin(result.confirmedsiacoinbalance);
	updateField(err, 'Balance: ', unlocked ? bal : '---', 'balance');
});
IPC.on('peers-update', function(event, err, result) {
	var value = result !== null ? result.Peers.length : null;
	updateField(err, 'Peers: ', value, 'peers');
});
IPC.on('height-update', function(event, err, result) {
	var value = result !== null ? result.height : null;
	updateField(err, 'Block Height: ', value, 'height');
});

