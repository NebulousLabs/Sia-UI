'use strict';

// Electron main process libraries
const Electron = require('electron');
const Dialog = Electron.dialog;
// Node libraries
const Path = require('path');
const Fs = require('fs');
const Siad = require('sia.js');

// Start siad and pipe events to UI notification system
function startSiad(mainWindow) {
	Siad.start(function(err) {
		if (err) {
			console.error(err);
		}
	});

	// Pipe siad events to UI notification system through IPC
	var allCPEvents = ['close', 'disconnect', 'error', 'exit', 'message'];
	allCPEvents.forEach(function(ev) {
		Siad.on(ev, function(msg) {
			mainWindow.webContents.send('notification', 'siad: ' + msg, ev);
		});
	});
}

// Configures, checks, and, if needed, starts siad
module.exports = function initSiad(settings, mainWindow) {
	// Stop siad upon the main window being closed. Else it continues as a
	// child process of electron, forcing electron to keep running until siad
	// has stopped
	mainWindow.on('close', function() {
		Siad.stop();
	});

	// Set settings for Siad to work off of configure() doesn't update
	// `running` for sia.js:0.1.1 but it should soon from a pending pull
	// request
	Siad.configure(settings.siad);

	// TODO: Let user know if siad is running 
	if (Siad.isRunning()) {
		return;
	}

	// Siad is not running, check if siad doesn't exist at siad.path
	Fs.stat(settings.siad.path, function (err) {
		if (!err) {
			// It's found, start siad
			startSiad(mainWindow);
			return;
		}

		// If it isn't found, use dialogs to find or download it
		var iconPath = Path.join(__dirname, '..', 'assets', 'icon.png');
		var selected = Dialog.showMessageBox(mainWindow, {
			title:   'Missing siad!',
			message: 'Sia-UI requires siad to function.',
			detail:  'Would you like to open it or download a copy?',
			icon:    iconPath,
			type:    'question',
			buttons: ['Open', 'Download', 'Cancel'],
		});

		// Commonalities between the Open and Download optioins
		var options = {
			defaultPath: settings.siad.path,
			filters: [{ name: 'Siad', extensions: ['*'] }],
		};
		var siadPath;

		// 'Open' selected
		if (selected === 0) {
			options.title = 'Open siad';
			options.properties = ['openFile'];

			// Get directory of siad and parse file name
			siadPath = Dialog.showOpenDialog(mainWindow, options);
			if (siadPath) {
				// Path returned from showOpenDialog() in array
				siadPath = siadPath[0];
				var lastIndex = siadPath.lastIndexOf('/');
				settings.siad.command = siadPath.substring(lastIndex);
				settings.siad.path = siadPath.substring(0, lastIndex);
			}
			// Try this path
			initSiad(settings, mainWindow);
		} else if (selected === 1) {
			// 'Download' selected
			options.title = 'Download siad to directory';
			options.properties = ['openDirectory'];
			siadPath = Dialog.showOpenDialog(mainWindow, options);
			if (siadPath) {
				// Path returned from showOpenDialog() in array
				siadPath = siadPath[0];
				settings.siad.path = Path.join(siadPath, 'Sia');
			}
			// Begin download and start siad after
			// TODO: alert UI of download and start progress
			Siad.download(settings.siad.path, startSiad);
		} else {
			// 'Cancel' selected
			mainWindow.close();
		}
	});
};

