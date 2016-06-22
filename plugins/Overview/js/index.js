'use strict'

// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js')

// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 })
BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

// DEVTOOL: uncomment to bring up devtools on plugin view
// IPCRenderer.sendToHost('devtools');

// Returns if API call has an error or null result
function errored(err, result) {
	if (err) {
		SiaAPI.showError({title: 'Error', content: err.toString()})
		return true
	} else if (!result) {
		SiaAPI.showError({title: 'Error', content: err.toString()})
		return true
	}
	return false
}

// Convert to Siacoin
function formatSiacoin(hastings) {
	var number = new BigNumber(hastings)
	var ConversionFactor = new BigNumber(10).pow(24)
	// Display two digits of Siacoin
	var display = number.dividedBy(ConversionFactor).round(2) + ' S'
	return display
}

// Update wallet balance and lock status from call result
function updateWallet(err, result) {
	if (errored(err, result)) {
		return
	}

	var unlocked = result.unlocked
	var unencrypted = !result.encrypted

	var lockText = unencrypted ? 'New Wallet' : unlocked ? 'Unlocked' : 'Locked'
	document.getElementById('lock').innerText = lockText

	var bal = unlocked ? formatSiacoin(result.confirmedsiacoinbalance) : '--'
	document.getElementById('balance').innerText = 'Balance: ' + bal
}

// Update peer count from call result
function updatePeers(err, result) {
	if (errored(err, result)) {
		return
	}
	document.getElementById('peers').innerText = 'Peers: ' + result.peers.length
}

// Update block height from call result
function updateHeight(err, result) {
	if (errored(err, result)) {
		return
	}
	document.getElementById('height').innerText = 'Block Height: ' + result.height
}

// Make API calls, sending a channel name to listen for responses
function update() {
	SiaAPI.call('/wallet', updateWallet)
	SiaAPI.call('/gateway', updatePeers)
	SiaAPI.call('/consensus', updateHeight)
	setTimeout(update, 5000)
}

update()
