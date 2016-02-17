'use strict';

// Electron main process libraries
const Electron = require('electron');
const App = Electron.app;
const Tray = Electron.Tray;
const appTray = require('./js/mainjs/trayMenu.js');
// Node libraries
const Path = require('path');

// Uncomment to visit localhost:9222 to see devtools remotely
// App.commandLine.appendSwitch('remote-debugging-port', '9222');
// TODO: This seems to not let WebDriverIO tests run so it's commented out,
// though I'm not sure why.

// Global references so these won't be deleted automatically upon execution and
// garbage collection
var mainWindow;
var appIcon;

// config.json manager
var config = require('./js/mainjs/config.js')(Path.join(__dirname, 'config.json'));

// When Electron loading has finished, start the daemon then the UI
App.on('ready', function() {
	// Load mainWindow
	mainWindow = require('./js/mainjs/initWindow.js')(config);
	// Load tray icon and menu
	var iconPath = Path.join(__dirname, 'assets', 'tray.png');
	appIcon = new Tray(iconPath);
	appIcon.setToolTip('Sia - The Collaborative Cloud.');
	appIcon.setContextMenu(appTray(mainWindow));

	// Add IPCMain listeners
	require('./js/mainjs/addIPCListeners.js')(config, mainWindow);

	// Catch mainWindow's close event and minimize instead.
	mainWindow.on('close', function(e) {
		e.preventDefault();
		mainWindow.minimize();
	});
	// Load siad
	var Siad = require('./js/mainjs/initSiad.js')(config, mainWindow);
	// mainwindow.closed() can only be called when the user quits from the tray.
	// If the config.siad.detached flag is not set, call siad.stop and quit from the callback.
	mainWindow.on('closed', function() {
		if (!config.siad.detached) {
			Siad.stop(function() {
				App.quit();
			});
		} else {
			App.quit();
		}
		// Dereference mainWindow and Siad to clean up.
		Siad = null;
		mainWindow = null;
	});
});

