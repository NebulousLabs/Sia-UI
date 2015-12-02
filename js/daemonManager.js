'use strict';

/**
 * DaemonManager, a closure, initializes siad as a background process and
 * provides functions to interact with it
 * @class DaemonManager
 */
function DaemonManager() {
	// The location of the folder containing siad
	var siaPath;
	// The command to start siad
	var siaCommand;
	// The localhost:port (default is 9980)
	var address;
	// To keep a reference to the DaemonManager inside its functions
	var self = this;
	// Tracks if siad is running
	self.Running = false;

	/**
	 * Relays calls to daemonAPI with the localhost:port address appended
	 * @function DaemonManager#call
	 * @param {apiCall} call - function to run if Siad is running
	 * @param {apiResponse} callback
	 */
	function apiCall(call, callback) {
		// Interpret address-only calls as 'GET'
		if (typeof call === 'string') {
			call = {url: call};
		}

		// Add the localhost address and port to the url and default values
		call.url = address + call.url;

		// Set success handler
		call.success = function(responseData, textStatus, jqXHR) {
			// Catches improperly constructed JSONs that JSON.parse would
			// normally return a weird error on
			try {
				callback(null, JSON.parse(responseData), textStatus, jqXHR);
			} catch(e) {
				callback('Malformed JSON result! Response was: ' + responseData);
			}
		};

		// Set error handler
		call.error = function(jqXHR, textStatus, errorThrown) {
			// jqXHR is the XmlHttpRequest that jquery returns back on error
			var errcode = textStatus + ' ' + jqXHR.status + ' ' + errorThrown + ' ' + jqXHR.responseText;
			callback(errcode);
		};

		// Make the call
		$.ajax(call);
	}

	/**
	 * Detects whether siad is running on the current address
	 * @function DaemonManager#ifSiad
	 * @param {function} isRunning - function to run if Siad is running
	 * @param {function} isNotRunning - function to run if Siad is not running
	 */
	function ifSiad(isRunning, isNotRunning) {
		apiCall('/daemon/version', function(err) {
			self.Running = !err;
			if (self.Running) {
				isRunning();
			} else if (!self.Running) {
				isNotRunning();
			}
		});
	}

	// Polls the siad API until it comes online
	function waitForSiad() {
		ifSiad(function() {
			UI.notify('Started siad!', 'success');
		}, function() {
			// check once per second until successful
			setTimeout(waitForSiad, 1000);
			UI.renotify('loading');
		});
	}
	
	// Starts the daemon as a long running background process
	function start() {
		ifSiad(function() {
			UI.notify('attempted to start siad when it was already running', 'error');
		}, function() {
			UI.notify('Loading siad...', 'loading');

			// daemon logs output to files
			var out, err;
			Fs.open(Path.join(__dirname, siaPath, 'daemonOut.log'), 'w', function(e, filedescriptor) {
				out = filedescriptor;
			});
			Fs.open(Path.join(__dirname, siaPath, 'daemonErr.log'), 'w', function(e, filedescriptor) {
				err = filedescriptor;
			});

			// daemon process has to be detached without parent stdio pipes
			var processOptions = {
				stdio: ['ignore', out, err],
				cwd: Path.join(__dirname, siaPath),
			};
			var daemonProcess = new Process(siaCommand, processOptions);

			// Listen for siad erroring
			daemonProcess.on('error', function (error) {
				if (error === 'Error: spawn ' + siaCommand + ' ENOENT') {
					UI.notify('Missing siad!', 'error');
				} else {
					UI.notify('siad errored: ' + error, 'error');
				}
			});

			// Listen for siad exiting
			daemonProcess.on('exit', function(code) {
				self.Running = false;
				UI.notify('siad exited with code: ' + code, 'stop');
			});

			// Wait for siad to start
			waitForSiad();
		});
	}

	/**
	 * Sets the member variables based on the passed config
	 * @param {config} config - the config object derived from config.json
	 * @param {callback} callback
	 */
	function setConfig(config, callback) {
		siaPath = 'Sia';
		siaCommand = process.platform === 'win32' ? './siad.exe' : './siad';
		address = config.siadAddress;
		callback();
	}

	/**
	 * Initializes the daemon manager and starts siad
	 * @function DaemonManager#init
	 * @param {config} config - config in memory
	 */
	function init(config) {
		setConfig(config, function() {
			ifSiad(function() {
				UI.notify('siad is running!', 'success');
			}, start);
		});
	}

	// Make certain functions public
	this.init = init;
	this.apiCall = apiCall;
	this.ifSiad = ifSiad;
}
