'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Variable to store api result values
var wallet = {};
// Encryption password, for now treated as the primary seed
var password;
var remainingAddresses;
var currentHeight;
// Keeps track of if the view is shown
var updating;

// Make API calls, sending a channel name to listen for responses
function update() {
	updating = setTimeout(update, 15000);
}

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}
