// main.js, the entry point of the app, handles starting up the app window. It
// runs index.html which maps all other classes.
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

	// Create the browser
	mainWindow = new BrowserWindow({
		'height': 720,
		'width': 1200,
		'min-width': 800,
		'min-height': 600,
		'title': 'Sia'
	});
	// and load the index.html of the app.
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	// DEVTOOL: Open the devtools.
	// mainWindow.openDevTools();

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
