// Standard Electron header, see docs/quick-start.md in the Electron
// repository.
var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');
var mainWindow = null;

// Respond to all windows being closed.
app.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		app.exit();
	}
});

// Create the windows.
app.on('ready', function() {
	// Create the browser and load the index page.
	mainWindow = new BrowserWindow({
		"height": 720,
		"width": 1200,
		"min-width": 800,
		"min-height": 600,
		"title": "Sia"

	});
	mainWindow.loadUrl('file://' + __dirname + '/html/index.html');

	// mainWindow.openDevTools();

	// Dereference the window object so that the GC cleans up.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
