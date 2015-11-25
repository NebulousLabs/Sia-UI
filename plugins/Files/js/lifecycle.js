'use strict';

// Regularly update the file library and status
function update() {
	IPCRenderer.sendToHost('api-call', '/renter/files/list', 'update-list');
	IPCRenderer.sendToHost('api-call', '/renter/status', 'update-status');
	
	updating = setTimeout(update, 15000);
}

// On receiving api call result for file list
addResultListener('update-list', function(result) {
	// sort alphabetically by nickname
	result.sort(function(a, b) {
		return a.Nickname.localeCompare(b.Nickname);
	});
	// clear existing file list
	eID('file-browser').innerHTML = '';
	// insert each file
	result.forEach(updateFile);
});

// Convert to Siacoin
// TODO: Enable commas for large numbers
function convertSiacoin(hastings) {
	// TODO: JS automatically loses precision when taking numbers from the API.
	// This deals with that imperfectly
	var number = new BigNumber(Math.round(hastings).toString());
	var ConversionFactor = new BigNumber(10).pow(24);
	return number.dividedBy(ConversionFactor).round();
}

// Update capsule values with renter status
// TODO /renter/status is deprecated: get price estimate from hostdb instead
addResultListener('update-status', function(result) {
	var priceDisplay = convertSiacoin(result.Price).toFixed(2) + ' S / GB (estimated)';
	eID('price').innerHTML = priceDisplay;

	var hostsDisplay = result.KnownHosts + ' known hosts';
	eID('host-count').innerHTML = hostsDisplay;
});

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

