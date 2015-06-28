// main.js, the entry point of the app, handles starting up the app window. It
// runs index.html which maps all other classes.

// Global variables and require statements available to all main processes
'use strict';
// Module to control application life.
var app = require('app');
// Module to create native browser window.
var BrowserWindow = require('browser-window');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow;

// startMainWindow creates the first window and loads and index.html.
function startMainWindow() {
	
	// Open the UI with full screen size. 'screen' can only be required after
	// app.on('ready') 
	var atomScreen = require('screen');
	var size = atomScreen.getPrimaryDisplay().workAreaSize;

	// Create the browser
	mainWindow = new BrowserWindow({
		'width': size.width,
		'height': size.height,
		'min-width': 800,
		'min-height': 600,
		'use-content-size' : true,
		'title': 'Sia'
	});

	// Choose not to show the menubar
	mainWindow.setMenuBarVisibility(false);
	
	// Load the index.html of the app.
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	// Focus selector on test-ui	
	mainWindow.focus();

	// DEVTOOL: Open the devtools.
	mainWindow.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object so that the GC cleans up.
		mainWindow = null;
	});
}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// When Electron loading has finished, call 'startMainWindow'
app.on('ready', function() {
	startMainWindow();
});
