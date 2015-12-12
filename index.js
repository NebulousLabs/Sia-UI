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
const Siad = require('sia.js');
// Main process logic partitioned to other files
const ContextMenu = Menu.buildFromTemplate(require('./js/contextMenu.js'));
const AppMenu = Menu.buildFromTemplate(require('./js/appMenu.js'));
const ConfigManager = require('./js/config.js');

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
		config.save();

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

// Start siad and pipe events to UI notification system
function startSiad() {
	Siad.start(function(err) {
		if (err) {
			console.error(err);
		}
	});

	// Pipe siad events to UI notification system through IPC
	var allCPEvents = ['close', 'disconnect', 'error', 'exit', 'message'];
	allCPEvents.forEach(function(ev) {
		Siad.on(ev, function(msg) {
			mainWindow.webContents.send('notification', 'siad: ' + msg, ev);
		});
	});
}

// Configures, checks, and, if needed, starts siad
function initializeSiad(settings) {
	// TODO: save siad configuration returned from this function.
	// Enables easily synchronizing this SiadWrapper instance with the
	// plugins' instances.
	//
	// configure() doesn't return anything yet for sia.js:0.1.0 but it
	// should soon from a pending pull request
	settings = Siad.configure(settings);

	// TODO: Let user know if siad is running or starts
	if (Siad.isRunning()) {
		return;
	}

	// Siad is not running, keep user notified of siad loading
	// Check if siad doesn't exist at siad.path
	require('fs').stat(settings.path, function (err) {
		if (!err) {
			// It's found, start siad
			startSiad();
			return;
		}

		// If it isn't found, use dialogs to find or download it
		var iconPath = Path.join(__dirname, 'assets', 'icon.png');
		var selected = Dialog.showMessageBox(mainWindow, {
			title:   'Missing siad!',
			message: 'Sia-UI requires siad to function.',
			detail:  'Would you like to open it or download a copy?',
			icon:    iconPath,
			type:    'question',
			buttons: ['Open', 'Download', 'Cancel'],
		});

		// Commonalities between the Open and Download optioins
		var options = {
			defaultPath: settings.path,
			filters: [{ name: 'Siad', extensions: ['exe'] }],
		};
		var siadPath;

		// 'Open' selected
		if (selected === 0) {
			options.title = 'Open siad';
			options.properties = ['openFile'];

			// Get directory of siad and parse file name
			siadPath = Dialog.showOpenDialog(mainWindow, options)[0];
			if (!siadPath) {
				App.quit();
				return;
			}
			var lastIndex = siadPath.lastIndexOf('/');
			settings.command = siadPath.substring(lastIndex);
			settings.path = siadPath.substring(0, lastIndex);

			// Try this path
			initializeSiad(settings);
		} else if (selected === 1) {
			// 'Download' selected
			options.title = 'Download siad to directory';
			options.properties = ['openDirectory'];
			siadPath = Dialog.showOpenDialog(mainWindow, options)[0];
			if (!siadPath) {
				App.quit();
				return;
			}
			settings.path = siadPath;

			// Begin download and start siad after
			Siad.download(settings.path, startSiad);
		} else {
			// 'Cancel' selected
			App.quit();
			return;
		}
	});
}

// When Electron loading has finished, start the daemon then the UI
App.on('ready', function() {
	// Load config.json
	var configPath = Path.join(__dirname, 'config.json');
	config = new ConfigManager(configPath);
	
	initializeSiad(config.siad);
	startMainWindow(config);
});
// Quit when UI window closing
App.on('all-windows-closed', App.quit);

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
	if (value !== undefined) {
		config[key] = value;
	}
	try {
		event.returnValue = config[key];
	} catch(e) {
		console.log(config, config[key]);
	}
});
