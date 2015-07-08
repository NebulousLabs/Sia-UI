// index.js, the entry point of the plugin, handles updating the Overview fields
'use strict';
var API = require('../../dependencies/Sia/daemonAPI.js')

init();

function init() {
	console.log('TEST');
	// var pointers to markup elements
	/*
	var balance = document.getElementByID('balance');
	var peers = document.getElementByID('peers');
	var blockHeight = document.getElementByID('blockHeight');
	*/
	ipc.sendToHost('YOYO TEST');
}

function update(callResult) {
	/*
	eBalance.innerHTML = data.wallet.Balance;
	ePeers.innerHTML = "Peers: " + data.peer.Peers.length;
	eBlockHeight.innerHTML = "Block Height: " + data.consensus.Height;
   */
}

/* TODO: Generalize init and update handling to Sia-UI through IPC?
 * Instead of update all plugins constantly like old-UI, plugins can specify
 * frequency (e.g. .5Hz) or on condition (e.g. on open)
ipc.on('init', function() {
	console.log('RECEIVED INIT')
	init();
});
ipc.on('update', update);
*/
