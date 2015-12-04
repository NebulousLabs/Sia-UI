'use strict';

// Library for making requests
const Request = require('request');

// Necessary node libraries
// TODO: Path is in the global scope, but this file can soon be it's own node
// package as a siad wrapper. So with that, it will need its own require
// statements for node libraries
//const Path = require('path');
const Util = require('util');
const EventEmitter = require('events');

/**
 * DaemonManager, a closure, initializes siad as a background process and
 * provides functions to interact with it
 * @class DaemonManager
 */
function DaemonManager() {
	// siad details with default values
	var siad = {
		path: Path.join(__dirname, 'Sia'),
		address: 'http://localhost:9980',
		command: process.platform === 'win32' ? 'siad.exe' : 'siad',
		headers: {
			'User-Agent': 'Sia-Agent',
		},
	};
	// Object to be returned
	var self = this;
	// Track if Daemon is running
	self.running = false;
	// Inherit `EventEmitter` properties
	EventEmitter.call(self);

	/**
	 * Relays calls to daemonAPI with the localhost:port address appended
	 * @function DaemonManager#apiCall
	 * @param {apiCall} call - function to run if Siad is running
	 * @param {apiResponse} callback
	 */
	function apiCall(call, callback) {
		// Things to prevent unimportant errors
		if (typeof call === 'string') {
			call = { url: call };
		}
		callback = callback || function() {};

		// Setup request
		call.url = siad.address + call.url;
		call.json = true;
		call.headers = siad.headers;
		return new Request(call, function (error, response, body) {
			if (!error && response.statusCode !== 200) {
				// siad's error is returned as body
				error = body;
			} 
			callback(error, body);
		});
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
				cwd: siad.path,
			};
			const Process = require('child_process').spawn;
			var daemonProcess = new Process(siad.command, processOptions);

			// Listen for siad erroring
			// TODO: How to change this error to give more accurate hint. Does this
			// work?
			daemonProcess.on('error', function (error) {
				if (error === 'Error: spawn ' + siad.command + ' ENOENT') {
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

	// Sends a stop call to the daemon
	function stop(callback) {
		apiCall('/daemon/stop', callback);
	}

	/**
	 * Sets the member variables based on the passed config
	 * @param {config} c - the config object derived from config.json
	 * @param {callback} callback - returns if siad is running
	 */
	function configure(settings, callback) {
		siad.path = settings.siad.path || siad.path;
		siad.address = settings.siad.address || siad.address;
		siad.command = settings.siad.command || siad.command;
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
}

// Inherit functions from `EventEmitter`'s prototype
Util.inherits(DaemonManager, EventEmitter);

module.exports = new DaemonManager();
