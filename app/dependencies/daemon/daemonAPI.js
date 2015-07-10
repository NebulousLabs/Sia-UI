// daemonAPI.js gives plugins and the UI easy access to the API.

// Elements used across this file. GCed after file execution
'use strict';

// apiCall() does the dirty work for API calls
// Callback is returned with either (err) or (null, callResult)
function apiCall(type, url, params, callback) {
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
			console.log(this);
		}
	};
	request.onerror = function() {
		// There was a connection error of some sort
		callback(new Error('Server not reached'));
	};

	// actually send the request
	request.send(params);
} 

// discernCall() takes an unknown call object, and apropriately calls apiCall()
// Callback is returned with either (err) or (null, callResult)
function discernCall(call, callback) {
	// Extract call attributes, default call is 'GET'
	var type = call.type || 'GET';
	var url = call.url;
	var params = call.params || {};

	// The function can use JSON, but turns them into strings first
	if (typeof params !== 'string') {
		params = JSON.stringify(params);
	}

	// Detect improper calls, each one needs a url and a callback response
	if (!url) {
		callback(new Error('Improper API call!'));
	} else {
		// Make the call
		apiCall(type, url, params, callback);
	}
}

// When required, daemonAPI can be used for its functions to perform API calls
// This module is just a javascript gateway to make API calls
module.exports = {
	// getCall specifically does a get request to the API
	// Callback is returned with either (err) or (null, callResult)
	getCall: function getCall(url, callback) {
		apiCall('GET', url, '', callback);
	},
	// postCall specifically does a post request to the API
	// Callback is returned with either (err) or (null, callResult)
	postCall: function postCall(url, params, callback) {
		apiCall('POST', url, params, callback);
	},
	// makeCalls() handles multiple API calls that could be either GET or POST
	// Callback is returned with callResults object, filled with either an
	// error or the API call response per call with key of call.url
	makeCalls: function makeCalls(calls, callback) {
		var callResults = {};
		calls.forEach(function(call) {
			discernCall(call, function(err, callResult) {
				if (err) {
					callResults[call.address] = err;
				}
				else {
					callResults[call.address] = callResult;
				}
			});
		});
		callback(callResults);
	},
};
