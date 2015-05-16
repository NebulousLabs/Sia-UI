// Standard Electron header, see quick-start.md in the Electron repository.
var app = require('app');
var BrowserWindow = require('browser-window');
require('crash-reporter').start();
var mainWindow = null;

// Respond to all windows being closed.
app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit();
	}
});

// Create the windows.
app.on('ready', function() {
	// Create the browser and load the index page.
	mainWindow = new BrowserWindow({
		"width": 1200,
		"height": 800,
		"title": "Sia"
	});
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	// Dereference the window object so that the GC cleans up.
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
