'use strict';

// DEVTOOL: uncomment to bring up devtools on plugin view
// IPCRenderer.sendToHost('devtools');

// Node modules
const siad = require('sia.js');
const $ = require('jquery');
const files = require('./files.js');

// Keeps track of if the view is shown
var updating;

// Convert to Siacoin
// TODO: Enable commas for large numbers
function convertSiacoin(hastings) {
	var number = new BigNumber(Math.round(hastings).toString());
	var ConversionFactor = new BigNumber(10).pow(24);
	return number.dividedBy(ConversionFactor).round(2);
}

// Update capsule values with renter status
// TODO /renter/status is deprecated: get price estimate from hostdb instead
function updateStatus(result) {
	var priceDisplay = convertSiacoin(result.Price) + ' S / GB (estimated)';
	$('#price.pod').text(priceDisplay);

	var hostsDisplay = result.KnownHosts + ' known hosts';
	$('#host-count.pod').text(hostsDisplay);
}

// Regularly update the file library and status
function update() {
	siad.apiCall('/renter/files/list', files.updateList);
	siad.apiCall('/renter/status', updateStatus);
	
	updating = setTimeout(update, 15000);
}

// Called upon showing
IPCRenderer.on('shown', update);
// Called upon transitioning away from this view
IPCRenderer.on('hidden', function() {
	clearTimeout(updating);
});
