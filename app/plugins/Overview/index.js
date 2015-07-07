// main.js, the entry point of the plugin, handles updating the Overview fields
'use strict';
var ipc = require('ipc');

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

ipc.on('init', function() {
	console.log('RECEIVED INIT')
	init();
});
ipc.on('update', update);

console.log(ipc);
