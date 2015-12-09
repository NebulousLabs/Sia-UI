'use strict';

// Keeps track of if the view is shown
var updating;

// Convert to Siacoin
// TODO: Enable commas for large numbers
function convertSiacoin(hastings) {
	var number = new BigNumber(Math.round(hastings).toString());
	var ConversionFactor = new BigNumber(10).pow(24);
	return number.dividedBy(ConversionFactor).round();
}

// Update capsule values with renter status
// TODO /renter/status is deprecated: get price estimate from hostdb instead
function updateStatus(result) {
	var priceDisplay = convertSiacoin(result.Price).toFixed(2) + ' S / GB (estimated)';
	eID('price').innerHTML = priceDisplay;

	var hostsDisplay = result.KnownHosts + ' known hosts';
	eID('host-count').innerHTML = hostsDisplay;
}

// Regularly update the file library and status
function update() {
	Siad.apiCall('/renter/files/list', updateList);
	Siad.apiCall('/renter/status', updateStatus);
	
	updating = setTimeout(update, 15000);
}

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPCRenderer.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}

