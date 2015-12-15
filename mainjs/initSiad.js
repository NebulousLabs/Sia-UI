'use strict';

// Electron main process libraries
const Electron = require('electron');
const Dialog = Electron.dialog;
// Node libraries
const Path = require('path');
const Fs = require('fs');
const Siad = require('sia.js');

// Reference to commonly used variables
var config;
var mainWindow;

// Send to UI notification system
function notify(msg, type) {
	var wc = mainWindow.webContents;
	if (wc.isLoading()) {
		wc.on('did-finish-load', function() {
			wc.send('notification', msg, type);
		});
	} else {
		wc.send('notification', msg, type);
	}
}

// Start siad
function startSiad() {
	// Keep notifying of siad loading the blockchain until it's started
	var starting = setInterval(function() {
		notify('siad: loading...', 'loading');
	}, 500);
	Siad.start(function(err) {
		if (err) {
			console.error(err);
			mainWindow.close();
		}
		notify('siad: started!', 'success');
		clearInterval(starting);
	});
}

// Download siad to config.siad.path
function downloadSiad() {
	// Keep notifying of siad downloading
	var downloading = setInterval(function() {
		notify('siad: downloading...', 'loading');
	}, 500);
	Siad.download(config.siad.path, function(err) {
		if (err) {
			console.error(err);
			mainWindow.close();
			return;
		}
		notify('siad: downloaded to ' + config.siad.path, 'success');
		clearInterval(downloading);
		startSiad();
	});
}

// Download siad to a selected path
function downloadSiadDialog() {
	var siadPath = Dialog.showOpenDialog(mainWindow, {
		title: 'Download siad to directory',
		properties: ['openDirectory'],
		defaultPath: config.siad.path,
		filters: [{ name: 'Siad', extensions: ['*'] }],
	});
	if (siadPath) {
		// Path returned from showOpenDialog() in array
		siadPath = siadPath[0];
		siadPath = Path.join(siadPath, 'Sia');
	}
	return siadPath;
}

// Get directory of siad and parse file name
function openSiadDialog() {
	var siadPath = Dialog.showOpenDialog(mainWindow, {
		title: 'Open siad',
		properties: ['openFile'],
		defaultPath: config.siad.path,
		filters: [{ name: 'Siad', extensions: ['*'] }],
	});
	if (siadPath) {
		// Path returned from showOpenDialog() in array
		siadPath = siadPath[0];
	}
	return siadPath;
}

// Ask user to open or download siad with an electron dialog message
function missingSiadDialog() {
	var iconPath = Path.join(__dirname, '..', 'assets', 'icon.png');
	return Dialog.showMessageBox(mainWindow, {
		title:   'Missing siad!',
		message: 'Sia-UI requires siad to function.',
		detail:  'Would you like to open it or download a copy?',
		icon:    iconPath,
		type:    'question',
		buttons: ['Open', 'Download', 'Cancel'],
	});
}

// Siad is not running, check if siad doesn't exist at siad.path
function checkSiadPath() {
	Fs.stat(config.siad.path, function (err) {
		if (!err) {
			// It's found, start siad
			startSiad();
			return;
		}

		// If it isn't found, use dialogs to find or download it
		var selected = missingSiadDialog();
		var siadPath;

		// 'Open' selected
		if (selected === 0) {
			siadPath = openSiadDialog();
		} else if (selected === 1) {
			// 'Download' selected
			siadPath = downloadSiadDialog();
		} else {
			// 'Cancel' selected
			mainWindow.close();
			return;
		}
		
		// Verify chosen path
		if (!siadPath) {
			checkSiadPath();
		} else if (selected === 0) {
			var lastIndex = siadPath.lastIndexOf('/');
			config.siad.command = siadPath.substring(lastIndex);
			config.siad.path = siadPath.substring(0, lastIndex);
			checkSiadPath();
		} else if (selected === 1) {
			config.siad.path = siadPath;
			// Begin download and start siad after
			downloadSiad();
		}
	});
}

// Configures, checks, and, if needed, starts siad
module.exports = function initSiad(cnfg, mW) {
	config = cnfg;
	mainWindow = mW;

	// Pipe siad events to UI notification system through IPC
	var allCPEvents = ['close', 'disconnect', 'error', 'exit', 'message'];
	allCPEvents.forEach(function(ev) {
		Siad.on(ev, function(msg) {
			notify('siad ' + ev + ': ' + msg, ev);
		});
	});

	// Stop siad upon the main window being closed. Else it continues as a
	// child process of electron, forcing electron to keep running until siad
	// has stopped
	mainWindow.on('close', function() {
		Siad.stop();
	});

	// Set config for Siad to work off of configure() doesn't update
	// `running` for sia.js:0.1.1 but it should soon from a pending pull
	// request
	Siad.configure(config.siad, function() {
		// Let user know if siad is running or check siad's location
		if (Siad.isRunning()) {
			notify('siad: running!', 'success');
		} else {
			checkSiadPath();
		}
	});
};

