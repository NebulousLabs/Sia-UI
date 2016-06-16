import { app, Tray } from 'electron'
import appTray from './js/mainjs/trayMenu.js'
import Path from 'path'
import loadConfig from './js/mainjs/config.js'
import initWindow from './js/mainjs/initWindow.js'

// load config.json manager
const config = loadConfig(Path.join(__dirname, './config.json'))
let mainWindow

// When Electron loading has finished, start Sia-UI.
app.on('ready', () => {
	// Load mainWindow
	mainWindow = initWindow(config)

	// Load tray icon and menu
	const appIcon = new Tray(Path.join(__dirname, 'assets', 'tray.png'))
	appIcon.setToolTip('Sia - The Collaborative Cloud.')
	appIcon.setContextMenu(appTray(mainWindow))
	mainWindow.toggleDevTools()
})

// Quit once all windows have been closed.
app.on('window-all-closed', () => {
	config.save()
	app.quit()
})

