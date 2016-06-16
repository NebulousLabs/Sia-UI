// Retrieve host status information
const getStatus = function (callback) {
	SiaAPI.call('/host', function(result) {
		updateStatus(result, callback);
	});
}

// Announce host on the network
const announce = function (settings, callback) {
	settings = settings || null;
	SiaAPI.call({
		url: '/host/announce',
		method: 'POST',
		qs: settings,
	}, callback);
}

// Save hosting settings
const save = function (settings, callback) {
	// Send configuration call
	SiaAPI.call({
		url: '/host',
		method: 'POST',
		qs: settings,
	}, callback);
}
