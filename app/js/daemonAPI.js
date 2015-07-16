// daemonAPI.js gives plugins and the UI easy access to the API.
'use strict';

// apiCall() does the dirty work for API calls
// callback(err, result); if success, err is null
function apiCall(type, url, params, callback) {
	// Detect improper calls, each one needs a url
	if (!url) {
		callback(new Error('Improper API call!'));
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
	request.onerror = function() {
		// There was a connection error of some sort
		callback(new Error('Server not reached'));
	};

	// actually send the request
	request.send(params);
} 

// discernCall() takes a call object of this format, and calls the api with it
// {
//   url: string
//   type: string (optional)
//   params: string (optional)
// }
// callback(err, result); if success, err is null
function discernCall(call, callback) {
	// Extract call attributes, default call is 'GET'
	var url = call.url;
	var type = call.type || (call.params) ? 'POST': 'GET';
	var params = call.params || {};

	// The function can use JSON, but turns them into strings first if (typeof
	// params !== 'string') {
	var JSON;
	if (JSON && typeof JSON.parse === 'function') {
		params = JSON.stringify(params);
	}

	// Make the call
	apiCall(type, url, params, callback);
}

// When required, daemonAPI can be used for its functions to perform API calls
// This module is just a javascript gateway to make API calls
module.exports = {
	// getCall specifically does a get request to the API
	// callback(err, result); if success, err is null
	getCall: function getCall(url, callback) {
		apiCall('GET', url, '', callback);
	},
	// postCall specifically does a post request to the API
	// callback(err, result); if success, err is null
	postCall: function postCall(url, params, callback) {
		apiCall('POST', url, params, callback);
	},
	makeCall: discernCall,
	// makeCalls() handles multiple API calls that could be either GET or POST
	// callback(results); results is an array of error or JSON respectively
	makeCalls: function makeCalls(calls, callback) {
		var results = [];
		calls.forEach(function(call, index) {
			discernCall(call, function(err, result) {
				if (err) {
					results[index] = err;
				}
				else {
					results[index] = result;
				}
				if (index === calls.length - 1) {
					callback(results);
				}
			});
		});
	},
};
