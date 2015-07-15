// index.js, the entry point of the plugin, handles updating the Overview fields
'use strict';

// Library for communicating with Sia-UI
const IPC = require('ipc');
var siamath = require('../../dependencies/siamath.js');

// Pointers to markup elements
var eBalance;
var ePeers;
var eBlockHeight;
// Variables to store API call values
var calls = ['/wallet/status', '/gateway/status', '/consensus/status'];
// Variables to store call results
var b = 0;
var p = 0;
var h = 0;

window.onload = function init() {
	// Pointers to markup elements
	eBalance = document.getElementById('balance');
	ePeers = document.getElementById('peers');
	eBlockHeight = document.getElementById('blockheight');

	// DEVTOOL: uncomment to bring up devtools on plugin view
	//IPC.sendToHost('devtools', 'toggle');

	// Call the API regularly to update page
	setInterval(function() {
		IPC.sendToHost('api-call', calls);
	}, 1000);
};

IPC.on('api-results', function update(results) {
	if (results.length === 3) {
		b = siamath.fksiacoin(results[0].Balance) || b;
		p = results[1].Peers.length || p;
		h = results[2].Height || h;
	}
	// update HTML
	eBalance.innerHTML = b;
	ePeers.innerHTML = "Peers: " + p;
	eBlockHeight.innerHTML = "Block Height: " + h;
});

