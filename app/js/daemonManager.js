// daemonManager.js provides functionality to start and deal with siad

// Elements used across this file. GCed after file execution
'use strict';
const Spawn = require("child_process").spawn;
const Path = require("path");
const Fs = require('fs');
var API = require('./daemonAPI');

// When required, daemonManager can be called with a config
// object to initialize siad as a background process
module.exports = function daemonManager(config) {
	// Encapsulated 'private' elements
	var path = config.siadPath;
	var command = config.siadCommand;
	API = API(config);

	// testCalls logs the output from all API calls
	function printTest(err, data) {
		if (err) {
			console.error(err);
		}
		if (data) {
			console.log(data);
		}
	}

	// testCalls logs the output from all API calls
	function testCalls() {
		API.getCall('/consensus/status', {}, printTest);
		API.getCall('/consensus/synchronize', {}, printTest);
		API.getCall('/daemon/version', {}, printTest);
		API.getCall('/daemon/updates/check', {}, printTest);
	}
	
	// starts the daemon as a long running background process. siad already
	// bounces if the port is in use
	function start(callback) {
		// daemon as a background process logs output to files
		var out = Fs.openSync(Path.join(path, 'daemonOut.log'), 'a');
		var err = Fs.openSync(Path.join(path, 'daemonErr.log'), 'a');
		// daemon process has to be detached without parent stdio pipes
		var processOptions = {
			detached: true,
			stdio: [ 'ignore', out, err ],
			cwd: path 
		};
		var daemonProcess = Spawn(command, processOptions);
		daemonProcess.unref();
		// call callback function, it would be
		// operations that should happen after
		// siad was launched	
		callback();
	}

	function stop() {
		
	}

	// starts the daemon, then passes the config to the api to serve requests
	function init() {
		start(testCalls);
	}

	// initialize siad and the daemonAPI
	init();

	// expose 'public' elements and functions
	return {
		start: start,
		stop: stop
	}
};
