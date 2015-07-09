// daemonManager.js provides functionality to start and deal with siad

// Elements used across this file. GCed after file execution
'use strict';
const Process = require("child_process").spawn;
const Path = require("path");
const Fs = require('fs');
var APIJS = require('../dependencies/daemon/daemonAPI');

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
	
	// ifRunning() is a shortcut use of touchSiad
	function ifRunning(callback) {
		touchSiad(callback, function() {});
	}

	// ifNotRunning() is a shortcut use of touchSiad
	function ifNotRunning(callback) {
		touchSiad(function() {}, callback);
	}

	// start() starts the daemon as a long running background process
	function start() {
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

	// init() sets config and starts the daemon if it isn't on
	function init(config) {
		setConfig(config, function() {
			ifNotRunning(start);
		});
	}

	// expose 'public' elements and functions
	return {
		setConfig: setConfig,
		start: start,
		stop: stop,
		init: init,
	};
})();
