// main.js, the entry point of the plugin, handles updating the Overview fields
'use strict';

window.onload = function Overview() {
	var balance
	var peers = document.getElement
	var blockHeight

	function update() {
		eBalance.innerHTML = data.wallet.Balance;
		ePeers.innerHTML = "Peers: " + data.peer.Peers.length;
		eBlockHeight.innerHTML = "Block Height: " + data.consensus.Height;
	}
};
