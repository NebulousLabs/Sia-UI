// Electron main process libraries
import { dialog, ipcMain, Menu } from 'electron'
import Path from 'path'
import contextMenuTemplate from './contextMenu.js'
// Context Menu template
const ContextMenu = Menu.buildFromTemplate(contextMenuTemplate)

// Adds IPCMain listeners that the UI and plugins can access for config and OS
// native GUI resources
export default function(config, mainWindow) {
	// Listen for if the renderer process wants to produce a dialog message
	ipcMain.on('dialog', (event, type, options) => {
		var response
		switch (type) {
		case 'open':
			response = dialog.showOpenDialog(mainWindow, options)
			break
		case 'save':
			response = dialog.showSaveDialog(mainWindow, options)
			break
		case 'message':
				// Give all message boxes the sia icon by default
			if (!options.icon) {
				options.icon = Path.join(__dirname, '../..', 'assets', 'icon.png')
			}
			response = dialog.showMessageBox(mainWindow, options)
			break
		case 'error':
			dialog.showErrorBox(options.title, options.content)
			break
		default:
			console.error('Unknown dialog ipc')
		}
		// Can't return an `undefined` from synchronous ipc because it will
		// keep the renderer waiting for a response, thus blocking it
		if (response === undefined) {
			response = null
		}
		// TODO: Make async and adapt plugins
		event.returnValue = response
	})

	// Enable right-click context menu from renderer process event
	ipcMain.on('context-menu', () => {
		ContextMenu.popup(mainWindow)
	})

	// Allow any process to interact with the configManager
	ipcMain.on('config', (event, key, value) => {
		event.returnValue = config.attr(key, value)
	})
}

