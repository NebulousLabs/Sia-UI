// main.js, the entry point of the plugin, handles updating the Overview fields
'use strict';
const ipc = require('ipc');

window.onload = function Overview() {
	// var pointers to markup elements
	var balance
	var peers = document.getElement
	var blockHeight

	ipc.on('update', update);
	function update() {
		eBalance.innerHTML = data.wallet.Balance;
		ePeers.innerHTML = "Peers: " + data.peer.Peers.length;
		eBlockHeight.innerHTML = "Block Height: " + data.consensus.Height;
	}
};

