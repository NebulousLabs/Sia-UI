'use strict';

/**
 * DaemonManager, a closure, initializes siad as a background process and
 * provides functions to interact with it
 * @class DaemonManager
 */
function DaemonManager() {
	/**
	 * API namespace for API access logic
	 * @member {daemonAPI} DaemonManager~API
	 */
	var API = require('./js/daemonAPI');
	/**
	 * The file system location of Sia and siad * @member {string} DaemonManager~siaPath
	 */
	var siaPath;
	/**
	 * The localhost:port (default is 9980)
	 * @member {string} DaemonManager~address
	 */
	var address;
	/**
	 * Tracks if siad is running
	 * @member {boolean} DaemonManager.Running
	 */
	this.Running = false;
	// To keep a reference to the DaemonManager inside its functions
	var self = this;

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
		apiCall('/consensus', function(err) {
			if (!err) {
				self.Running = true;
				isRunning();
			} else if (err) {
				self.Running = false;
				isNotRunning();
			}
		});
	}

	function updatePrompt() {
		if (!self.Running) {
			UI.notify('siad is not running!', 'stop');
			return;
		}
		apiCall("/daemon/updates/check", function(err, update) {
			if (err) {
				UI.notify('Update check failed!', 'error');
				return;
			} else if (update.Available) {
				UI.notify("New Sia Client Available: Click to update to " + update.Version, "update", function() {
					Shell.openExternal('https://www.github.com/NebulousLabs/Sia-UI/releases');
				});
			} else {
				UI.notify("Sia client up to date!", "success");
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
			UI.notify('Starting siad...', 'start');
		});

		// daemon as a background process logs output to files
		var out = Fs.openSync(Path.join(siaPath, 'daemonOut.log'), 'w');
		var err = Fs.openSync(Path.join(siaPath, 'daemonErr.log'), 'w');

		// daemon process has to be detached without parent stdio pipes
		var processOptions = {
			detached: true,
			stdio: [ 'ignore', out, err ],
			cwd: siaPath 
		};
		var command = process.platform === 'win32' ? './siad.exe' : './siad';
		var daemonProcess = new Process(command, processOptions);
		daemonProcess.unref();

		// Give siad time to load or exit
		// TODO: Imperfect way to go about this.
		var updating = setTimeout(function() {
			self.Running = true;
			updatePrompt();
		}, 1000);

		// Listen for siad erroring
		daemonProcess.on('error', function (error) {
			UI.notify('siad errored: ' + error, 'error');
		});
		// Listen for siad exiting
		daemonProcess.on('close', function(code) {
			self.Running = false;
			UI.notify('siad closed with code: ' + code, 'stop');
			clearTimeout(updating);
		});
		daemonProcess.on('exit', function(code) {
			self.Running = false;
			UI.notify('siad exited with code: ' + code, 'stop');
			clearTimeout(updating);
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
			ifSiad(updatePrompt, start);
		});
	};
	/**
	 * Makes an API call to to proper port using daemonAPI
	 * @function DaemonManager#call
	 * @param {APICall} call - the config object derived from config.json
	 * @param {APIResponse} callback
	 */
	this.apiCall = apiCall;
	this.update = updatePrompt;
}
