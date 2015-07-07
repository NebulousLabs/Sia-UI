// daemonAPI.js gives plugins and the UI easy access to the API.

// Elements used across this file. GCed after file execution
'use strict';

// When required, daemonAPI gives its functions to the requirer. These
// functions perform API calls to the siad port specified by setConfig
module.exports = (function daemonAPI() {
	// Encapsulated 'private' elements
	var port;

	// apiCall does the dirty work for API calls
	// Callback is returned with either (err) or (null, data)
	function apiCall(type, url, params, callback) {
		// the function can use JSON, but turns them into strings first
		if (typeof params !== 'string') {
			params = JSON.stringify(params);
		}

		// make request
		var request = new XMLHttpRequest();
		request.open('GET', port + url, true);

		// add response listeners tied to the callback response
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

	// This module is mostly a gateway to javascript versions of the API calls
	// and thus mostly has public functions
	return {
		// setConfig initializes the module based on the config and facilitates
		// easy settings changing
		setConfig: function (config) {
			port = config.siadAddress;
		},
		// getCall does a get request to the API
		// Callback is returned with either (err) or (null, data)
		getCall: function (url, callback) {
			apiCall('GET', url, {}, callback);
		},
		// postCall does a post request to the API
		// Callback is returned with either (err) or (null, data)
		postCall: function (url, params, callback) {
			apiCall('POST', url, params, callback);
		}
	};
})();
