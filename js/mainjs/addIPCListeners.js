'use strict';

// Electron main process libraries
const Electron = require('electron');
const Dialog = Electron.dialog;
const IPCMain = Electron.ipcMain;
const Menu = Electron.Menu;
// Context Menu template
const ContextMenu = Menu.buildFromTemplate(require('./contextMenu.js'));

// Adds IPCMain listeners that the UI and plugins can access for config and OS
// native GUI resources
module.exports = function(config, mainWindow) {
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
				// Give all message boxes the sia icon by default
				if (!options.icon) {
					options.icon = require('path').join(__dirname, '../..', 'assets', 'icon.png');
				}
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
};

