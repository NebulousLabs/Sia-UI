'use strict';

// Electron main process libraries
const Electron = require('electron');
const App = Electron.app;
const IPCMain = Electron.ipcMain;
const BrowserWindow = Electron.BrowserWindow;
const Tray = Electron.Tray;
const Dialog = Electron.dialog;
const Menu = Electron.Menu;
const GlobalShortcut = Electron.globalShortcut;
const Path = require('path');
const contextMenu = Menu.buildFromTemplate(require('./js/contextMenu.js'));
const appMenu = Menu.buildFromTemplate(require('./js/appMenu.js'));

// Uncomment to visit localhost:9222 to see devtools remotely
// App.commandLine.appendSwitch('remote-debugging-port', '9222');
// TODO: This seems to not let WebDriverIO tests run so it's commented out,
// though I'm not sure why.

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

	// Load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/index.html');

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
App.on('will-quit', function() {
  // Unregister all shortcuts.
  GlobalShortcut.unregisterAll();
});

// When Electron loading has finished, start the daemon then the UI
App.on('ready', function() {
	startMainWindow();
	
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
});

// Listen for if the renderer process wants to produce a dialog message
IPCMain.on('dialog', function(event, type, options) {
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
IPCMain.on('context-menu', function(event, template) {
	contextMenu.popup(mainWindow);
});
