'use strict';

// Electron main process libraries
const Electron = require('electron');
const App = Electron.app;
const Tray = Electron.Tray;
const Menu = Electron.Menu;
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
	// Load tray icon
	// OSX has a maximum tray icon height of 18px.
	var iconPath = Path.join(__dirname, 'assets', 'tray.png');
	appIcon = new Tray(iconPath);
	appIcon.setToolTip('Sia - The Collaborative Cloud.');
	// set context menu
	var contextMenu = Menu.buildFromTemplate([{label:'Test', type: 'radio'}]);
	appIcon.setContextMenu(contextMenu);
	// Load mainWindow
	mainWindow = require('./js/mainjs/initWindow.js')(config);

	// Add IPCMain listeners
	require('./js/mainjs/addIPCListeners.js')(config, mainWindow);

	// Upon exiting, dereference the window object so that the GC cleans up.
	mainWindow.on('close', function() {
		mainWindow = null;
	});

	// Load siad
	require('./js/mainjs/initSiad.js')(config, mainWindow);
});

// Quit when UI window closing
App.on('window-all-closed', function() {
	config.save();
	App.quit();
});

