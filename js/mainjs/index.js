import { app, Tray } from 'electron'
import appTray from './trayMenu.js'
import Path from 'path'
import loadConfig from './config.js'
import initWindow from './initWindow.js'
import Siad from 'sia.js'

// load config.json manager
global.config = loadConfig(Path.join(__dirname, '../config.json'))
let mainWindow
let appIcon

// When Electron loading has finished, start Sia-UI.
app.on('ready', () => {
	// Load mainWindow
	mainWindow = initWindow(config)
	appIcon = new Tray(Path.join(app.getAppPath(), 'assets', 'tray.png'))
	appIcon.setToolTip('Sia - The Collaborative Cloud.')
	appIcon.setContextMenu(appTray(mainWindow))
})

// Quit once all windows have been closed.
app.on('window-all-closed', () => {
	app.quit()
})

// On quit, save the config, and stop siad if it is running attached.
app.on('quit', () => {
	Siad.configure(config.attr('siad'))
	if (!config.siad.detached) {
		Siad.stop()
	}
	config.save()
})
