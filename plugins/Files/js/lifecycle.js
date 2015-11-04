'use strict';

// Regularly update the file library and status
function update() {
	IPC.sendToHost('api-call', '/renter/files/list', 'update-list');
	IPC.sendToHost('api-call', '/renter/status', 'update-status');
	
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
	// IPC.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}

