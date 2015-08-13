'use strict';
// Electron main process libraries
const App = require('app');
const IPC = require('ipc');
const Path = require('path');
const BrowserWindow = require('browser-window');
const Tray = require('tray');
const Dialog = require('dialog');
const IPC = require('ipc');

// visit localhost:9222 to see devtools remotely
App.commandLine.appendSwitch('remote-debugging-port', '9222');

// Global reference to the window object, so the window won't be closed
// automatically upon execution and garbage collection
var mainWindow;

// Creates the window and loads index.html
function startMainWindow() {
	// Open the UI with full screen size. 'screen' can only be required after
	// app.on('ready') 
	const ElectronScreen = require('screen');
	var size = ElectronScreen.getPrimaryDisplay().workAreaSize;

	// Give tray/taskbar icon path
	var iconPath = Path.join(__dirname, 'app', 'assets', 'logo', 'sia.png');
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
	mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object so that the GC cleans up.
		mainWindow = null;
	});
}


// Quit when all windows are closed.
App.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		App.quit();
	}
});

// When Electron loading has finished, start the daemon then the UI
App.on('ready', startMainWindow);

// TODO: Was going to use for wallet but it's unused for now
// Listen for if the renderer process wants to produce a dialog message
IPC.on('dialog', function(event, type, options, callback) {
	switch (type) {
		case 'open':
			Dialog.showOpenDialog(mainWindow, options, callback)
			break;
		case 'save':
			Dialog.showSaveDialog(mainWindow, options, callback)
			break;
		case 'message':
			Dialog.showMessageBox(mainWindow, options, callback)
			break;
		case 'error':
			Dialog.showErrorBox(options.title, options.content)
			break;
		default:
			console.error('Unknown dialog ipc')
	}
});
