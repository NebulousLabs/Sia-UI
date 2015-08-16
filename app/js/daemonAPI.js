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

/**
 * Creates an XMLHttpRequest to send
 * @param {string} url - The address (usually localhost) and port of siad
 * @param {string} type - The call type, such as 'POST' or 'GET'
 * @param {Object} args - The arguments to send with the call
 * @param {apiResponse} callback
 * @private
 */
function sendCall(url, type, args, callback) {
	// Detect improper calls, each one needs a url
	if (!url || !type || !args) {
		process.nextTick(function() {
			callback(new Error('Improper API call!'));
		});
		return;
	}
	// make request via jquery
	$.ajax({
		url: url,
		type: type,
		success: function(responseData, textStatus, jqXHR) {
			callback(null, JSON.parse(responseData), textStatus, jqXHR);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			var errcode = textStatus + ' ' + jqXHR.status + ' ' + errorThrown;
			var errmsg = jqXHR.responseText;
			callback(errcode + ' ' + errmsg);
		},
		data: args
	});
} 

/**
 * Takes any call object and makes the correct call
 * @param {apiCall} call - The call object with parameters
 * @param {apiResponse} callback
 * @private
 */
function discernCall(call, callback) {
	// Extract call attributes, default call is 'GET'
	var url = call.url;
	var type = call.type || 'GET';
	var args = call.args || {};

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
