// index.js, the entry point of the plugin, handles updating the Overview fields
'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Javascript functions for ease of using the API
var API = require('../../dependencies/daemon/daemonAPI.js');

// Pointers to markup elements
var eBalance = document.getElementById('balance');
var ePeers = document.getElementById('peers');
var eBlockHeight = document.getElementById('blockHeight');
// Variables to store API call values
var b, p, bh;

// Receive the configuration from Sia-UI
IPC.on('init', function(address) {
	// Start it all off
	setInterval(callAPI(address), 1000);
});

function update(err, callResult) {
	if (err) {
		console.error('API call failed> ' + err);
	}
	
	// update values
	b = callResult.Balance || b;
	p = callResult.Peers.length || p;
	bh = callResult.Height || bh;

	// update HTML
	eBalance.innerHTML = b;
	ePeers.innerHTML = "Peers: " + p;
	eBlockHeight.innerHTML = "Block Height: " + bh;
}

function updateValue(element, newValue) {
	element.innerHTML = newValue;
}

function callAPI(address) {
	API.getCall(address + '/wallet/status', update);
	API.getCall(address + '/gateway/status', update);
	API.getCall(address + '/consensus/status', update);
}
