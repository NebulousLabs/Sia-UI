// daemonManager.js provides functionality to start and deal with siad

// Elements used across this file. GCed after file execution
'use strict';
const Process = require("child_process").spawn;
const Path = require("path");
const Fs = require('fs');
const IPC = require('ipc');
var APIJS = require('./daemonAPI');

// When required, daemonManager should be initialized with a config object to
// initialize siad as a background process. 
module.exports = (function daemonManager() {
	// Encapsulated 'private' elements
	var siadPath;
	var command;
	var address;

	// setConfig() sets variables, then passes the config to the api to serve requests
	// Callback, if there is one, returns no arguments
	function setConfig(config, callback) {
		siadPath = Path.join(config.depsPath, 'Sia');
		command = config.siadCommand;
		address = config.siadAddress;
		callback();
	}

	// touchSiad() detects whether siad is running on the current address
	function touchSiad(isRunning, isNotRunning) {
		APIJS.getCall(address + '/consensus/status', function(err, data) {
			if (!err) {
				isRunning();
			} else {
				isNotRunning();
			}
		});
	}
	
	// ifRunning() executes callback if siad is running
	function ifRunning(callback) {
		touchSiad(callback, function() {});
	}

	// ifNotRunning() executes callback if siad is not running
	function ifNotRunning(callback) {
		touchSiad(function() {}, callback);
	}

	// start() starts the daemon as a long running background process
	function start(callback) {
		console.log('starting siad');
		ifRunning(function() {
			console.error('attempted to start siad when it was already running');
			return;
		});
		// daemon as a background process logs output to files
		var out = Fs.openSync(Path.join(siadPath, 'daemonOut.log'), 'a');
		var err = Fs.openSync(Path.join(siadPath, 'daemonErr.log'), 'a');
		// daemon process has to be detached without parent stdio pipes
		var processOptions = {
			detached: true,
			stdio: [ 'ignore', out, err ],
			cwd: siadPath 
		};
		var daemonProcess = new Process(command, processOptions);
		daemonProcess.unref();
		
		// post start logic
		callback(daemonProcess);
	}

	// stop() stops the daemon with an API call to the address
	function stop() {
		console.log('stopping siad');
		ifNotRunning(function() {
			console.err('attempted to stop siad when it was not running');
			return;
		});
		APIJS.getCall(address + '/daemon/stop', function(err, data) {
			console.assert(!err && data);
			console.log(data);
		});
	}

	// printCall() prints the results of the call
	function printCall(err, callResult) {
		if (err) {
			console.error(err);
		} else {
			console.log(callResult);
		}
	}

	// DEVTOOL: testCalls() for whether API calls work from the UI-perspective
	function testCalls() {
		APIJS.getCall(address + '/consensus/status', printCall);
		APIJS.getCall(address + '/gateway/status', printCall);
		APIJS.getCall(address + '/host/status', printCall);
		APIJS.getCall(address + '/miner/status', printCall);
		APIJS.getCall(address + '/wallet/status', printCall);
		APIJS.getCall(address + '/blockexplorer/status', printCall);
	}

	// addPort() interprets a call into a call object with the full url
	function addPort(call) {
		// Interpret address-only calls as 'GET'
		if (typeof call === 'string') {
			call = {url: call};
		}
		// Add the localhost and port to the url
		call.url = address + call.url;
		return call;
	}

	// apiCall() takes a call object or array of and returns the result
	// callback(err, result); err is null if call was successful
	// callback(errs, results); errs and results are same size arrays
	function apiCall(arg, callback) {
		if (Array.isArray(arg)) {
			var calls = [];
			arg.forEach(function(call) {
				calls.push(addPort(call));
			});
			APIJS.makeCalls(calls, callback);
		} else {
			APIJS.makeCall(addPort(arg), callback);
		}
	}

	// init() sets config and starts the daemon if it isn't on
	function init(config) {
		setConfig(config, function() {
			ifNotRunning(start);
			// DEVTOOL: ensure api calls are working
			//ifRunning(testCalls);
		});
	}

	// expose 'public' elements and functions
	return {
		setConfig: setConfig,
		start: start,
		stop: stop,
		init: init,
		call: apiCall,
	};
})();
