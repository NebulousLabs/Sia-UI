import { Menu, BrowserWindow } from 'electron'
import appMenu from './appMenu.js'
import Path from 'path'
import Siad from 'sia.js'

// Main process logic partitioned to other files
// Creates the window and loads index.html
export default function(config) {
	// Create the browser
	const iconPath = Path.join(__dirname, '../..', 'assets', 'icon.png')
	const mainWindow = new BrowserWindow({
		icon:   iconPath,
		title:  'Sia-UI-beta',
	})
	// Set mainWindow's closeToTray flag from config.
	// This should be used in the renderer to cancel close() events using window.onbeforeunload
	mainWindow.closeToTray = config.closeToTray

	// Load the window's size and position
	mainWindow.setBounds(config)

	// Emitted when the window is closing.
	mainWindow.on('close', () => {
		// Save the window's size and position
		var bounds = mainWindow.getBounds()
		for (var k in bounds) {
			if (bounds.hasOwnProperty(k)) {
				config[k] = bounds[k]
			}
		}
	})
	// Unregister all shortcuts when mainWindow is closed.
	// Stop Siad if it is not running detached.
	mainWindow.on('closed', () => {
		if (!config.siad.detached) {
			Siad.stop()
		}
	})

	// Load the index.html of the app.
	mainWindow.loadURL(Path.join('file://', __dirname, '..', '..', 'index.html'))
	// Choose not to show the menubar
	if (process.platform !== 'darwin') {
		mainWindow.setMenuBarVisibility(false)
	} else {
		// Create the Application's main menu - OSX version might feel weird without a menubar
		Menu.setApplicationMenu(appMenu(mainWindow))
	}
	return mainWindow
}
