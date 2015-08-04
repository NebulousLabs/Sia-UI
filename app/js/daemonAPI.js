'use strict';
/**
 * The callback from an apiCall
 * @callback apiResponse
 * @param {Object} error - null if the call was successful
 * @param {Object} response - The resulting data from making the call
 */

/**
 * The call object to store information necessary to a call to a RESTful API
 * @typedef {Object} apiCall
 * @property {string} url - The address (usually localhost) and port of siad
 * @property {string} type - The call type, such as 'POST' or 'GET'
 * @property {Object} args - The arguments to send with the call
 */

// Creates an XMLHttpRequest to send
function sendCall(url, type, args, callback) {
	// Detect improper calls, each one needs a url
	if (!url || !type || !args) {
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
	request.send(args);
} 

// Takes any call object and makes the correct call
function discernCall(call, callback) {
	// Extract call attributes, default call is 'GET'
	var url = call.url;
	var type = call.type || 'GET';
	var args = call.args || {};

	// The function can use JSON, but turns them into strings first
	var JSON;
	if (JSON && typeof JSON.parse === 'function') {
		args = JSON.stringify(args);
	}

	// Make the call
	sendCall(url, type, args, callback);
}

/**
 * Can be used for its functions to perform API calls
 * @module DaemonAPI
 */
module.exports = {
	/**
	 * Performs a 'GET' call
	 * @param {string} url - The url to send the call to
	 * @param {apiResponse} callback
	 */
	getCall: function getCall(url, callback) {
		sendCall(url, 'GET', '', callback);
	},
	/**
	 * Performs a 'POST' call
	 * @param {string} url - The url to send the call to
	 * @param {string|Object} url - The arguments to send with the call
	 * @param {apiResponse} callback
	 */
	postCall: function postCall(url, args, callback) {
		sendCall(url, 'POST', args, callback);
	},
	/**
	 * Performs any API call
	 * @param {apiCall} call - The call object with parameters
	 * @param {apiResponse} callback
	 */
	makeCall: discernCall,
};
