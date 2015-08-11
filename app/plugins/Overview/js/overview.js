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
	if (!listening) {
		IPC.on(call, function(err, result) {
			if (err) {
				console.error(err);
			} else if (result) {
				callback(result);
			} else {
				console.error('Unknown occurence: no error and no result from callAPI!');
			}
		});
	}
}

// Convert to Siacoin
function formatSiacoin(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display + ' SC';
}

// Define API calls and update DOM per call
function update() {
	callAPI('/wallet/status', function(result) {
		document.getElementById('balance').innerHTML = 'Balance: ' + formatSiacoin(result.Balance);
	});
	callAPI('/gateway/status', function(result) {
		document.getElementById('peers').innerHTML = 'Peers: ' + result.Peers.length;
	});
	callAPI('/consensus/status', function(result) {
		document.getElementById('block-height').innerHTML = 'Block Height: ' + result.Height;
	});
	listening = true;
}

// Called upon showing
function show() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 });
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
	
	// Call the API regularly to update page
	updating = setInterval(update, 1000);
}

// Called upon transitioning away from this view
function hide() {
	clearInterval(updating);
}
