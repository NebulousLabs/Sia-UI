'use strict';
const App = require('app');
const Path = require('path');
const BrowserWindow = require('browser-window');
const Tray = require('tray');

/**
 * Global reference to the window object, so the window won't be closed
 * automatically upon execution and garbage collection
 */
var mainWindow;

/**
 * Creates the window and loads index.html
 */
function startMainWindow() {
	// Open the UI with full screen size. 'screen' can only be required after
	// app.on('ready') 
	const ElectronScreen = require('screen');
	var size = ElectronScreen.getPrimaryDisplay().workAreaSize;

	// Give tray/taskbar icon path
	var iconPath = Path.join(__dirname, 'assets', 'logo', 'sia.png');
	var appIcon = new Tray(iconPath);
	appIcon.setToolTip('A highly efficient decentralized storage network.');

	// Create the browser
	mainWindow = new BrowserWindow({
		'width': size.width,
		'height': size.height,
		'icon': iconPath,
		'title': 'Sia-UI'
	});

	// Choose not to show the menubar
	mainWindow.setMenuBarVisibility(false);
	
	// Load the index.html of the app.
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object so that the GC cleans up.
		mainWindow = null;
	});
}

/**
 * Quit when all windows are closed.
 */
App.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		App.quit();
	}
});

/**
 * When Electron loading has finished, start the daemon then the UI
 */
App.on('ready', startMainWindow);
