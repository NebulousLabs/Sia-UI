// daemonAPI.js gives plugins and the UI easy access to the API.
'use strict';

// apiCall() does the dirty work for API calls
// callback(err, result); if success, err is null
function apiCall(url, type, params, callback) {
	// Detect improper calls, each one needs a url
	if (!url) {
		process.nextTick(function() {
			callback(new Error('Improper API call!'));
		});
		return;
	}

	// make request
	var request = new XMLHttpRequest();
	request.open(type, url, true);

	// add response listeners tied to the callback response
	request.onload = function() {
		if (this.status >= 200 && this.status < 400) {
			// Success!
			callback(null, JSON.parse(this.response));
		} else {
			// Error returned
			callback(this);
		}
	};
	// There was a connection error of some sort
	request.onerror = function() {
		callback(new Error('Server not reached'));
	};

	// actually send the request
	request.send(params);
} 

// discernCall() takes an array of call params and calls the api
// callback(err, result); if success, err is null
function discernCall(call, callback) {
	// Extract call attributes, default call is 'GET'
	var url = call[0];
	var type = call[1] || 'GET';
	var params = call[2] || {};

	// The function can use JSON, but turns them into strings first if (typeof
	// params !== 'string') {
	var JSON;
	if (JSON && typeof JSON.parse === 'function') {
		params = JSON.stringify(params);
	}

	// Make the call
	apiCall(url, type, params, callback);
}

// When required, daemonAPI can be used for its functions to perform API calls
// This module is just a javascript gateway to make API calls
module.exports = {
	// getCall specifically does a get request to the API
	// callback(err, result); if success, err is null
	getCall: function getCall(url, callback) {
		apiCall(url, 'GET', '', callback);
	},
	// postCall specifically does a post request to the API
	// callback(err, result); if success, err is null
	postCall: function postCall(url, params, callback) {
		apiCall(url, 'POST', params, callback);
	},
	makeCall: discernCall,
};
