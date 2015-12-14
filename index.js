'use strict';

// Electron main process libraries
const Electron = require('electron');
const App = Electron.app;
const IPCMain = Electron.ipcMain;
const Dialog = Electron.dialog;
const Menu = Electron.Menu;
const Tray = Electron.Tray;
// Node libraries
const Path = require('path');
// Main process logic partitioned to other files
const ContextMenu = Menu.buildFromTemplate(require('./mainjs/contextMenu.js'));
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

// When Electron loading has finished, start the daemon then the UI
App.on('ready', function() {
	// Load tray icon
	var iconPath = Path.join(__dirname, 'assets', 'icon.png');
	appIcon = new Tray(iconPath);
	appIcon.setToolTip('Sia - The Collaborative Cloud.');

	// Load config.json
	var configPath = Path.join(__dirname, 'config.json');
	config = new ConfigManager(configPath);
	
	mainWindow = require('./mainjs/initWindow.js')(config);
	require('./mainjs/initSiad.js')(config, mainWindow);
});

// Quit when UI window closing
App.on('window-all-closed', function() {
	config.save();
	App.quit();
});

