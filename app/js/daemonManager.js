// daemonManager.js provides functionality to start and deal with siad
'use strict';
const Process = require("child_process").spawn;
var APIJS = require('./js/daemonAPI');

// daemonManager should be initialized with a config object to initialize siad
// as a background process. 
var Daemon = (function() {
	var siaPath;
	var command;
	var address;

	// setConfig() sets variables, then passes the config to the api to serve requests
	// Callback, if there is one, returns no arguments
	function setConfig(config, callback) {
		siaPath = Path.join(config.depsPath, 'Sia');
		command = config.siadCommand;
		address = config.siadAddress;
		callback();
	}

	// apiCall() takes an array of call params, adds the siad
	// address to the url and returns the result callback(err,
	// result); err is null if call was successful
	function apiCall(call, callback) {
		// Add the localhost address and port to the url
		call[0] = address + call[0];
		APIJS.makeCall(call, callback);
	}

	// ifSiad() detects whether siad is running on the current address,
	// executing one of two functions based on the result
	function ifSiad(isRunning, isNotRunning) {
		if (!isRunning) {
			isRunning = function() {};
		}
		if (!isNotRunning) {
			isNotRunning = function() {};
		}
		apiCall(['/consensus/status'], function(err) {
			if (!err) {
				isRunning();
			} else if (err) {
				isNotRunning();
			}
		});
	}

	// start() starts the daemon as a long running background process
	function start() {
		ifSiad(function() {
			console.error('attempted to start siad when it was already running');
			return;
		}, function() {
			console.log('starting siad');
		});
		// daemon as a background process logs output to files
		var out = Fs.openSync(Path.join(siaPath, 'daemonOut.log'), 'a');
		var err = Fs.openSync(Path.join(siaPath, 'daemonErr.log'), 'a');
		// daemon process has to be detached without parent stdio pipes
		var processOptions = {
			detached: true,
			stdio: [ 'ignore', out, err ],
			cwd: siaPath 
		};
		var daemonProcess = new Process(command, processOptions);
		daemonProcess.unref();
	}

	// stop() stops the daemon using its API
	function stop() {
		ifSiad(function() {
			console.log('stopping siad');
		}, function() {
			console.err('attempted to stop siad when it was not running');
			return;
		});
		apiCall('/daemon/stop', function(err, data) {
			console.assert(!err && data);
			console.log(data);
		});
	}

	// init() sets config and starts the daemon if it isn't on
	function init(config) {
		setConfig(config, function() {
			ifSiad(function() {}, start);
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
}());
