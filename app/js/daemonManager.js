'use strict';
const Process = require("child_process").spawn;
var API = require('./js/daemonAPI');

/**
 * DaemonManager, a closure, initializes siad as a background process and
 * provides functions to interact with it
 * @class DaemonManager
 */
function DaemonManager() {
	/**
	 * The file system location of Sia and siad
	 * @member {string} DaemonManager~siaPath
	 */
	var siaPath;
	/**
	 * The localhost:port (default is 9980)
	 * @member {string} DaemonManager~address
	 */
	var address;

	/**
	 * Relays calls to daemonAPI with the localhost:port address appended
	 * @param {apiCall} call - function to run if Siad is running
	 * @param {apiResponse} callback
	 */
	function apiCall(call, callback) {
		// Interpret address-only calls as 'GET'
		if (typeof call === 'string') {
			call = {url: call};
		}

		// Add the localhost address and port to the url
		call.url = address + call.url;
		API.makeCall(call, callback);
	}

	/**
	 * Detects whether siad is running on the current address
	 * @param {function} isRunning - function to run if Siad is running
	 * @param {function} isNotRunning - function to run if Siad is not running
	 */
	function ifSiad(isRunning, isNotRunning) {
		if (!isRunning) {
			isRunning = function() {};
		}
		if (!isNotRunning) {
			isNotRunning = function() {};
		}
		apiCall('/consensus/status', function(err) {
			if (!err) {
				isRunning();
			} else if (err) {
				isNotRunning();
			}
		});
	}

	/**
	 * Starts the daemon as a long running background process
	 */
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
		var command = process.platform === 'win32' ? './siad.exe' : './siad';
		var daemonProcess = new Process(command, processOptions);
		daemonProcess.unref();
	}

	/**
	 * Stops the daemon
	 */
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

	/**
	 * Sets the member variables based on the passed config
	 * @param {config} config - the config object derived from config.json
	 * @param {callback} callback
	 */
	function setConfig(config, callback) {
		siaPath = Path.join(config.depsPath, 'Sia');
		address = config.siadAddress;
		callback();
	}

	/**
	 * Initializes the daemon manager and starts siad
	 * @function DaemonManager#init
	 * @param {config} config - config in memory
	 */
	this.init = function(config) {
		setConfig(config, function() {
			ifSiad.call(this, function() {}, start);
		});
	};
	/**
	 * Makes an API call to to proper port using daemonAPI
	 * @function DaemonManager#call
	 * @param {APICall} call - the config object derived from config.json
	 * @param {APIResponse} callback
	 */
	this.apiCall = apiCall;
}
