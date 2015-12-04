'use strict';

const util = require('util');
const EventEmitter = require('events');

/**
 * DaemonManager, a closure, initializes siad as a background process and
 * provides functions to interact with it
 * @class DaemonManager
 */
function DaemonManager() {
	// The location of the folder containing siad
	var siadPath;
	// The localhost:port (default is 9980)
	var siadAddress;
	// The command to start siad
	var siadCommand;
	// Object to be returned
	var self = this;
	// Track if Daemon is running
	self.running = false;
	// Inherit `EventEmitter` properties
	EventEmitter.call(self);

	/**
	 * Relays calls to daemonAPI with the localhost:port address appended
	 * @function DaemonManager#call
	 * @param {apiCall} call - function to run if Siad is running
	 * @param {apiResponse} callback
	 */
	function apiCall(call, callback) {
		// Interpret address-only calls as 'GET'
		if (typeof call === 'string') {
			call = {url: call};
		}
		// If no callback provided, have it be an empty function
		callback = callback || function() {};

		// Add the localhost address and port to the url and default values
		call.url = siadAddress + call.url;

		// Set success handler
		call.success = function(responseData, textStatus, jqXHR) {
			// Catches improperly constructed JSONs that JSON.parse would
			// normally return a weird error on
			try {
				callback(null, JSON.parse(responseData), textStatus, jqXHR);
			} catch(e) {
				callback('Malformed JSON result! Response was: ' + responseData);
			}
		};

		// Set error handler
		call.error = function(jqXHR, textStatus, errorThrown) {
			// jqXHR is the XmlHttpRequest that jquery returns back on error
			var errcode = textStatus + ' ' + jqXHR.status + ' ' + errorThrown + ' ' + jqXHR.responseText;
			callback(errcode);
		};

		// Make the call
		$.ajax(call);
	}

	/**
	 * Checks whether siad is running on the current address
	 * @function DaemonManager#ifRunning
	 * @param {callback} callback - returns if siad is running
	 */
	function ifRunning(is, not) {
		apiCall('/daemon/version', function(err) {
			self.running = !err;
			if (self.running) {
				is();
			} else {
				not();
			}
		});
	}

	// Polls the siad API until it comes online
	function waitUntilLoaded(callback) {
		ifRunning(callback, function() {
			setTimeout(function() {
				waitUntilLoaded(callback);
			}, 1000);
		});
	}
	
	// Starts the daemon as a long running background process
	function start(callback) {
		ifRunning(function() {
			callback(new Error('Attempted to start siad when it was already running'));
		}, function() {
			// Set siad folder as configured siadPath
			var processOptions = {
				cwd: siadPath,
			};
			var daemonProcess = new Process(siadCommand, processOptions);

			// Listen for siad erroring
			// TODO: How to change this error to give more accurate hint. Does this
			// work?
			daemonProcess.on('error', function (error) {
				if (error === 'Error: spawn ' + siadCommand + ' ENOENT') {
					error.message = 'Missing siad!';
				}
				self.emit('error', error);
			});
			daemonProcess.on('exit', function(code) {
				self.running = false;
				self.emit('exit', code);
			});

			// Wait until siad finishes loading to call callback
			waitUntilLoaded(callback);
		});
	}

	function stop(callback) {
		apiCall('/daemon/stop', callback);
	}

	/**
	 * Sets the member variables based on the passed config
	 * @param {config} c - the config object derived from config.json
	 * @param {callback} callback - returns if siad is running
	 */
	function configure(settings, callback) {
		siadPath = settings.siadPath;
		siadAddress = settings.siadAddress;
		siadCommand = settings.siadCommand;
		if (callback) {
			callback();
		}
	}

	// Make certain members public
	self.configure = configure;
	self.start = start;
	self.stop = stop;
	self.call = apiCall;
	self.ifRunning = ifRunning;
	return self;
};

// Inherit functions from `EventEmitter`'s prototype
util.inherits(DaemonManager, EventEmitter);

module.exports = new DaemonManager();
