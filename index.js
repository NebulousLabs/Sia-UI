'use strict';
// Electron main process libraries
const App = require('app');
const MainIPC = require('ipc');
const Path = require('path');
const BrowserWindow = require('browser-window');
const Tray = require('tray');
const Dialog = require('dialog');
const Menu = require('menu');

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
	var iconPath = Path.join(__dirname, 'app', 'assets', 'logo', 'logo.png');
	var appIcon = new Tray(iconPath);
	var contextMenu = Menu.buildFromTemplate([
		{ label: 'Minimize', accelerator: 'CmdOrCtrl+M', selector: 'performMiniaturize:' },
		{ label: "Quit", accelerator: "CmdOrCtrl+Q", selector:'terminate:', click: function() { app.quit();}},
		{ type: 'separator' },
		{ label: 'Bring All to Front', selector: 'arrangeInFront:' }
	]);
	appIcon.setToolTip('A highly efficient decentralized storage network.');

	// Create the browser
	mainWindow = new BrowserWindow({
		'width': size.width,
		'height': size.height,
		'icon': iconPath,
		'title': 'Sia-UI'
	});

	// Load the index.html of the app.
	mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object so that the GC cleans up.
		mainWindow = null;
	});

	// Choose not to show the menubar
	if (process.platform !== 'darwin') {
		mainWindow.setMenuBarVisibility(false);
	} else {
		// Create the Application's main menu - enables copy-paste on Mac.
		var appMenu = Menu.buildFromTemplate([
			{
				label: "Edit",
				submenu: [
					{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
					{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
					{ type: "separator" },
					{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
					{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
					{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
					{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
				]
			}
		]);
		Menu.setApplicationMenu(appMenu);
	}
}


// Quit when all windows are closed.
App.on('window-all-closed', function() {
	App.quit();
});

// When Electron loading has finished, start the daemon then the UI
App.on('ready', startMainWindow);

// TODO: Set up to work with files plugin
// Listen for if the renderer process wants to produce a dialog message
MainIPC.on('dialog', function(event, type, options, callback) {
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
