// daemonManager.js provides functionality to start and deal with siad

// Elements used across this file. GCed after file execution
'use strict';
const spawn = require("child_process").spawn;
const path = require("path");
const fs = require('fs');

// When required, daemonManager can be called with a config
// object to initialize siad as a background process
module.exports = function daemonManager(config) {
	// init starts siad. siad will bounce if port is already in use
	function init() {
		// daemon as a background process logs output to files
		var out = fs.openSync(path.join(config.siadPath, 'daemonOut.log'), 'a');
		var err = fs.openSync(path.join(config.siadPath, 'daemonErr.log'), 'a');
		// daemon process has to be detached without parent stdio pipes
		var processOptions = {
			detached: true,
			stdio: [ 'ignore', out, err ],
			cwd: config.siadPath 
		};
		var daemonProcess = spawn(config.siadCommand, processOptions);
		daemonProcess.unref();
	}

	init();
};
