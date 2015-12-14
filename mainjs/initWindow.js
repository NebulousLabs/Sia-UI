'use strict';

// Electron main process libraries
const Electron = require('electron');
const BrowserWindow = Electron.BrowserWindow;
const GlobalShortcut = Electron.globalShortcut;
const Menu = Electron.Menu;
// Node libraries
const Path = require('path');
// Main process logic partitioned to other files
const AppMenu = Menu.buildFromTemplate(require('./appMenu.js'));

// Creates the window and loads index.html
module.exports = function(settings) {
	// Create the browser
	var iconPath = Path.join(__dirname, 'assets', 'icon.png');
	var mainWindow = new BrowserWindow({
		icon:   iconPath,
		title:  'Sia-UI-beta',
	});

	// Add hotkey shortcut to view plugin devtools
	var shortcut;
	if (process.platform ==='darwin') {
		shortcut = 'Alt+Command+P';
	} else {
		shortcut = 'Ctrl+Shift+P';
	}
	GlobalShortcut.register(shortcut, function() {
		mainWindow.webContents.executeJavaScript('Plugins.Current.toggleDevTools();');
	});

	// Load the window's size and position
	mainWindow.setBounds(settings);
	
	// Emitted when the window is closed.
	mainWindow.on('close', function() {
		// Save the window's size and position
		var bounds = mainWindow.getBounds();
		for (var k in bounds) {
			if (bounds.hasOwnProperty(k)) {
				settings[k] = bounds[k];
			}
		}

		// Unregister all shortcuts.
		GlobalShortcut.unregisterAll();

		// Dereference the window object so that the GC cleans up.
		mainWindow = null;
	});

	// Load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/../index.html');

	// Choose not to show the menubar
	if (process.platform !== 'darwin') {
		mainWindow.setMenuBarVisibility(false);
	} else {
		// Create the Application's main menu - OSX version might feel weird without a menubar
		Menu.setApplicationMenu(AppMenu);
	}
	return mainWindow;
}

