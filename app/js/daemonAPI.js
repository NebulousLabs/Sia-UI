// daemonAPI.js gives plugins and the UI easy access to the API.

// Elements used across this file. GCed after file execution
'use strict';

// When required, daemonAPI gives its functions to the requirer that perform
// API calls to the siad port specified by config
module.exports = function daemonAPI(config) {
	// Encapsulated 'private' elements
	var port = config.siadAddress;

	// getCall does the dirty work for API calls
	// Callback is returned with (err, data)
	// TODO: allow customizability, not just GET calls
	function getCall(url, params, callback) {
		// the function can use JSON, but turns them into strings first
		if (typeof params !== 'string') {
			params = JSON.stringify(params);
		}
		// make request
		var request = new XMLHttpRequest();
		request.open('GET', port + url, true);

		// add response listeners
		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				// Success!
				callback(null, JSON.parse(this.response));
			} else {
				// Error code returned
				callback(new Error('Server reached, Error: ' + this.status));
			}
		};
		request.onerror = function() {
			// There was a connection error of some sort
			callback(new Error('Connection error, API server not reached'));
		};

		// actually send the request
		request.send(params);
	}

	// expose 'public' elements and functions
	return {
		getCall: getCall
	};
};
