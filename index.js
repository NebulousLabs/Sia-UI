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
// Node libraries
const Path = require('path');
// Main process logic partitioned to other files
const ContextMenu = Menu.buildFromTemplate(require('./mainjs/contextMenu.js'));
const AppMenu = Menu.buildFromTemplate(require('./mainjs/appMenu.js'));
const ConfigManager = require('./mainjs/config.js');

// Uncomment to visit localhost:9222 to see devtools remotely
// App.commandLine.appendSwitch('remote-debugging-port', '9222');
// TODO: This seems to not let WebDriverIO tests run so it's commented out,
// though I'm not sure why.

// Global references so these won't be deleted automatically upon execution and
// garbage collection
var mainWindow;
var appIcon;
var config;

// Creates the window and loads index.html
function startMainWindow(settings) {
	// Give tray/taskbar icon path
	var iconPath = Path.join(__dirname, 'assets', 'icon.png');
	appIcon = new Tray(iconPath);
	appIcon.setToolTip('Sia - The Collaborative Cloud.');

	// Create the browser
	mainWindow = new BrowserWindow({
		icon:   iconPath,
		title:  'Sia-UI-beta',
	});

	// Load the index.html of the app.
	mainWindow.loadURL('file://' + __dirname + '/index.html');

	// Load the window's size and position
	mainWindow.setBounds(settings);
	
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

	// Emitted when the window is closed.
	mainWindow.on('close', function() {
		// Save the window's size and position
		var bounds = mainWindow.getBounds();
		for (var k in bounds) {
			if (bounds.hasOwnProperty(k)) {
				config[k] = bounds[k];
			}
		}

		// Dereference the window object so that the GC cleans up.
		mainWindow = null;
	});

	// Choose not to show the menubar
	if (process.platform !== 'darwin') {
		mainWindow.setMenuBarVisibility(false);
	} else {
		// Create the Application's main menu - OSX version might feel weird without a menubar
		Menu.setApplicationMenu(AppMenu);
	}
}

// When Electron loading has finished, start the daemon then the UI
App.on('ready', function() {
	// Load config.json
	var configPath = Path.join(__dirname, 'config.json');
	config = new ConfigManager(configPath);
	
	startMainWindow(config);
	require('./mainjs/initSiad.js')(config, mainWindow);
});

// Quit when UI window closing
App.on('window-all-closed', function() {
	config.save();
	App.quit();
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
	ContextMenu.popup(mainWindow);
});

// Allow any process to interact with the configManager
IPCMain.on('config', function(event, key, value) {
	event.returnValue = config.attr(key, value);
});
