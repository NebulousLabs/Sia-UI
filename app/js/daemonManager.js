// daemonManager.js provides functionality to start and deal with siad

// Elements used across this file. GCed after file execution
'use strict';
const spawn = require("child_process").spawn;
const path = require("path");
const fs = require('fs');

// When required, daemonManager can be called with a config
// object to initialize siad
module.exports = function daemonManager(config) {
	// daemon as a background process logs output to files
	var out = fs.openSync(path.join(config.siadPath, 'daemonOut.log'), 'a');
	var err = fs.openSync(path.join(config.siadPath, 'daemonErr.log'), 'a');
	const processOptions = {
		detached: true,
		stdio: [ 'ignore', out, err ],
		cwd: config.siadPath 
	};

	function init() {
		if (daemonProcess) {
			console.error("Daemon process already running");
			return;
		}
		var daemonProcess = spawn(config.siadCommand, processOptions);
		daemonProcess.unref();
	}

	init();
};
