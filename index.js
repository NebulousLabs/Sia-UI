'use strict';

// Electron main process libraries
const App = require('app');
const MainIPC = require('ipc');
const Path = require('path');
const BrowserWindow = require('browser-window');
const Tray = require('tray');
const Dialog = require('dialog');
const Menu = require('menu');
const contextMenu = require('./js/contextMenu.js');
const appMenu = require('./js/appMenu.js');

// Global reference to the window object, so the window won't be closed
// automatically upon execution and garbage collection
var mainWindow;

// Creates the window and loads index.html
function startMainWindow() {
	// Give tray/taskbar icon path
	var iconPath = Path.join(__dirname, 'assets', 'icon.png');
	var appIcon = new Tray(iconPath);
	appIcon.setToolTip('Sia - The Collaborative Cloud.');

	// Create the browser
	mainWindow = new BrowserWindow({
		'icon':   iconPath,
		'title':  'Sia-UI-beta',
	});

	// Set User Agent
	mainWindow.webContents.setUserAgent('Sia-Agent');

	// Load the index.html of the app.
	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object so that the GC cleans up.
		mainWindow = null;
	});

	// Choose not to show the menubar
	if (process.platform !== 'darwin') {
		mainWindow.setMenuBarVisibility(false);
	} else {
		// Create the Application's main menu - OSX version might feel weird without a menubar
		Menu.setApplicationMenu(appMenu);
	}
}

// Quit when no renderer windows detected
App.on('window-all-closed', App.quit);

// When Electron loading has finished, start the daemon then the UI
App.on('ready', startMainWindow);

// Listen for if the renderer process wants to produce a dialog message
MainIPC.on('dialog', function(event, type, options) {
	var response;
	switch (type) {
		case 'open':
			response = Dialog.showOpenDialog(mainWindow, options);
			break;
		case 'save':
			response = Dialog.showSaveDialog(mainWindow, options);
			break;
		case 'message':
			response = Dialog.showMessageBox(mainWindow, options);
			break;
		case 'error':
			Dialog.showErrorBox(options.title, options.content);
			break;
		default:
			console.error('Unknown dialog ipc');
	}
	event.returnValue = response ? response : null;
});

// Enable right-click context menu from renderer process event
MainIPC.on('context-menu', function(event, template) {
	contextMenu.popup(mainWindow);
});
