import { app, Tray } from 'electron'
import appTray from './trayMenu.js'
import Path from 'path'
import loadConfig from './config.js'
import initWindow from './initWindow.js'

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
	config.save()
	app.quit()
})
