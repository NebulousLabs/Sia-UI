// daemonManager.js provides functionality to start and deal with siad

// Elements used across this file. GCed after file execution
'use strict';
const Process = require("child_process").spawn;
const Path = require("path");
const Fs = require('fs');
var API = require('./daemonAPI');

// When required, daemonManager should be initialized with a config object to
// initialize siad as a background process
module.exports = (function daemonManager() {
	// Encapsulated 'private' elements
	var path;
	var command;

	// setConfig() sets variables, then passes the config to the api to serve requests
	// Callback, if there is one, returns no arguments
	function setConfig(config, callback) {
		path = config.siadPath;
		command = config.siadCommand;
		API.setConfig(config);
		callback();
	}

	// start() starts the daemon as a long running background process. siad already
	// bounces if the port is in use.
	function start() {
		// daemon as a background process logs output to files
		var out = Fs.openSync(Path.join(path, 'daemonOut.log'), 'a');
		var err = Fs.openSync(Path.join(path, 'daemonErr.log'), 'a');
		// daemon process has to be detached without parent stdio pipes
		var processOptions = {
			detached: true,
			stdio: [ 'ignore', out, err ],
			cwd: path 
		};
		var daemonProcess = new Process(command, processOptions);
		daemonProcess.unref();
	}

	// stop() stops the daemon with an API call to the port
	function stop() {
		API.getCall('/daemon/stop', function(err, data) {
			console.assert(!err && data);
			console.log(data);
		});
	}

	// init() sets config and assumes to start the daemon
	function init(config) {
		setConfig(config, start);
	}

	// expose 'public' elements and functions
	return {
		setConfig: setConfig,
		start: start,
		stop: stop,
		init: init
	};
})();
