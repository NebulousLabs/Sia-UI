'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Variables to store values
var b = 0;
var p = 0;
var h = 0;
// Keeps track of if the view is shown
var updating;

function callAPI() {
	// Variables to store API call values
	var calls = ['/wallet/status', '/gateway/status', '/consensus/status'];
	IPC.sendToHost('api-call', calls);
}

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	//IPC.sendToHost('devtools');
	
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

	var siaConversionFactor = Math.pow(10,27);
	var display = parseFloat((baseUnits/siaConversionFactor).toFixed(1));

	// Indicate if the user has some value with a last digit of '1'
	if (baseUnits > 0 && string === parseFloat((0).toFixed(1))) {
		string = parseFloat((0).toFixed(precision).substring(0,precision-1) + "1");
	}

	return display + " KS";
}

function update(results) {
	if (results.length === 3) {
		b = formatKSiacoin(results[0].Balance) || b;
		p = results[1].Peers.length || p;
		h = results[2].Height || h;
	}

	// update HTML
	document.getElementById('balance').innerHTML = b;
	document.getElementById('peers').innerHTML = "Peers: " + p;
	document.getElementById('blockheight').innerHTML = "Block Height: " + h;
}

IPC.on('api-results', update);
